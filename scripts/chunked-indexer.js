/**
 * Minimal chunked indexer for HarpocratesBilling events.
 * - Reads progress from a local JSON file to avoid re-scanning.
 * - Queries in block ranges to avoid provider limits.
 * - Stores parsed events to a JSON lines file for simplicity.
 *
 * Env:
 *  - RPC_URL: RPC endpoint for Horizen L3
 *  - BILLING_ADDRESS: deployed HarpocratesBilling contract
 *  - FROM_BLOCK: optional start block
 *  - TO_BLOCK: optional end block (defaults to latest)
 *  - CHUNK_SIZE: optional block range (default 2_000)
 */

const fs = require("fs")
const path = require("path")
const { ethers } = require("ethers")
const abi = [
  "event UserCharged(address indexed user, bytes32 indexed modelId, uint256 inputTokens, uint256 outputTokens, uint256 costWei, bytes32 usageHash)",
  "event UserFunded(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
]

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const contractAddress = process.env.BILLING_ADDRESS
if (!contractAddress) {
  throw new Error("BILLING_ADDRESS missing")
}

const progressFile = path.join(__dirname, ".indexer-progress.json")
const outFile = path.join(__dirname, "billing-events.jsonl")
const chunk = Number(process.env.CHUNK_SIZE || 2000)

function readProgress(defaultFrom) {
  if (!fs.existsSync(progressFile)) return defaultFrom
  const data = JSON.parse(fs.readFileSync(progressFile, "utf8"))
  return data.lastBlock ?? defaultFrom
}

function writeProgress(block) {
  fs.writeFileSync(progressFile, JSON.stringify({ lastBlock: block }, null, 2))
}

async function main() {
  const latest = process.env.TO_BLOCK ? Number(process.env.TO_BLOCK) : await provider.getBlockNumber()
  const fromEnv = process.env.FROM_BLOCK ? Number(process.env.FROM_BLOCK) : 0
  let from = readProgress(fromEnv)

  const contract = new ethers.Contract(contractAddress, abi, provider)

  while (from <= latest) {
    const to = Math.min(from + chunk, latest)
    console.log(`Querying blocks ${from} -> ${to}`)
    const logs = await contract.queryFilter({}, from, to)
    const lines = logs.map((log) => {
      const parsed = contract.interface.parseLog(log)
      return JSON.stringify({
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        event: parsed.name,
        args: parsed.args,
      })
    })
    if (lines.length) {
      fs.appendFileSync(outFile, lines.join("\n") + "\n")
    }
    writeProgress(to + 1)
    from = to + 1
  }

  console.log("Indexing complete up to block", latest)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
