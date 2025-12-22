'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { encrypt, decrypt, generateKey } from "@/lib/crypto"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { appConfig } from "@/lib/config"

type AttestationStub = {
  enclaveMeasurement: string
  proof: string
  receipt: string
}

type PrivacyDemoProps = {
  demoMode?: boolean
}

type BillingStatus = "idle" | "proving" | "charging" | "complete"

type BillingResult = {
  usageHash: string
  nullifier: string
  costWei: string
  pricePerTokenWei: string
  txHash?: string
}

const explorerBase = appConfig.network.explorer?.replace(/\/$/, "")
const SECRET_STORAGE_PREFIX = "harpocrates-user-secret:"

function isWholeNumber(value: string) {
  return /^\d+$/.test(value)
}

async function deriveDemoScalar(seed: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto is not available in this browser.")
  }
  const data = new TextEncoder().encode(seed)
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data)
  const bytes = Array.from(new Uint8Array(digest)).slice(0, 31)
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("")
  return BigInt(`0x${hex}`)
}

function generateRandomScalarHex() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random generator unavailable.")
  }
  const bytes = new Uint8Array(31)
  globalThis.crypto.getRandomValues(bytes)
  if (bytes.every((value) => value === 0)) {
    bytes[0] = 1
  }
  const hex = Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
  return `0x${hex}`
}

function getOrCreateUserSecret(address: string) {
  const key = `${SECRET_STORAGE_PREFIX}${address.toLowerCase()}`
  const stored = localStorage.getItem(key)
  if (stored) return stored
  const generated = generateRandomScalarHex()
  localStorage.setItem(key, generated)
  return generated
}

