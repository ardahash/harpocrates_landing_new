const fs = require("node:fs")
const path = require("node:path")
const circomlibjs = require("circomlibjs")

const TWO_POW_128 = BigInt("340282366920938463463374607431768211456")

function splitToLimbs(value) {
  const v = BigInt(value)
  const lo = v % TWO_POW_128
  const hi = v / TWO_POW_128
  return { lo: lo.toString(), hi: hi.toString() }
}

async function poseidonHash(inputs) {
  const poseidon = await circomlibjs.buildPoseidon()
  const field = poseidon.F
  return field.toString(poseidon(inputs.map((x) => BigInt(x))))
}

function readInput(inputPath) {
  const data = fs.readFileSync(inputPath, "utf8")
  return JSON.parse(data)
}

async function computeSignals(input) {
  const usageHash = await poseidonHash([
    input.userField,
    input.modelIdField,
    input.inputTokens,
    input.outputTokens,
    input.nonce,
  ])
  const nullifier = await poseidonHash([input.userSecret, usageHash])
  return { usageHash, nullifier }
}

function calculatePublicSignals(inputPath) {
  const input = readInput(inputPath)
  const userField = BigInt(input.userLo || 0) + BigInt(input.userHi || 0) * TWO_POW_128
  const modelIdField = BigInt(input.modelIdLo || 0) + BigInt(input.modelIdHi || 0) * TWO_POW_128
  const priceField = BigInt(input.priceLo || 0) + BigInt(input.priceHi || 0) * TWO_POW_128
  const costField = BigInt(input.costLo || 0) + BigInt(input.costHi || 0) * TWO_POW_128

  const payload = {
    ...input,
    userField,
    modelIdField,
  }

  return computeSignals(payload).then(({ usageHash, nullifier }) => {
    const usageLimbs = splitToLimbs(usageHash)
    const nullifierLimbs = splitToLimbs(nullifier)
    const publicSignals = {
      userLo: input.userLo,
      userHi: input.userHi,
      modelIdLo: input.modelIdLo,
      modelIdHi: input.modelIdHi,
      priceLo: input.priceLo,
      priceHi: input.priceHi,
      costLo: input.costLo,
      costHi: input.costHi,
      usageHashLo: usageLimbs.lo,
      usageHashHi: usageLimbs.hi,
      nullifierLo: nullifierLimbs.lo,
      nullifierHi: nullifierLimbs.hi,
      priceField: priceField.toString(),
      costField: costField.toString(),
    }

    const resolved = {
      ...input,
      usageHashLo: usageLimbs.lo,
      usageHashHi: usageLimbs.hi,
      nullifierLo: nullifierLimbs.lo,
      nullifierHi: nullifierLimbs.hi,
    }
    fs.writeFileSync(inputPath, JSON.stringify(resolved, null, 2))
    return publicSignals
  })
}

module.exports = {
  calculatePublicSignals,
  splitToLimbs,
}
