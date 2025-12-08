import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs/callout"

export default function SDKGuidesPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>SDK Guides</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          In-depth guides for using the Harpocrates SDKs in JavaScript and Python.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="javascript-sdk">
          JavaScript SDK
        </DocHeading>

        <h3 className="text-lg font-semibold mb-3 mt-6">Installation</h3>
        <CodeBlock language="bash">{`npm install harpocrates`}</CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Initializing the Client</h3>
        <CodeBlock language="javascript">
          {`import { Harpocrates } from "harpocrates";

const client = new Harpocrates({
  apiKey: process.env.HARPOCRATES_API_KEY,
  network: "mainnet", // or "testnet"
  timeout: 30000, // Request timeout in ms
});`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Making Inference Requests</h3>
        <CodeBlock language="javascript">
          {`async function classifyDocument(text) {
  try {
    // Encrypt the sensitive input
    const encrypted = await client.encrypt(text);
    
    // Perform inference
    const result = await client.infer({
      model: "llm-secure-7b",
      input: encrypted,
      parameters: {
        temperature: 0.3,
        max_tokens: 100
      }
    });
    
    // Decrypt the response
    const output = await client.decrypt(result.output);
    
    return output;
  } catch (error) {
    console.error("Inference failed:", error);
    throw error;
  }
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Working with Encrypted Input/Output</h3>
        <CodeBlock language="javascript">
          {`// Encrypt data before sending
const encryptedData = await client.encrypt("Sensitive medical records...");

// Send to Harpocrates
const response = await client.infer({
  model: "llm-secure-7b",
  input: encryptedData
});

// Decrypt the result
const plaintext = await client.decrypt(response.output);

// Optional: Verify the computation was done correctly
const isValid = await client.verifyAttestation(response.attestation);
if (!isValid) {
  throw new Error("Attestation verification failed!");
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Handling Attestation Proofs</h3>
        <CodeBlock language="javascript">
          {`const result = await client.infer({
  model: "llm-secure-7b",
  input: encryptedPrompt,
  return_attestation: true
});

// Verify the ZK proof
const verification = await client.verifyAttestation(result.attestation);

console.log("Enclave verified:", verification.enclave_verified);
console.log("Proof verified:", verification.proof_verified);
console.log("On-chain receipt:", verification.on_chain_receipt);`}
        </CodeBlock>

        <Callout type="info">
          The SDK automatically manages encryption keys and handles key exchange with the TEE enclave securely.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="python-sdk">
          Python SDK
        </DocHeading>

        <h3 className="text-lg font-semibold mb-3 mt-6">Installation</h3>
        <CodeBlock language="bash">{`pip install harpocrates`}</CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Initializing the Client</h3>
        <CodeBlock language="python">
          {`from harpocrates import Harpocrates
import os

client = Harpocrates(
    api_key=os.getenv("HARPOCRATES_API_KEY"),
    network="mainnet",  # or "testnet"
    timeout=30  # Request timeout in seconds
)`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Making Inference Requests</h3>
        <CodeBlock language="python">
          {`def classify_document(text: str) -> str:
    try:
        # Encrypt the sensitive input
        encrypted = client.encrypt(text)
        
        # Perform inference
        result = client.infer(
            model="llm-secure-7b",
            input=encrypted,
            parameters={
                "temperature": 0.3,
                "max_tokens": 100
            }
        )
        
        # Decrypt the response
        output = client.decrypt(result.output)
        
        return output
    except Exception as e:
        print(f"Inference failed: {e}")
        raise`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Using Encryption Helpers</h3>
        <CodeBlock language="python">
          {`# Encrypt data before sending
encrypted_data = client.encrypt("Sensitive medical records...")

# Send to Harpocrates
response = client.infer(
    model="llm-secure-7b",
    input=encrypted_data
)

# Decrypt the result
plaintext = client.decrypt(response.output)

# Optional: Verify the computation
is_valid = client.verify_attestation(response.attestation)
if not is_valid:
    raise ValueError("Attestation verification failed!")`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Verifying ZK Proofs</h3>
        <CodeBlock language="python">
          {`result = client.infer(
    model="llm-secure-7b",
    input=encrypted_prompt,
    return_attestation=True
)

# Verify the ZK proof
verification = client.verify_attestation(result.attestation)

print(f"Enclave verified: {verification.enclave_verified}")
print(f"Proof verified: {verification.proof_verified}")
print(f"On-chain receipt: {verification.on_chain_receipt}")`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Async/Await Support</h3>
        <CodeBlock language="python">
          {`import asyncio
from harpocrates import AsyncHarpocrates

async def main():
    client = AsyncHarpocrates(
        api_key=os.getenv("HARPOCRATES_API_KEY")
    )
    
    encrypted = await client.encrypt("Confidential data")
    result = await client.infer(
        model="llm-secure-7b",
        input=encrypted
    )
    output = await client.decrypt(result.output)
    
    return output

asyncio.run(main())`}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="error-handling">
          Error Handling
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Both SDKs provide typed exceptions for different error scenarios:
        </p>

        <h3 className="text-lg font-semibold mb-3 mt-6">JavaScript</h3>
        <CodeBlock language="javascript">
          {`import { 
  HarpocratesError, 
  AuthenticationError, 
  RateLimitError,
  EncryptionError
} from "harpocrates";

try {
  const result = await client.infer({...});
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof RateLimitError) {
    console.error("Rate limit exceeded, retry after:", error.retryAfter);
  } else if (error instanceof EncryptionError) {
    console.error("Encryption failed:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Python</h3>
        <CodeBlock language="python">
          {`from harpocrates import (
    HarpocratesError,
    AuthenticationError,
    RateLimitError,
    EncryptionError
)

try:
    result = client.infer(...)
except AuthenticationError:
    print("Invalid API key")
except RateLimitError as e:
    print(f"Rate limit exceeded, retry after: {e.retry_after}")
except EncryptionError as e:
    print(f"Encryption failed: {e}")
except HarpocratesError as e:
    print(f"Unknown error: {e}")`}
        </CodeBlock>
      </DocSection>
    </div>
  )
}
