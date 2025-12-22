const { execSync } = require("node:child_process")
const path = require("node:path")
const fs = require("node:fs")

const root = path.resolve(__dirname, "..")
const buildDir = path.join(root, "build")

const proof = path.join(buildDir, "proof.json")
const publicSignals = path.join(buildDir, "public.json")
const vkey = path.join(buildDir, "verification_key.json")

function run(cmd, cwd = root) {
  execSync(cmd, { stdio: "inherit", cwd })
}

if (!fs.existsSync(proof) || !fs.existsSync(publicSignals) || !fs.existsSync(vkey)) {
  throw new Error("Missing proof artifacts. Run npm run zk:prove first.")
}

console.log("Verifying proof...")
run(`snarkjs groth16 verify ${vkey} ${publicSignals} ${proof}`)
