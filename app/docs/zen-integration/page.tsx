import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs/callout"

export default function ZENIntegrationPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>ZEN Integration</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Understand how Harpocrates uses ZEN tokens for transparent, on-chain billing and metering of AI inference
          requests.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="how-billing-works">
          How Inference Billing Works
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Every inference request on Harpocrates is metered and settled using ZEN tokens on the Horizen blockchain.
          Here's the flow:
        </p>

        <ol className="space-y-3 text-muted-foreground mb-4 list-decimal list-inside">
          <li>You make an inference request with encrypted data</li>
          <li>The TEE enclave processes your request and generates a ZK attestation</li>
          <li>Usage metrics (input/output tokens) are recorded on-chain</li>
          <li>ZEN tokens are automatically deducted from your account balance</li>
          <li>You receive an on-chain receipt for the transaction</li>
        </ol>

        <Callout type="info">
          All billing is transparent and auditable. You can verify every charge on the Horizen blockchain using the
          transaction hash.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="on-chain-receipts">
          Reading On-Chain Receipts
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Every inference response includes an on-chain receipt in the usage object:
        </p>

        <CodeBlock language="json">
          {`{
  "id": "inf_1234567890abcdef",
  "usage": {
    "input_tokens": 42,
    "output_tokens": 128,
    "cost_zen": "0.00025",
    "transaction_hash": "0xabcd1234...5678efgh",
    "block_number": 1234567,
    "timestamp": 1704067200
  }
}`}
        </CodeBlock>

        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          You can verify this transaction on a Horizen block explorer using the transaction hash.
        </p>

        <CodeBlock language="javascript">
          {`// Verify a transaction on-chain
const receipt = await client.getTransactionReceipt(
  result.usage.transaction_hash
);

console.log("Verified on-chain:", receipt.confirmed);
console.log("Block:", receipt.block_number);
console.log("Cost:", receipt.cost_zen, "ZEN");`}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="spending-limits">
          Setting Spending Limits
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Protect your account from unexpected costs by setting spending limits:
        </p>

        <CodeBlock language="javascript">
          {`// Set a daily spending limit
await client.setSpendingLimit({
  period: "daily",
  limit_zen: "10.0" // 10 ZEN per day
});

// Set a per-request limit
await client.setSpendingLimit({
  period: "per_request",
  limit_zen: "0.1" // Max 0.1 ZEN per inference
});`}
        </CodeBlock>

        <p className="text-muted-foreground leading-relaxed mt-4">
          When a limit is reached, new requests will be rejected with a 429 status code until the period resets or you
          increase the limit.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="billing-response">
          Example Billing Response
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Complete billing information is included in every response:
        </p>

        <CodeBlock language="json">
          {`{
  "id": "inf_9876543210fedcba",
  "object": "inference",
  "created": 1704067200,
  "model": "llm-secure-7b",
  "output": "encrypted_response_data",
  "usage": {
    "input_tokens": 156,
    "output_tokens": 412,
    "total_tokens": 568,
    "cost_zen": "0.000568",
    "cost_usd": "0.042",
    "transaction_hash": "0x1234abcd...efgh5678",
    "block_number": 1234567,
    "gas_used": "21000",
    "timestamp": 1704067200
  },
  "attestation": {
    "proof": "zk_proof_data",
    "enclave_id": "sgx_measurement_xyz",
    "on_chain_verification": "0xverify...hash"
  }
}`}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="pay-as-you-go">
          Pay-As-You-Go Design
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates uses a pure pay-as-you-go model with no monthly fees or commitments:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Only pay for actual inference tokens used</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>No minimum spending requirements</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Automatic settlement with ZEN tokens</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Transparent, verifiable pricing on-chain</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Volume discounts available (contact sales)</span>
          </li>
        </ul>

        <Callout type="info">
          Current pricing: 0.0001 ZEN per token for standard models. Prices are subject to change based on network
          demand and are always posted on-chain.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="funding-account">
          Funding Your Account
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">Add ZEN to your Harpocrates account balance:</p>

        <CodeBlock language="bash">
          {`# Get your account address
harpocrates account address

# Send ZEN to your account address from any wallet
# Minimum deposit: 1 ZEN`}
        </CodeBlock>

        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          Your balance is updated automatically after 12 block confirmations (~2 minutes).
        </p>

        <CodeBlock language="javascript">
          {`// Check your current balance
const balance = await client.getBalance();
console.log("Available ZEN:", balance.available);
console.log("Reserved ZEN:", balance.reserved);
console.log("Total:", balance.total);`}
        </CodeBlock>
      </DocSection>
    </div>
  )
}
