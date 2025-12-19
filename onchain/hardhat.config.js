require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox")

const horizenRpc = process.env.HORIZEN_L3_RPC_URL || ""
const deployerKey = process.env.DEPLOYER_PRIVATE_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    horizenL3: {
      url: horizenRpc,
      accounts: deployerKey ? [deployerKey] : [],
    },
  },
}

module.exports = config
