import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { getRuntimeConfig } from "@/lib/config"
import { normalizeModelIdHex } from "@/lib/zk/proof"

type ProofPayload = {
  a: string[]
  b: string[][]
  c: string[]
}

function isArrayOfLength(value: unknown, length: number) {
  return Array.isArray(value) && value.length === length
}

function isValidProof(proof: ProofPayload) {
  return (
    proof &&
    isArrayOfLength(proof.a, 2) &&
    isArrayOfLength(proof.b, 2) &&
    isArrayOfLength(proof.b[0], 2) &&
    isArrayOfLength(proof.b[1], 2) &&
    isArrayOfLength(proof.c, 2)
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userAddress = body.userAddress as string
    const modelId = body.modelId as string
    const usageHash = body.usageHash as string
    const nullifier = body.nullifier as string
    const pricePerTokenWei = body.pricePerTokenWei as string
    const costWei = body.costWei as string
    const proof = body.proof as ProofPayload

    if (!userAddress || !modelId || !usageHash || !nullifier || !pricePerTokenWei || !costWei || !proof) {
      return NextResponse.json({ error: "Missing charge payload" }, { status: 400 })
    }
    if (!ethers.isAddress(userAddress)) {
      return NextResponse.json({ error: "Invalid userAddress" }, { status: 400 })
    }
    if (!ethers.isHexString(usageHash, 32) || !ethers.isHexString(nullifier, 32)) {
      return NextResponse.json({ error: "Invalid usageHash or nullifier" }, { status: 400 })
    }
    if (!/^\d+$/.test(pricePerTokenWei) || !/^\d+$/.test(costWei)) {
      return NextResponse.json({ error: "Invalid price or cost" }, { status: 400 })
    }
    if (!isValidProof(proof)) {
      return NextResponse.json({ error: "Invalid proof format" }, { status: 400 })
    }

    const appConfig = getRuntimeConfig()
    if (!appConfig.network.rpcUrl || !appConfig.billingContract) {
      return NextResponse.json({ error: "RPC or billing contract not configured" }, { status: 500 })
    }

    const billingKey = process.env.BILLING_PRIVATE_KEY
    if (!billingKey) {
      return NextResponse.json({ error: "Billing signer not configured" }, { status: 500 })
    }

    const provider = new ethers.JsonRpcProvider(appConfig.network.rpcUrl)
    const signer = new ethers.Wallet(billingKey, provider)
    const contract = new ethers.Contract(
      appConfig.billingContract,
      [
        "function billingRole() view returns (address)",
        "function chargeWithProof(address,bytes32,uint256,uint256,bytes32,bytes32,uint256[2],uint256[2][2],uint256[2])",
      ],
      signer,
    )

    const billingRole = await contract.billingRole()
    if (ethers.getAddress(billingRole) !== signer.address) {
      return NextResponse.json({ error: "Signer is not billing role" }, { status: 403 })
    }

    const modelIdHex = normalizeModelIdHex(modelId)
    const tx = await contract.chargeWithProof(
      userAddress,
      modelIdHex,
      pricePerTokenWei,
      costWei,
      usageHash,
      nullifier,
      proof.a,
      proof.b,
      proof.c,
    )
    const receipt = await tx.wait()

    return NextResponse.json({
      txHash: receipt?.hash ?? tx.hash,
      blockNumber: receipt?.blockNumber ?? null,
      status: receipt?.status ?? null,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Charge failed" }, { status: 500 })
  }
}
