import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs/callout"

export default function ProductionPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Deploying to Production</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Best practices for running Harpocrates in production environments with security, reliability, and performance
          in mind.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="api-keys">
          Managing API Keys Securely
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">Protect your API keys from unauthorized access:</p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Store keys in environment variables, never in code</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Rotate keys regularly (every 90 days recommended)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Use separate keys for development, staging, and production</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Audit key usage through your dashboard</span>
          </li>
        </ul>

        <Callout type="warning">
          If a key is compromised, immediately revoke it from your dashboard and generate a new one. All requests with
          the old key will be rejected instantly.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="rate-limits">
          Rate Limits
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates enforces rate limits to ensure fair usage and system stability:
        </p>

        <div className="border border-border rounded-lg p-6 bg-muted/20 mb-4">
          <h3 className="font-semibold mb-3">Standard Tier</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>60 requests per minute</li>
            <li>100,000 tokens per minute</li>
            <li>500,000 requests per day</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-6 bg-muted/20 mb-4">
          <h3 className="font-semibold mb-3">Enterprise Tier</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Custom rate limits</li>
            <li>Dedicated enclave capacity</li>
            <li>Priority support</li>
          </ul>
        </div>

        <CodeBlock language="javascript">
          {`// Implement exponential backoff for rate limits
async function inferWithRetry(input, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.infer({ model: "llm-secure-7b", input });
    } catch (error) {
      if (error instanceof RateLimitError && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}`}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="monitoring">
          Monitoring Usage
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">Track your API usage in real-time:</p>

        <CodeBlock language="javascript">
          {`// Get usage statistics
const stats = await client.getUsageStats({
  start_date: "2024-01-01",
  end_date: "2024-01-31",
  granularity: "day"
});

console.log("Total requests:", stats.total_requests);
console.log("Total tokens:", stats.total_tokens);
console.log("Total cost:", stats.total_cost_eth, "ETH");
console.log("Average latency:", stats.avg_latency_ms, "ms");

// Set up alerts
await client.createAlert({
  type: "spending_threshold",
  threshold_eth: "1.0",
  notification_email: "ops@example.com"
});`}
        </CodeBlock>

        <p className="text-muted-foreground leading-relaxed mt-4">
          View detailed analytics and usage graphs in your dashboard.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="replay-protection">
          Replay Protection / Nonce Handling
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates prevents replay attacks by automatically including nonces in encrypted requests:
        </p>

        <CodeBlock language="javascript">
          {`// Nonces are handled automatically by the SDK
const encrypted = await client.encrypt("sensitive data");
// The encrypted payload includes a timestamp and random nonce

// When you make a request, it can only be used once
const result = await client.infer({
  model: "llm-secure-7b",
  input: encrypted
});

// Attempting to replay the same encrypted input will fail
try {
  await client.infer({
    model: "llm-secure-7b",
    input: encrypted // Same encrypted payload
  });
} catch (error) {
  console.error("Replay detected:", error.message);
}`}
        </CodeBlock>

        <Callout type="info">
          Each encrypted payload is valid for 5 minutes and can only be used once. This prevents replay attacks while
          allowing reasonable clock skew.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="verification">
          Ensuring Cryptographic Verification
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Always verify attestations in production to ensure your data was processed correctly inside a TEE:
        </p>

        <CodeBlock language="javascript">
          {`async function secureInference(input) {
  const encrypted = await client.encrypt(input);
  
  const result = await client.infer({
    model: "llm-secure-7b",
    input: encrypted,
    return_attestation: true
  });
  
  // CRITICAL: Verify the attestation
  const verification = await client.verifyAttestation(result.attestation);
  
  if (!verification.valid) {
    throw new Error("Attestation verification failed! Computation may be compromised.");
  }
  
  if (!verification.enclave_verified) {
    throw new Error("Enclave verification failed! Not a genuine TEE.");
  }
  
  // Only proceed if verification passed
  const output = await client.decrypt(result.output);
  return output;
}`}
        </CodeBlock>

        <Callout type="warning">
          Never skip attestation verification in production. It's your guarantee that the computation happened inside a
          secure enclave.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="checklist">
          Production Readiness Checklist
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Before going live, ensure you've completed these steps:
        </p>

        <div className="space-y-2">
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">
              API keys stored in environment variables or secrets manager
            </span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Separate keys for dev/staging/production</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Rate limit handling with exponential backoff</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Attestation verification enabled for all requests</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Monitoring and alerting configured</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Spending limits set appropriately</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Error handling for all API calls</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Logging configured (without logging sensitive data)</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Load tested with expected traffic patterns</span>
          </div>
          <div className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm text-muted-foreground">Incident response plan documented</span>
          </div>
        </div>
      </DocSection>
    </div>
  )
}
