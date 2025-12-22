export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { getRuntimeConfig } from "@/lib/config"
import { normalizeModelIdHex } from "@/lib/zk/proof"
import fs from "node:fs"
import path from "node:path"

type ProofPayload = {
  a: string[]
  b: string[][]
  c: string[]
}

const TWO_POW_128 = BigInt("340282366920938463463374607431768211456")
const SIGNAL_LABELS = [
  "userLo",
  "userHi",
  "modelIdLo",
  "modelIdHi",
  "priceLo",
  "priceHi",
  "costLo",
  "costHi",
  "usageHashLo",
  "usageHashHi",
  "nullifierLo",
  "nullifierHi",
]

function splitToLimbs(value: bigint) {
  const lo = value % TWO_POW_128
  const hi = value / TWO_POW_128
  return { lo, hi }
}

function toBigInt(value: string) {
  return BigInt(value)
}

function buildExpectedSignals(params: {
  userAddress: string
  modelId: string
  pricePerTokenWei: string
  costWei: string
  usageHash: string
  nullifier: string
}) {
  const userField = BigInt(ethers.getAddress(params.userAddress))
  const modelField = BigInt(params.modelId)
  const priceField = toBigInt(params.pricePerTokenWei)
  const costField = toBigInt(params.costWei)
  const usageField = BigInt(params.usageHash)
  const nullField = BigInt(params.nullifier)

  const userLimbs = splitToLimbs(userField)
  const modelLimbs = splitToLimbs(modelField)
  const priceLimbs = splitToLimbs(priceField)
  const costLimbs = splitToLimbs(costField)
  const usageLimbs = splitToLimbs(usageField)
  const nullLimbs = splitToLimbs(nullField)

  return [
    userLimbs.lo,
    userLimbs.hi,
    modelLimbs.lo,
    modelLimbs.hi,
    priceLimbs.lo,
    priceLimbs.hi,
    costLimbs.lo,
    costLimbs.hi,
    usageLimbs.lo,
    usageLimbs.hi,
    nullLimbs.lo,
    nullLimbs.hi,
  ].map((value) => value.toString())
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
    const publicSignals = body.publicSignals as string[] | undefined

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
    if (publicSignals && (!Array.isArray(publicSignals) || publicSignals.length !== 12)) {
      return NextResponse.json({ error: "Invalid public signals" }, { status: 400 })
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

    if (publicSignals) {
      const expected = buildExpectedSignals({
        userAddress,
        modelId: modelIdHex,
        pricePerTokenWei,
        costWei,
        usageHash,
        nullifier,
      })
      const provided = publicSignals.map((value) => value.toString())
      const matches = expected.every((value, index) => value === provided[index])
      if (!matches) {
        const diffs = expected
          .map((value, index) =>
            value === provided[index]
              ? null
              : { index, label: SIGNAL_LABELS[index], expected: value, received: provided[index] },
          )
          .filter(Boolean)
        console.error("zk/charge public signal mismatch", {
          expected,
          received: provided,
          diffs,
        })
        const debug =
          process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production"
            ? { diffs }
            : undefined
        return NextResponse.json({ error: "Public signals do not match inputs", debug }, { status: 400 })
      }

      const vkeyPath = path.join(process.cwd(), "zk", "build", "verification_key.json")
      if (!fs.existsSync(vkeyPath)) {
        return NextResponse.json({ error: "Missing verification key" }, { status: 500 })
      }
      const snarkjs = await import("snarkjs")
      const vkey = JSON.parse(fs.readFileSync(vkeyPath, "utf8"))
      const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof)
      if (!isValid) {
        return NextResponse.json({ error: "Proof verification failed off-chain" }, { status: 400 })
      }
    }
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
