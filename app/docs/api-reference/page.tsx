import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs/callout"

export default function APIReferencePage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>API Reference</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Complete reference for the Harpocrates API endpoints and SDK methods.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="authentication">
          Authentication
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          All API requests require authentication using your API key in the Authorization header:
        </p>

        <CodeBlock language="bash">{`Authorization: Bearer hpc_your_api_key_here`}</CodeBlock>

        <p className="text-muted-foreground leading-relaxed mt-4">
          API keys follow the format <code className="text-sm bg-muted px-1.5 py-0.5 rounded">hpc_</code>
          followed by 32 alphanumeric characters.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="infer">
          POST /infer
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Perform confidential AI inference on encrypted data.
        </p>

        <h3 className="text-lg font-semibold mb-3 mt-6">Request Body</h3>
        <CodeBlock language="json">
          {`{
  "model": "llm-secure-7b",
  "input": "encrypted_base64_string",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 512,
    "top_p": 0.9
  },
  "return_attestation": true
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Response</h3>
        <CodeBlock language="json">
          {`{
  "id": "inf_1234567890abcdef",
  "object": "inference",
  "created": 1704067200,
  "model": "llm-secure-7b",
  "output": "encrypted_base64_response",
  "attestation": {
    "proof": "zk_proof_data",
    "enclave_id": "sgx_enclave_measurement",
    "timestamp": 1704067200
  },
  "usage": {
    "input_tokens": 42,
    "output_tokens": 128,
    "cost_zen": "0.00025"
  }
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Parameters</h3>
        <div className="space-y-4">
          <div className="border-l-2 border-primary pl-4">
            <code className="text-sm font-semibold">model</code>
            <span className="text-xs text-muted-foreground ml-2">required</span>
            <p className="text-sm text-muted-foreground mt-1">
              The model ID to use for inference. See the Models page for available options.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <code className="text-sm font-semibold">input</code>
            <span className="text-xs text-muted-foreground ml-2">required</span>
            <p className="text-sm text-muted-foreground mt-1">
              Base64-encoded encrypted prompt. Use the SDK's encrypt() method.
            </p>
          </div>

          <div className="border-l-2 border-border pl-4">
            <code className="text-sm font-semibold">parameters</code>
            <span className="text-xs text-muted-foreground ml-2">optional</span>
            <p className="text-sm text-muted-foreground mt-1">
              Model-specific generation parameters like temperature and max_tokens.
            </p>
          </div>

          <div className="border-l-2 border-border pl-4">
            <code className="text-sm font-semibold">return_attestation</code>
            <span className="text-xs text-muted-foreground ml-2">optional</span>
            <p className="text-sm text-muted-foreground mt-1">
              Whether to include ZK attestation in the response. Defaults to true.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="embedding">
          POST /embedding
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Generate encrypted embeddings for semantic search and retrieval.
        </p>

        <h3 className="text-lg font-semibold mb-3 mt-6">Request Body</h3>
        <CodeBlock language="json">
          {`{
  "model": "embed-secure-base",
  "input": "encrypted_base64_string",
  "dimensions": 768
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Response</h3>
        <CodeBlock language="json">
          {`{
  "id": "emb_abcdef1234567890",
  "object": "embedding",
  "created": 1704067200,
  "model": "embed-secure-base",
  "embedding": [0.023, -0.045, 0.891, ...],
  "usage": {
    "input_tokens": 15,
    "cost_zen": "0.00005"
  }
}`}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="verify-attestation">
          POST /verifyAttestation
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Verify a zero-knowledge attestation from a previous inference request.
        </p>

        <h3 className="text-lg font-semibold mb-3 mt-6">Request Body</h3>
        <CodeBlock language="json">
          {`{
  "attestation": {
    "proof": "zk_proof_data",
    "enclave_id": "sgx_enclave_measurement",
    "timestamp": 1704067200
  },
  "inference_id": "inf_1234567890abcdef"
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Response</h3>
        <CodeBlock language="json">
          {`{
  "valid": true,
  "verified_at": 1704067300,
  "enclave_verified": true,
  "proof_verified": true,
  "on_chain_receipt": "0x1234...abcd"
}`}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="error-handling">
          Error Handling
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The API uses standard HTTP status codes and returns structured error objects:
        </p>

        <CodeBlock language="json">
          {`{
  "error": {
    "type": "invalid_request_error",
    "code": "invalid_model",
    "message": "The model 'invalid-model' does not exist",
    "param": "model"
  }
}`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mb-3 mt-6">Common Error Codes</h3>
        <div className="space-y-3">
          <div className="flex gap-4">
            <code className="text-sm bg-muted px-2 py-1 rounded">400</code>
            <span className="text-sm text-muted-foreground">Bad Request - Invalid parameters</span>
          </div>
          <div className="flex gap-4">
            <code className="text-sm bg-muted px-2 py-1 rounded">401</code>
            <span className="text-sm text-muted-foreground">Unauthorized - Invalid API key</span>
          </div>
          <div className="flex gap-4">
            <code className="text-sm bg-muted px-2 py-1 rounded">429</code>
            <span className="text-sm text-muted-foreground">Too Many Requests - Rate limit exceeded</span>
          </div>
          <div className="flex gap-4">
            <code className="text-sm bg-muted px-2 py-1 rounded">500</code>
            <span className="text-sm text-muted-foreground">Internal Server Error - Something went wrong</span>
          </div>
          <div className="flex gap-4">
            <code className="text-sm bg-muted px-2 py-1 rounded">503</code>
            <span className="text-sm text-muted-foreground">Service Unavailable - Enclave temporarily unavailable</span>
          </div>
        </div>

        <Callout type="warning">Always implement retry logic with exponential backoff for 500 and 503 errors.</Callout>
      </DocSection>
    </div>
  )
}
