import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs/callout"

export default function QuickstartPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Quickstart</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Get started with Harpocrates in minutes. This guide will walk you through making your first confidential AI
          inference request.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="installation">
          Installation (NOT LIVE YET, PLEASE DO NOT TRY)
        </DocHeading>

        <h3 className="text-lg font-semibold mb-3 mt-6">JavaScript / TypeScript</h3>
        <CodeBlock language="bash">
          {`npm install harpocrates
# or
pnpm add harpocrates
# or
yarn add harpocrates`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Python</h3>
        <CodeBlock language="bash">{`pip install harpocrates`}</CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="api-key">
          Get Your API Key
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Sign up at the Harpocrates dashboard to receive your API key. Store it securely as an environment variable:
        </p>

        <CodeBlock language="bash">{`export HARPOCRATES_API_KEY="hpc_your_api_key_here"`}</CodeBlock>

        <Callout type="warning">
          Never commit your API key to version control. Use environment variables or a secure secrets management system.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="first-request">
          Your First Inference Request
        </DocHeading>

        <h3 className="text-lg font-semibold mb-3 mt-6">JavaScript</h3>
        <CodeBlock language="javascript">
          {`import { Harpocrates } from "harpocrates";

const client = new Harpocrates({ 
  apiKey: process.env.HARPOCRATES_API_KEY 
});

async function main() {
  // Encrypt your sensitive prompt
  const encrypted = await client.encrypt(
    "Classify this confidential document as legal, financial, or medical."
  );

  // Perform confidential inference
  const result = await client.infer({
    model: "llm-secure-7b",
    input: encrypted
  });

  // Decrypt the response
  const output = await client.decrypt(result.output);
  console.log(output);
  
  // Verify the attestation (optional but recommended)
  const valid = await client.verifyAttestation(result.attestation);
  console.log("Attestation valid:", valid);
}

main();`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Python</h3>
        <CodeBlock language="python">
          {`from harpocrates import Harpocrates
import os

client = Harpocrates(api_key=os.getenv("HARPOCRATES_API_KEY"))

# Encrypt your sensitive prompt
encrypted = client.encrypt(
    "Classify this confidential document as legal, financial, or medical."
)

# Perform confidential inference
result = client.infer(
    model="llm-secure-7b",
    input=encrypted
)

# Decrypt the response
output = client.decrypt(result.output)
print(output)

# Verify the attestation
valid = client.verify_attestation(result.attestation)
print(f"Attestation valid: {valid}")`}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="encryption-helpers">
          Understanding Encryption Helpers
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The SDK provides built-in encryption helpers that handle the cryptographic operations for you:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">encrypt()</code> - Encrypts your data before
              sending
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">decrypt()</code> - Decrypts the response from the
              enclave
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">verifyAttestation()</code> - Verifies the ZK
              proof of correct computation
            </span>
          </li>
        </ul>

        <Callout type="info">
          Encryption keys are managed automatically by the SDK using secure key exchange protocols with the TEE enclave.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="testnet">
          Testing on Horizen Testnet
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          During development, you can test against the Horizen testnet without spending real ETH:
        </p>

        <CodeBlock language="javascript">
          {`const client = new Harpocrates({
  apiKey: process.env.HARPOCRATES_API_KEY,
  network: "testnet" // Use testnet for development
});`}
        </CodeBlock>

        <p className="text-muted-foreground leading-relaxed mt-4">
          Get testnet ETH from the Horizen faucet to test billing and metering features.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="next-steps">
          Next Steps
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Now that you've made your first request, explore these topics:
        </p>

        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <a href="/docs/concepts" className="text-primary hover:underline">
                Learn about core concepts
              </a>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <a href="/docs/api-reference" className="text-primary hover:underline">
                Explore the full API reference
              </a>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <a href="/docs/models" className="text-primary hover:underline">
                Browse available models
              </a>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <a href="/docs/sdk-guides" className="text-primary hover:underline">
                Deep dive into SDK guides
              </a>
            </span>
          </li>
        </ul>
      </DocSection>
    </div>
  )
}
