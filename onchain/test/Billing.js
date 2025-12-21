const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { ethers, network } = require("hardhat")
const fs = require("node:fs")
const path = require("node:path")

const TWO_POW_128 = 2n ** 128n

function limbsToBigInt(lo, hi) {
  return BigInt(lo) + BigInt(hi) * TWO_POW_128
}

function toBytes32(value) {
  return ethers.toBeHex(value, 32)
}

function loadProofFixture() {
  const proofPath = path.join(__dirname, "..", "..", "zk", "build", "proof.json")
  const publicPath = path.join(__dirname, "..", "..", "zk", "build", "public.json")

  if (!fs.existsSync(proofPath) || !fs.existsSync(publicPath)) {
    throw new Error("Missing zk/build proof outputs. Run npm run zk:build && npm run zk:prove before tests.")
  }

  const proof = JSON.parse(fs.readFileSync(proofPath, "utf8"))
  const publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf8"))
  if (!Array.isArray(publicSignals) || publicSignals.length < 12) {
    throw new Error("public.json missing expected signals")
  }

  const a = [proof.pi_a[0], proof.pi_a[1]]
  const b = [
    [proof.pi_b[0][1], proof.pi_b[0][0]],
    [proof.pi_b[1][1], proof.pi_b[1][0]],
  ]
  const c = [proof.pi_c[0], proof.pi_c[1]]

  const [
    userLo,
    userHi,
    modelIdLo,
    modelIdHi,
    priceLo,
    priceHi,
    costLo,
    costHi,
    usageLo,
    usageHi,
    nullLo,
    nullHi,
  ] = publicSignals.map((value) => BigInt(value))

  const userField = limbsToBigInt(userLo, userHi)
  const modelIdField = limbsToBigInt(modelIdLo, modelIdHi)
  const priceField = limbsToBigInt(priceLo, priceHi)
  const costField = limbsToBigInt(costLo, costHi)
  const usageField = limbsToBigInt(usageLo, usageHi)
  const nullifierField = limbsToBigInt(nullLo, nullHi)

  return {
    a,
    b,
    c,
    userAddress: ethers.getAddress(ethers.toBeHex(userField, 20)),
    modelId: toBytes32(modelIdField),
    pricePerTokenWei: priceField,
    costWei: costField,
    usageHash: toBytes32(usageField),
    nullifier: toBytes32(nullifierField),
  }
}

async function fundUserAddress(contract, funder, userAddress, amountWei) {
  const fundingAmount = amountWei + ethers.parseEther("0.01")
  await funder.sendTransaction({ to: userAddress, value: fundingAmount })
  await network.provider.request({ method: "hardhat_impersonateAccount", params: [userAddress] })
  const signer = await ethers.getSigner(userAddress)
  await contract.connect(signer).fund({ value: fundingAmount })
  await network.provider.request({ method: "hardhat_stopImpersonatingAccount", params: [userAddress] })
  return fundingAmount
}

