import { NextResponse } from "next/server"
import { randomBytes } from "node:crypto"
import { ethers } from "ethers"
import { generateBillingProof, normalizeModelIdHex, toProofInput } from "@/lib/zk/proof"
import { getRuntimeConfig } from "@/lib/config"

const demoSecrets = new Map<string, bigint>()

function getDemoSecret(userAddress: string) {
  const existing = demoSecrets.get(userAddress)
  if (existing) return existing
  const random = BigInt(`0x${randomBytes(31).toString("hex")}`)
  demoSecrets.set(userAddress, random)
  return random
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userAddress = body.userAddress as string
    const modelId = body.modelId as string
    const inputTokens = body.inputTokens as number | string
    const outputTokens = body.outputTokens as number | string
    const nonce = body.nonce as string | number | undefined
    const demoMode = Boolean(body.demoMode)
    let userSecret = body.userSecret as string | undefined

    if (!userAddress || !modelId) {
      return NextResponse.json({ error: "Missing userAddress or modelId" }, { status: 400 })
    }
    if (!ethers.isAddress(userAddress)) {
      return NextResponse.json({ error: "Invalid userAddress" }, { status: 400 })
    }
    if (inputTokens === undefined || outputTokens === undefined) {
      return NextResponse.json({ error: "Missing token counts" }, { status: 400 })
    }
    if (typeof inputTokens === "number" && !Number.isFinite(inputTokens)) {
      return NextResponse.json({ error: "Invalid inputTokens" }, { status: 400 })
    }
    if (typeof outputTokens === "number" && !Number.isFinite(outputTokens)) {
      return NextResponse.json({ error: "Invalid token counts" }, { status: 400 })
    }
    if (typeof inputTokens === "string" && !/^\d+$/.test(inputTokens)) {
      return NextResponse.json({ error: "Invalid inputTokens" }, { status: 400 })
    }
    if (typeof outputTokens === "string" && !/^\d+$/.test(outputTokens)) {
      return NextResponse.json({ error: "Invalid outputTokens" }, { status: 400 })
    }

    const appConfig = getRuntimeConfig()
    if (!appConfig.network.rpcUrl || !appConfig.billingContract) {
      return NextResponse.json({ error: "RPC or billing contract not configured" }, { status: 500 })
    }

    const provider = new ethers.JsonRpcProvider(appConfig.network.rpcUrl)
    const modelIdHex = normalizeModelIdHex(modelId)
    const contract = new ethers.Contract(
      appConfig.billingContract,
      ["function pricePerTokenWei(bytes32) view returns (uint256)"],
      provider,
    )

    const pricePerTokenWei = await contract.pricePerTokenWei(modelIdHex)
    if (pricePerTokenWei === 0n) {
      return NextResponse.json({ error: "Model price not set on-chain" }, { status: 400 })
    }

    const nonceValue = nonce ? BigInt(nonce) : BigInt(`0x${randomBytes(31).toString("hex")}`)
    if (!userSecret && demoMode) {
      userSecret = getDemoSecret(userAddress).toString()
    }
    if (!userSecret) {
      return NextResponse.json({ error: "Missing userSecret" }, { status: 400 })
    }

    const proof = await generateBillingProof(
      toProofInput({
        userAddress,
        modelId: modelIdHex,
        inputTokens,
        outputTokens,
        pricePerTokenWei,
        nonce: nonceValue,
        userSecret,
      }),
    )

    return NextResponse.json({
      proof,
      modelId: modelIdHex,
      inputTokens,
      outputTokens,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Proof generation failed" }, { status: 500 })
  }
}
