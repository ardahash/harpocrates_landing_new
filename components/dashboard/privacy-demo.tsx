'use client'

import { useMemo, useState } from "react"
import { encrypt, decrypt, generateKey } from "@/lib/crypto"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type AttestationStub = {
  enclaveMeasurement: string
  proof: string
  receipt: string
}

export function PrivacyDemo() {
  const [ephemeralKey, setEphemeralKey] = useState<string>("")
  const [plaintext, setPlaintext] = useState("Classify this confidential document as legal, financial, or medical.")
  const [requestCipher, setRequestCipher] = useState<{ ciphertext: string; iv: string } | null>(null)
  const [responseCipher, setResponseCipher] = useState<{ ciphertext: string; iv: string } | null>(null)
  const [decryptedOutput, setDecryptedOutput] = useState<string>("")
  const [attestation, setAttestation] = useState<AttestationStub | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")

  const hasKey = useMemo(() => Boolean(ephemeralKey), [ephemeralKey])

  const handleGenerateKey = async () => {
    setError("")
    setDecryptedOutput("")
    setRequestCipher(null)
    setResponseCipher(null)
    setAttestation(null)
    const key = await generateKey()
    setEphemeralKey(key)
  }

  const handleRunDemo = async () => {
    if (!hasKey) {
      setError("Generate an ephemeral key first.")
      return
    }
    if (!plaintext.trim()) {
      setError("Enter some text to encrypt.")
      return
    }

    setIsBusy(true)
    setError("")
    setDecryptedOutput("")

    try {
      // Step 1: Encrypt client-side before sending to the service.
      const encryptedInput = await encrypt(plaintext, ephemeralKey)
      setRequestCipher(encryptedInput)

      // Step 2: Simulate enclave computation and attestation.
      const decryptedInsideTEE = await decrypt(encryptedInput, ephemeralKey)
      const processed = `Processed securely: ${decryptedInsideTEE}`
      const encryptedOutput = await encrypt(processed, ephemeralKey)
      setResponseCipher(encryptedOutput)
      setAttestation({
        enclaveMeasurement: "simulated-sgx-measurement",
        proof: "demo-only: no real ZK proof",
        receipt: "settled in ETH on Horizen L3 (demo)",
      })
    } catch (e: any) {
      setError(e?.message || "Unable to run demo.")
    } finally {
      setIsBusy(false)
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

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Privacy Demo</p>
          <h2 className="text-xl font-semibold">Client-side encryption flow</h2>
          <p className="text-sm text-muted-foreground">
            Keys stay on this page. Data is encrypted before send and decrypted only after attestation/receipt.
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
        <Button onClick={handleRunDemo} disabled={isBusy} className="md:w-44">
          {isBusy ? "Running..." : "Encrypt + Simulate"}
        </Button>
        <Button onClick={handleDecryptOutput} variant="secondary" disabled={!responseCipher || isBusy}>
          Decrypt output
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
          <h3 className="text-sm font-semibold">Request ciphertext</h3>
          <p className="text-[11px] text-muted-foreground break-all">{requestCipher?.ciphertext || "—"}</p>
          <p className="text-[11px] text-muted-foreground break-all">IV: {requestCipher?.iv || "—"}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
          <h3 className="text-sm font-semibold">Response ciphertext</h3>
          <p className="text-[11px] text-muted-foreground break-all">{responseCipher?.ciphertext || "—"}</p>
          <p className="text-[11px] text-muted-foreground break-all">IV: {responseCipher?.iv || "—"}</p>
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
              <span className="font-medium text-foreground">Proof:</span> {attestation.proof}
            </li>
            <li>
              <span className="font-medium text-foreground">Receipt:</span> {attestation.receipt}
            </li>
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">Run the demo to see a stub attestation.</p>
        )}
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
