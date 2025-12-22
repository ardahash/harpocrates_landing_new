import path from "path"
import fs from "fs"
import { ethers } from "ethers"

const TWO_POW_128 = BigInt("340282366920938463463374607431768211456")
const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")

export type BillingProofInput = {
  userAddress: string
  modelId: string
  inputTokens: bigint
  outputTokens: bigint
  pricePerTokenWei: bigint
  nonce: bigint
  userSecret: bigint
}

export type BillingProofOutput = {
  usageHash: string
  nullifier: string
  costWei: string
  pricePerTokenWei: string
  snarkProof: {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
    protocol: string
    curve: string
  }
  proof: {
    a: string[]
    b: string[][]
    c: string[]
  }
  publicSignals: string[]
}

function ensureArtifacts() {
  const wasmPath = path.join(process.cwd(), "zk", "build", "billing_js", "billing.wasm")
  const zkeyPath = path.join(process.cwd(), "zk", "build", "billing.zkey")

  if (!fs.existsSync(wasmPath) || !fs.existsSync(zkeyPath)) {
    throw new Error("Missing zk build artifacts. Run npm run zk:build first.")
  }
  return { wasmPath, zkeyPath }
}

function toHex32(value: bigint) {
  const hex = value.toString(16).padStart(64, "0")
  return `0x${hex}`
}

function splitToLimbs(value: bigint) {
  const lo = value % TWO_POW_128
  const hi = value / TWO_POW_128
  return { lo, hi }
}

function normalizeModelId(modelId: string) {
  if (modelId.startsWith("0x") && modelId.length === 66) {
    return modelId
  }
  return ethers.id(modelId)
}

function toBigInt(value: string | bigint | number) {
  if (typeof value === "bigint") return value
  if (typeof value === "number") return BigInt(value)
  return BigInt(value)
}

async function poseidonHash(inputs: bigint[]) {
  const circomlibjs = await import("circomlibjs")
  const poseidon = await circomlibjs.buildPoseidon()
  const field = poseidon.F
  const hash = poseidon(inputs)
  return BigInt(field.toObject(hash))
}

function toStringArray(values: unknown[]): string[] {
  return values.map((value) => value.toString())
}

function toStringMatrix(values: unknown[][]): string[][] {
  return values.map((row) => row.map((value) => value.toString()))
}

export async function generateBillingProof(input: BillingProofInput): Promise<BillingProofOutput> {
  const snarkjs = await import("snarkjs")
  const { wasmPath, zkeyPath } = ensureArtifacts()

  const userHex = ethers.getAddress(input.userAddress)
  const userField = BigInt(userHex)
  const modelIdHex = normalizeModelId(input.modelId)
  const modelField = BigInt(modelIdHex)

  const totalTokens = input.inputTokens + input.outputTokens
  const costWei = totalTokens * input.pricePerTokenWei

  if (costWei >= FIELD_MODULUS) {
    throw new Error("costWei exceeds field modulus")
  }

  const usageHashField = await poseidonHash([
    userField,
    modelField,
    input.inputTokens,
    input.outputTokens,
    input.nonce,
  ])
  const nullifierField = await poseidonHash([input.userSecret, usageHashField])

  const userLimbs = splitToLimbs(userField)
  const modelLimbs = splitToLimbs(modelField)
  const priceLimbs = splitToLimbs(input.pricePerTokenWei)
  const costLimbs = splitToLimbs(costWei)
  const usageLimbs = splitToLimbs(usageHashField)
  const nullifierLimbs = splitToLimbs(nullifierField)

  const witnessInput = {
    inputTokens: input.inputTokens.toString(),
    outputTokens: input.outputTokens.toString(),
    userSecret: input.userSecret.toString(),
    nonce: input.nonce.toString(),
    userLo: userLimbs.lo.toString(),
    userHi: userLimbs.hi.toString(),
    modelIdLo: modelLimbs.lo.toString(),
    modelIdHi: modelLimbs.hi.toString(),
    priceLo: priceLimbs.lo.toString(),
    priceHi: priceLimbs.hi.toString(),
    costLo: costLimbs.lo.toString(),
    costHi: costLimbs.hi.toString(),
    usageHashLo: usageLimbs.lo.toString(),
    usageHashHi: usageLimbs.hi.toString(),
    nullifierLo: nullifierLimbs.lo.toString(),
    nullifierHi: nullifierLimbs.hi.toString(),
  }

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(witnessInput, wasmPath, zkeyPath)
  const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals)
  const argv = calldata.replace(/["[\]\s]/g, "").split(",")
  const a = argv.slice(0, 2)
  const b = [argv.slice(2, 4), argv.slice(4, 6)]
  const c = argv.slice(6, 8)

  return {
    usageHash: toHex32(usageHashField),
    nullifier: toHex32(nullifierField),
    costWei: costWei.toString(),
    pricePerTokenWei: input.pricePerTokenWei.toString(),
    snarkProof: {
      pi_a: toStringArray(proof.pi_a),
      pi_b: toStringMatrix(proof.pi_b),
      pi_c: toStringArray(proof.pi_c),
      protocol: proof.protocol,
      curve: proof.curve,
    },
    proof: {
      a: toStringArray(a),
      b: toStringMatrix(b),
      c: toStringArray(c),
    },
    publicSignals: toStringArray(publicSignals),
  }
}

export function toProofInput(params: {
  userAddress: string
  modelId: string
  inputTokens: string | number
  outputTokens: string | number
  pricePerTokenWei: string | number | bigint
  nonce: string | number | bigint
  userSecret: string | number | bigint
}): BillingProofInput {
  return {
    userAddress: params.userAddress,
    modelId: params.modelId,
    inputTokens: toBigInt(params.inputTokens),
    outputTokens: toBigInt(params.outputTokens),
    pricePerTokenWei: toBigInt(params.pricePerTokenWei),
    nonce: toBigInt(params.nonce),
    userSecret: toBigInt(params.userSecret),
  }
}

export function normalizeModelIdHex(modelId: string) {
  return normalizeModelId(modelId)
}