export function PrivacyDemo({ demoMode = false }: PrivacyDemoProps) {
  const [ephemeralKey, setEphemeralKey] = useState<string>("")
  const [plaintext, setPlaintext] = useState("Classify this confidential document as legal, financial, or medical.")
  const [requestCipher, setRequestCipher] = useState<{ ciphertext: string; iv: string } | null>(null)
  const [responseCipher, setResponseCipher] = useState<{ ciphertext: string; iv: string } | null>(null)
  const [decryptedOutput, setDecryptedOutput] = useState<string>("")
  const [attestation, setAttestation] = useState<AttestationStub | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")
  const autoRunRef = useRef(false)

  const [userAddress, setUserAddress] = useState(appConfig.demo?.userAddress ?? "")
  const [modelId, setModelId] = useState(appConfig.demo?.modelId ?? "llm-secure-7b")
  const [inputTokens, setInputTokens] = useState(appConfig.demo?.inputTokens ?? "120")
  const [outputTokens, setOutputTokens] = useState(appConfig.demo?.outputTokens ?? "80")
  const [userSecret, setUserSecret] = useState("")
  const [billingStatus, setBillingStatus] = useState<BillingStatus>("idle")
  const [billingError, setBillingError] = useState("")
  const [billingResult, setBillingResult] = useState<BillingResult | null>(null)

  const hasKey = useMemo(() => Boolean(ephemeralKey), [ephemeralKey])
  const isBillingBusy = billingStatus === "proving" || billingStatus === "charging"
  const explorerTxUrl = billingResult?.txHash && explorerBase ? `${explorerBase}/tx/${billingResult.txHash}` : ""

  const resetState = () => {
    setError("")
    setDecryptedOutput("")
    setRequestCipher(null)
    setResponseCipher(null)
    setAttestation(null)
  }

  const resetBillingState = () => {
    setBillingError("")
    setBillingStatus("idle")
    setBillingResult(null)
  }

  const handleGenerateKey = async () => {
    resetState()
    const key = await generateKey()
    setEphemeralKey(key)
    return key
  }

  const runDemo = async (keyValue: string, autoDecrypt = false) => {
    if (!plaintext.trim()) {
      setError("Enter some text to encrypt.")
      return
    }

    setIsBusy(true)
    setError("")
    setDecryptedOutput("")

    try {
      const encryptedInput = await encrypt(plaintext, keyValue)
      setRequestCipher(encryptedInput)

      const decryptedInsideTEE = await decrypt(encryptedInput, keyValue)
      const processed = `Processed securely: ${decryptedInsideTEE}`
      const encryptedOutput = await encrypt(processed, keyValue)
      setResponseCipher(encryptedOutput)
      setAttestation({
        enclaveMeasurement: "simulated-sgx-measurement",
        proof: "Groth16 billing proof pending",
        receipt: "Awaiting on-chain charge",
      })

      if (autoDecrypt) {
        const plaintextOut = await decrypt(encryptedOutput, keyValue)
        setDecryptedOutput(plaintextOut)
      }
    } catch (e: any) {
      setError(e?.message || "Unable to run demo.")
    } finally {
      setIsBusy(false)
    }
  }

  const handleRunDemo = async () => {
    if (!hasKey) {
      setError("Generate an ephemeral key first.")
      return
    }
    await runDemo(ephemeralKey, false)
  }

  const handleRunFullDemo = async () => {
    const keyValue = hasKey ? ephemeralKey : await handleGenerateKey()
    await runDemo(keyValue, true)
    if (demoMode) {
      await handleProofAndCharge({ silent: true })
    }
  }

  const handleDecryptOutput = async () => {
    if (!responseCipher || !hasKey) {
      setError("No response to decrypt yet.")
      return
    }
    try {
      const plaintextOut = await decrypt(responseCipher, ephemeralKey)
      setDecryptedOutput(plaintextOut)
    } catch (e: any) {
      setError(e?.message || "Unable to decrypt output.")
    }
  }

  const handleProofAndCharge = async (options?: { silent?: boolean }) => {
    if (!userAddress.trim()) {
      if (!options?.silent) {
        setBillingError("Enter a funded user address to charge.")
      }
      return
    }
    if (!modelId.trim()) {
      if (!options?.silent) {
        setBillingError("Enter a model ID to price.")
      }
      return
    }
    if (!isWholeNumber(inputTokens) || !isWholeNumber(outputTokens)) {
      if (!options?.silent) {
        setBillingError("Token counts must be whole numbers.")
      }
      return
    }

    setBillingStatus("proving")
    setBillingError("")
    setBillingResult(null)

    try {
      const payload: Record<string, unknown> = {
        userAddress,
        modelId,
        inputTokens,
        outputTokens,
        demoMode,
      }

      if (demoMode) {
        const [secret, nonce] = await Promise.all([
          deriveDemoScalar(`secret:${userAddress}:${modelId}`),
          deriveDemoScalar(`nonce:${userAddress}:${modelId}`),
        ])
        payload.userSecret = secret.toString()
        payload.nonce = nonce.toString()
      } else {
        const secret = userSecret || getOrCreateUserSecret(userAddress)
        setUserSecret(secret)
        payload.userSecret = BigInt(secret).toString()
      }

      const proveRes = await fetch("/api/zk/prove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!proveRes.ok) {
        const data = await proveRes.json()
        throw new Error(data?.error || "Proof generation failed.")
      }
      const proveData = await proveRes.json()
      const proof = proveData.proof as BillingResult & {
        proof: { a: string[]; b: string[][]; c: string[] }
      }

      setBillingResult({
        usageHash: proof.usageHash,
        nullifier: proof.nullifier,
        costWei: proof.costWei,
        pricePerTokenWei: proof.pricePerTokenWei,
      })

      setBillingStatus("charging")
      const chargeRes = await fetch("/api/zk/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress,
          modelId: proveData.modelId || modelId,
          usageHash: proof.usageHash,
          nullifier: proof.nullifier,
          pricePerTokenWei: proof.pricePerTokenWei,
          costWei: proof.costWei,
          proof: proof.proof,
        }),
      })
      if (!chargeRes.ok) {
        const data = await chargeRes.json()
        throw new Error(data?.error || "Charge failed.")
      }
      const chargeData = await chargeRes.json()

      setBillingResult((prev) =>
        prev
          ? { ...prev, txHash: chargeData.txHash }
          : {
              usageHash: proof.usageHash,
              nullifier: proof.nullifier,
              costWei: proof.costWei,
              pricePerTokenWei: proof.pricePerTokenWei,
              txHash: chargeData.txHash,
            },
      )
      setBillingStatus("complete")
    } catch (e: any) {
      setBillingStatus("idle")
      setBillingError(e?.message || "Unable to submit proof.")
    }
  }

  useEffect(() => {
    if (!demoMode) {
      autoRunRef.current = false
      return
    }
    if (autoRunRef.current) return
    autoRunRef.current = true
    void handleRunFullDemo()
  }, [demoMode])

  useEffect(() => {
    if (!userAddress || demoMode) {
      setUserSecret("")
      return
    }
    try {
      const secret = getOrCreateUserSecret(userAddress)
      setUserSecret(secret)
    } catch (e: any) {
      setBillingError(e?.message || "Unable to initialize user secret.")
    }
  }, [userAddress, demoMode])

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Privacy Demo</p>
          <h2 className="text-xl font-semibold">Client-side encryption flow</h2>
          <p className="text-sm text-muted-foreground">
            Keys stay on this page. Data is encrypted before send and decrypted only after attestation and billing.
          </p>
        </div>
        <Button onClick={handleGenerateKey} variant="outline">
          {hasKey ? "Regenerate key" : "Generate key"}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Input (plaintext)</label>
        <Textarea
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Enter sensitive text..."
          rows={3}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Button onClick={handleRunFullDemo} disabled={isBusy} className="md:w-44">
          {isBusy ? "Running..." : "Run full demo"}
        </Button>
        <Button onClick={handleRunDemo} variant="outline" disabled={isBusy || !hasKey}>
          Encrypt + Simulate
        </Button>
        <Button onClick={handleDecryptOutput} variant="secondary" disabled={!responseCipher || isBusy}>
          Decrypt output
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
          <h3 className="text-sm font-semibold">Request ciphertext</h3>
          <p className="text-[11px] text-muted-foreground break-all">
            {requestCipher?.ciphertext || "Not generated yet"}
          </p>
          <p className="text-[11px] text-muted-foreground break-all">IV: {requestCipher?.iv || "Not generated yet"}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
          <h3 className="text-sm font-semibold">Response ciphertext</h3>
          <p className="text-[11px] text-muted-foreground break-all">
            {responseCipher?.ciphertext || "Not generated yet"}
          </p>
          <p className="text-[11px] text-muted-foreground break-all">IV: {responseCipher?.iv || "Not generated yet"}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
        <h3 className="text-sm font-semibold">Attestation (demo)</h3>
        {attestation ? (
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              <span className="font-medium text-foreground">Enclave measurement:</span> {attestation.enclaveMeasurement}
            </li>
            <li>
              <span className="font-medium text-foreground">Proof:</span>{" "}
              {billingStatus === "complete" ? "Groth16 billing proof verified on-chain" : attestation.proof}
            </li>
            <li>
              <span className="font-medium text-foreground">Receipt:</span>{" "}
              {billingResult?.txHash ? "Charged in ETH on Horizen L3" : attestation.receipt}
            </li>
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">Run the demo to see a stub attestation.</p>
        )}
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
        <h3 className="text-sm font-semibold">ZK Billing Proof</h3>
        <p className="text-xs text-muted-foreground">
          Generate a Groth16 proof that cost = (input + output) * price without revealing token counts on-chain.
        </p>
        {demoMode && !userAddress && (
          <p className="text-xs text-muted-foreground">
            Set a funded demo user address to enable one-click proof settlement.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Billing user address</label>
            <Input
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value.trim())}
              placeholder="0x..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Model ID</label>
            <Input
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder="llm-secure-7b or 0x..."
            />
          </div>
        </div>

        {!demoMode && userAddress && (
          <p className="text-[11px] text-muted-foreground">
            Billing secret is stored locally per address. Clear site data to regenerate.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Input tokens</label>
            <Input value={inputTokens} onChange={(e) => setInputTokens(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Output tokens</label>
            <Input value={outputTokens} onChange={(e) => setOutputTokens(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => handleProofAndCharge()} disabled={isBillingBusy}>
            {isBillingBusy ? "Submitting..." : "Generate proof + settle"}
          </Button>
          <Button variant="outline" onClick={resetBillingState} disabled={isBillingBusy}>
            Reset proof
          </Button>
        </div>

        {billingError && <p className="text-xs text-red-500">{billingError}</p>}

        {billingResult && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Cost (wei):</span> {billingResult.costWei}
            </p>
            <p>
              <span className="font-medium text-foreground">Price per token (wei):</span>{" "}
              {billingResult.pricePerTokenWei}
            </p>
            <p>
              <span className="font-medium text-foreground">Usage hash:</span> {billingResult.usageHash}
            </p>
            <p>
              <span className="font-medium text-foreground">Nullifier:</span> {billingResult.nullifier}
            </p>
            {billingStatus === "complete" && billingResult.txHash && (
              <p>
                <span className="font-medium text-foreground">Proof verified:</span> On-chain
                {explorerTxUrl ? (
                  <>
                    {" "}
                    -{" "}
                    <a
                      href={explorerTxUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {billingResult.txHash}
                    </a>
                  </>
                ) : (
                  ` - ${billingResult.txHash}`
                )}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
        <p>
          <span className="font-medium text-foreground">Privacy note:</span> The key never leaves your browser. Only
          ciphertext is shown and would be sent to the service. Enclave execution is simulated, but the billing proof is
          a real Groth16 proof verified on-chain.
        </p>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
        <h3 className="text-sm font-semibold">Decrypted output</h3>
        <Input value={decryptedOutput} readOnly placeholder="Decrypt response to view plaintext output" />
        <p className="text-[11px] text-muted-foreground">
          Output is decrypted locally using the same ephemeral key generated on this page.
        </p>
      </div>
    </div>
  )
}
