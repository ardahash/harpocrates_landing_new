const hre = require("hardhat")

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying with:", deployer.address)

  const billingRole = process.env.BILLING_ROLE || deployer.address
  const Billing = await hre.ethers.getContractFactory("HarpocratesBilling")
  const contract = await Billing.deploy(billingRole)
  await contract.waitForDeployment()

  console.log("HarpocratesBilling deployed to:", await contract.getAddress())
  console.log("Billing role:", billingRole)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
