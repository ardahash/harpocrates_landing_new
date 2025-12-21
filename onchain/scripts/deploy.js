// scripts/deploy-zk-billing.js
const hre = require("hardhat")

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function waitWithTimeout(promise, ms, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

async function buildGasOverrides() {
  const provider = hre.ethers.provider
  const fee = await provider.getFeeData()

  const overrides = {}

  if (process.env.GAS_LIMIT) {
    overrides.gasLimit = BigInt(process.env.GAS_LIMIT)
  } else {
    // Avoid gas estimation stalls on flaky RPCs.
    overrides.gasLimit = 6_000_000n
  }

  // Prefer explicit env overrides if provided
  const maxFeeGwei = process.env.MAX_FEE_GWEI
  const maxPrioGwei = process.env.MAX_PRIORITY_FEE_GWEI
  const gasPriceGwei = process.env.GAS_PRICE_GWEI

  if (maxFeeGwei && maxPrioGwei) {
    overrides.maxFeePerGas = hre.ethers.parseUnits(maxFeeGwei, "gwei")
    overrides.maxPriorityFeePerGas = hre.ethers.parseUnits(maxPrioGwei, "gwei")
  } else if (fee.maxFeePerGas && fee.maxPriorityFeePerGas) {
    overrides.maxFeePerGas = fee.maxFeePerGas
    overrides.maxPriorityFeePerGas = fee.maxPriorityFeePerGas
  } else if (gasPriceGwei) {
    overrides.gasPrice = hre.ethers.parseUnits(gasPriceGwei, "gwei")
  } else if (fee.gasPrice) {
    overrides.gasPrice = fee.gasPrice
  }

  return { overrides, fee }
}

async function sendAndWait(txPromise, label, confirmations = 1) {
  const tx = await txPromise
  console.log(`${label} tx:`, tx.hash)
  // Horizen L3 testnets can sometimes be slow to include txs; give it a sane timeout.
  const receipt = await waitWithTimeout(tx.wait(confirmations), 180_000, `${label} receipt wait`)
  console.log(`${label} mined: block=${receipt.blockNumber} status=${receipt.status}`)
  return receipt
}

async function deployAndWait(factory, args, gasOverrides, label) {
  const contract = await factory.deploy(...args, gasOverrides)
  const deployTx = contract.deploymentTransaction()
  if (!deployTx) throw new Error(`${label}: missing deploymentTransaction()`)

  console.log(`${label} deploy tx:`, deployTx.hash)

  await waitWithTimeout(deployTx.wait(1), 180_000, `${label} deployment wait`)

  const addr = await contract.getAddress()
  const code = await hre.ethers.provider.getCode(addr)
  if (!code || code === "0x") {
    throw new Error(`${label}: deployed address has no code. addr=${addr}`)
  }

  console.log(`${label} deployed at:`, addr)
  return contract
}

async function main() {
  // Make polling a bit more responsive
  hre.ethers.provider.pollingInterval = 2000

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying with:", deployer.address)

  // Sanity-check RPC health and network
  const net = await hre.ethers.provider.getNetwork()
  const block1 = await hre.ethers.provider.getBlockNumber()
  await sleep(1200)
  const block2 = await hre.ethers.provider.getBlockNumber()
  console.log("chainId:", net.chainId.toString())
  console.log("blockNumber:", block1, "->", block2, block2 > block1 ? "(advancing)" : "(not advancing?)")

  // Nonce sanity check (stuck pending txs can block mining)
  const latestNonce = await hre.ethers.provider.getTransactionCount(deployer.address, "latest")
  const pendingNonce = await hre.ethers.provider.getTransactionCount(deployer.address, "pending")
  console.log("nonces:", { latestNonce, pendingNonce })
  if (pendingNonce > latestNonce) {
    console.warn(
      "Warning: you have pending transactions. If deploy hangs, you may need to speed up/cancel the stuck tx or use a fresh deployer."
    )
  }

  const billingRole = process.env.BILLING_ROLE || deployer.address
  console.log("Billing role:", billingRole)

  const { overrides: gasOverrides, fee } = await buildGasOverrides()
  console.log("feeData:", {
    gasPrice: fee.gasPrice?.toString(),
    maxFeePerGas: fee.maxFeePerGas?.toString(),
    maxPriorityFeePerGas: fee.maxPriorityFeePerGas?.toString(),
  })
  console.log("gasOverrides:", Object.fromEntries(Object.entries(gasOverrides).map(([k, v]) => [k, v?.toString?.() ?? v])))

  // --- Deploy Verifier ---
  const Verifier = await hre.ethers.getContractFactory("Groth16Verifier")
  const verifier = await deployAndWait(Verifier, [], gasOverrides, "Groth16Verifier")

  // --- Deploy Billing ---
  const Billing = await hre.ethers.getContractFactory("HarpocratesBilling")
  const billing = await deployAndWait(Billing, [billingRole], gasOverrides, "HarpocratesBilling")

  // --- Wire verifier into billing ---
  await sendAndWait(billing.setVerifier(await verifier.getAddress(), gasOverrides), "setVerifier")

  // --- Optional zkOnly ---
  const zkOnly = process.env.ZK_ONLY === "true"
  if (zkOnly) {
    if (typeof billing.setZkOnly !== "function") {
      console.warn("ZK_ONLY=true but setZkOnly() not found on HarpocratesBilling ABI; skipping.")
    } else {
      await sendAndWait(billing.setZkOnly(true, gasOverrides), "setZkOnly")
    }
  }

  console.log("\n=== Done ===")
  console.log("Verifier deployed to:", await verifier.getAddress())
  console.log("HarpocratesBilling deployed to:", await billing.getAddress())
  console.log("Billing role:", billingRole)
  console.log("ZK-only mode:", zkOnly)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