describe("HarpocratesBilling", () => {
  async function deployFixture() {
    const [owner, billing, user] = await ethers.getSigners()
    const Verifier = await ethers.getContractFactory("Groth16Verifier")
    const verifier = await Verifier.deploy()
    const Billing = await ethers.getContractFactory("HarpocratesBilling")
    const contract = await Billing.deploy(billing.address)
    await contract.setVerifier(await verifier.getAddress())
    return { owner, billing, user, contract }
  }

  it("allows funding and withdraw", async () => {
    const { user, contract } = await loadFixture(deployFixture)
    await contract.connect(user).fund({ value: ethers.parseEther("1") })
    expect(await contract.balances(user.address)).to.equal(ethers.parseEther("1"))
    await contract.connect(user).withdraw(ethers.parseEther("0.4"))
    expect(await contract.balances(user.address)).to.equal(ethers.parseEther("0.6"))
  })

  it("charges using billing role and emits receipt", async () => {
    const { billing, user, contract } = await loadFixture(deployFixture)
    const modelId = ethers.encodeBytes32String("llm-secure-7b")
    await contract.setPrice(modelId, ethers.parseUnits("1", "gwei"))
    await contract.connect(user).fund({ value: ethers.parseEther("1") })

    const tx = await contract
      .connect(billing)
      .charge(user.address, modelId, 10, 20, ethers.encodeBytes32String("usage"))
    const receipt = await tx.wait()
    const event = receipt.logs.find((l) => contract.interface.parseLog(l).name === "UserCharged")
    const parsed = contract.interface.parseLog(event)
    expect(parsed.args.user).to.equal(user.address)
    expect(parsed.args.costWei).to.equal(ethers.parseUnits("30", "gwei"))
    expect(await contract.balances(user.address)).to.equal(ethers.parseEther("1") - ethers.parseUnits("30", "gwei"))
  })

  it("blocks unauthorized charge", async () => {
    const { user, contract } = await loadFixture(deployFixture)
    const modelId = ethers.encodeBytes32String("llm-secure-7b")
    await contract.setPrice(modelId, ethers.parseUnits("1", "gwei"))
    await expect(
      contract.connect(user).charge(user.address, modelId, 1, 1, ethers.ZeroHash)
    ).to.be.revertedWith("not billing")
  })

  it("charges with a valid proof", async () => {
    const { owner, billing, contract } = await loadFixture(deployFixture)
    const proof = loadProofFixture()
    await contract.setPrice(proof.modelId, proof.pricePerTokenWei)
    const funded = await fundUserAddress(contract, owner, proof.userAddress, proof.costWei)

    await expect(
      contract
        .connect(billing)
        .chargeWithProof(
          proof.userAddress,
          proof.modelId,
          proof.pricePerTokenWei,
          proof.costWei,
          proof.usageHash,
          proof.nullifier,
          proof.a,
          proof.b,
          proof.c,
        )
    ).to.emit(contract, "UserCharged")

    expect(await contract.nullifierUsed(proof.nullifier)).to.equal(true)
    expect(await contract.balances(proof.userAddress)).to.equal(funded - proof.costWei)
  })

  it("rejects replayed nullifier", async () => {
    const { owner, billing, contract } = await loadFixture(deployFixture)
    const proof = loadProofFixture()
    await contract.setPrice(proof.modelId, proof.pricePerTokenWei)
    await fundUserAddress(contract, owner, proof.userAddress, proof.costWei)

    await contract
      .connect(billing)
      .chargeWithProof(
        proof.userAddress,
        proof.modelId,
        proof.pricePerTokenWei,
        proof.costWei,
        proof.usageHash,
        proof.nullifier,
        proof.a,
        proof.b,
        proof.c,
      )

    await expect(
      contract
        .connect(billing)
        .chargeWithProof(
          proof.userAddress,
          proof.modelId,
          proof.pricePerTokenWei,
          proof.costWei,
          proof.usageHash,
          proof.nullifier,
          proof.a,
          proof.b,
          proof.c,
        )
    ).to.be.revertedWith("nullifier used")
  })

  it("rejects wrong price input", async () => {
    const { owner, billing, contract } = await loadFixture(deployFixture)
    const proof = loadProofFixture()
    await contract.setPrice(proof.modelId, proof.pricePerTokenWei)
    await fundUserAddress(contract, owner, proof.userAddress, proof.costWei)

    await expect(
      contract
        .connect(billing)
        .chargeWithProof(
          proof.userAddress,
          proof.modelId,
          proof.pricePerTokenWei + 1n,
          proof.costWei,
          proof.usageHash,
          proof.nullifier,
          proof.a,
          proof.b,
          proof.c,
        )
    ).to.be.revertedWith("price mismatch")
  })

  it("rejects invalid proof", async () => {
    const { owner, billing, contract } = await loadFixture(deployFixture)
    const proof = loadProofFixture()
    await contract.setPrice(proof.modelId, proof.pricePerTokenWei)
    await fundUserAddress(contract, owner, proof.userAddress, proof.costWei)

    const badA = [...proof.a]
    badA[0] = (BigInt(badA[0]) + 1n).toString()

    await expect(
      contract
        .connect(billing)
        .chargeWithProof(
          proof.userAddress,
          proof.modelId,
          proof.pricePerTokenWei,
          proof.costWei,
          proof.usageHash,
          proof.nullifier,
          badA,
          proof.b,
          proof.c,
        )
    ).to.be.revertedWith("invalid proof")
  })
})
