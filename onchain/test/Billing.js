const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("HarpocratesBilling", () => {
  async function deployFixture() {
    const [owner, billing, user] = await ethers.getSigners()
    const Billing = await ethers.getContractFactory("HarpocratesBilling")
    const contract = await Billing.deploy(billing.address)
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
})
