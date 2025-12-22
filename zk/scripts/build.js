const { execSync } = require("node:child_process")
const path = require("node:path")
const fs = require("node:fs")

const root = path.resolve(__dirname, "..")
const circuit = path.join(root, "circuits", "billing.circom")
const buildDir = path.join(root, "build")
const onchainVerifier = path.join(root, "..", "onchain", "contracts", "Verifier.sol")
const ptau = path.join(buildDir, "pot12_final.ptau")

function run(cmd, cwd = root, input) {
  if (input) {
    execSync(cmd, { stdio: ["pipe", "inherit", "inherit"], cwd, input })
    return
  }
  execSync(cmd, { stdio: "inherit", cwd })
}

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true })
}

console.log("Compiling circuit...")
const includePath = path.join(root, "..", "node_modules")
run(`circom ${circuit} --r1cs --wasm --sym -o ${buildDir} -l ${includePath}`)

if (!fs.existsSync(ptau)) {
  console.log("Generating powers of tau...")
  const entropy = `${process.env.ZK_ENTROPY || "harpocrates-demo-entropy"}\n`
  run(`snarkjs powersoftau new bn128 12 ${path.join(buildDir, "pot12_0000.ptau")} -v`)
  run(
    `snarkjs powersoftau contribute ${path.join(buildDir, "pot12_0000.ptau")} ${path.join(
      buildDir,
      "pot12_0001.ptau",
    )} --name="Harpocrates" -v`,
    root,
    entropy,
  )
  run(`snarkjs powersoftau prepare phase2 ${path.join(buildDir, "pot12_0001.ptau")} ${ptau}`)
}

console.log("Generating zkey...")
const r1cs = path.join(buildDir, "billing.r1cs")
const zkeyInitial = path.join(buildDir, "billing_0000.zkey")
const zkeyFinal = path.join(buildDir, "billing.zkey")
run(`snarkjs groth16 setup ${r1cs} ${ptau} ${zkeyInitial}`)
const zkeyEntropy = `${process.env.ZK_ENTROPY || "harpocrates-demo-entropy"}\n`
run(`snarkjs zkey contribute ${zkeyInitial} ${zkeyFinal} --name="Harpocrates" -v`, root, zkeyEntropy)
if (fs.existsSync(zkeyInitial)) {
  fs.unlinkSync(zkeyInitial)
}

console.log("Exporting verification key and verifier...")
run(`snarkjs zkey export verificationkey ${zkeyFinal} ${path.join(buildDir, "verification_key.json")}`)
const generatedVerifier = path.join(buildDir, "Verifier.sol")
run(`snarkjs zkey export solidityverifier ${zkeyFinal} ${generatedVerifier}`)

console.log("Copying verifier to onchain/contracts...")
fs.copyFileSync(generatedVerifier, onchainVerifier)

console.log("ZK build complete.")
