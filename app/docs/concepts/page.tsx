import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { Callout } from "@/components/docs/callout"

export default function ConceptsPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Concepts</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Understand the core concepts that power Harpocrates' confidential AI infrastructure.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="encrypted-prompts">
          Encrypted Prompts
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Your data is encrypted on your device before it leaves your infrastructure. Harpocrates uses a hybrid
          encryption scheme:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Asymmetric encryption for key exchange with the TEE enclave</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Symmetric encryption (AES-256-GCM) for payload encryption</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Perfect forward secrecy for each inference session</span>
          </li>
        </ul>

        <Callout type="info">
          Only the TEE enclave can decrypt your data. Network operators, cloud providers, and even Harpocrates
          maintainers cannot access your plaintext prompts.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="enclave-execution">
          Enclave Execution
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Trusted Execution Environments (TEEs) provide hardware-enforced isolation for sensitive computations. When
          your encrypted data arrives:
        </p>

        <ol className="space-y-3 text-muted-foreground mb-4 list-decimal list-inside">
          <li>The enclave decrypts your data inside the secure boundary</li>
          <li>The AI model processes your data entirely within the TEE</li>
          <li>The result is encrypted before leaving the enclave</li>
          <li>An attestation is generated proving correct execution</li>
        </ol>

        <p className="text-muted-foreground leading-relaxed">
          The enclave's memory is encrypted and inaccessible to the host OS, other processes, or physical attacks. Even
          cloud administrators with root access cannot inspect the computation.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="zk-attestations">
          Zero-Knowledge Attestations
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          After inference completes, Harpocrates generates a zero-knowledge proof that cryptographically verifies:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>The computation ran inside a genuine TEE enclave</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>The correct model was used for inference</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>No tampering occurred during execution</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>The output matches the encrypted input</span>
          </li>
        </ul>

        <p className="text-muted-foreground leading-relaxed">
          These attestations are posted on-chain and can be independently verified by anyone, providing auditability
          without compromising privacy.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="zen-billing">
          ZEN-Based Billing
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          All inference requests are metered and settled on the Horizen blockchain using ZEN tokens. This provides:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Transparent pricing with on-chain receipts</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>No vendor lock-in or opaque billing practices</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Automatic settlement without monthly invoices</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Micropayments for individual inference requests</span>
          </li>
        </ul>

        <Callout type="info">
          Pricing is based on model size, input tokens, and output tokens. Check the current rates in your dashboard or
          query the pricing API.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="privacy-guarantees">
          Privacy Guarantees
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates provides strong privacy guarantees through its layered architecture:
        </p>

        <div className="border border-border rounded-lg p-6 bg-muted/20 mb-4">
          <h3 className="font-semibold mb-2">Data Confidentiality</h3>
          <p className="text-sm text-muted-foreground">
            Your prompts and responses are encrypted end-to-end. Neither the network operators nor the inference
            providers can access your plaintext data.
          </p>
        </div>

        <div className="border border-border rounded-lg p-6 bg-muted/20 mb-4">
          <h3 className="font-semibold mb-2">Computational Integrity</h3>
          <p className="text-sm text-muted-foreground">
            ZK attestations prove that your inference was computed correctly without revealing your input or
            intermediate states.
          </p>
        </div>

        <div className="border border-border rounded-lg p-6 bg-muted/20 mb-4">
          <h3 className="font-semibold mb-2">Verifiable Privacy</h3>
          <p className="text-sm text-muted-foreground">
            TEE remote attestation allows you to cryptographically verify that your data is processed in a genuine
            secure enclave.
          </p>
        </div>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="limitations">
          Limitations and Assumptions
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          While Harpocrates provides strong privacy guarantees, it's important to understand the security model:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>TEE security depends on hardware manufacturers (Intel, AMD)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Side-channel attacks may leak limited information about computation patterns</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Model weights are visible to enclave operators (but not user data)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Output length and timing information may be observable</span>
          </li>
        </ul>

        <Callout type="warning">
          Harpocrates is designed for confidential computing, not anonymous computing. Metadata like request counts and
          timing are recorded for billing purposes.
        </Callout>
      </DocSection>
    </div>
  )
}
