const { execSync } = require("node:child_process")
const path = require("node:path")
const fs = require("node:fs")
const { calculatePublicSignals } = require("../scripts/utils")

const root = path.resolve(__dirname, "..")
const buildDir = path.join(root, "build")
const inputFile = path.join(root, "inputs", "example.json")
const wasm = path.join(buildDir, "billing_js", "billing.wasm")
const zkey = path.join(buildDir, "billing.zkey")
const witness = path.join(buildDir, "witness.wtns")
const proofOut = path.join(buildDir, "proof.json")
const publicOut = path.join(buildDir, "public.json")

function run(cmd, cwd = root) {
  execSync(cmd, { stdio: "inherit", cwd })
}

if (!fs.existsSync(wasm) || !fs.existsSync(zkey)) {
  throw new Error("Missing build artifacts. Run npm run zk:build first.")
}

console.log("Computing example public signals...")
const publicSignals = calculatePublicSignals(inputFile)
fs.writeFileSync(publicOut, JSON.stringify(publicSignals, null, 2))

console.log("Generating witness...")
run(`node ${path.join(buildDir, "billing_js", "generate_witness.js")} ${wasm} ${inputFile} ${witness}`)

console.log("Generating proof...")
run(`snarkjs groth16 prove ${zkey} ${witness} ${proofOut} ${publicOut}`)

console.log("Proof written to", proofOut)
