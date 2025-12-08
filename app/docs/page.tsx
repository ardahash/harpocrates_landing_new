import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { Callout } from "@/components/docs/callout"

export default function IntroductionPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Introduction</DocHeading>

      <DocSection>
        <DocHeading level={2} id="what-is-harpocrates">
          What is Harpocrates?
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates is a privacy-preserving AI inference engine built on Horizen Base L3. Named after the god of
          silence and secrets, Harpocrates enables you to run AI models on encrypted data without exposing your
          sensitive information.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Unlike traditional AI APIs where your prompts are visible to the service provider, Harpocrates processes your
          data inside a Trusted Execution Environment (TEE), ensuring complete confidentiality throughout the inference
          process.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="how-it-works">
          How Confidential AI Inference Works
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Harpocrates follows a three-step process to ensure privacy and correctness:
        </p>

        <div className="space-y-4 mb-6">
          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">1. Encrypt</h3>
            <p className="text-sm text-muted-foreground">
              Your sensitive prompts are encrypted client-side using industry-standard encryption before being sent to
              the Harpocrates network.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">2. Compute in TEE</h3>
            <p className="text-sm text-muted-foreground">
              The encrypted data is processed inside a secure enclave (TEE) where the AI model performs inference. The
              enclave ensures that neither the operators nor any external party can access your data.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">3. Verify + Settle in ZEN</h3>
            <p className="text-sm text-muted-foreground">
              Zero-knowledge attestations prove that the computation was performed correctly inside the TEE. All
              inference requests are metered and settled on-chain using ZEN tokens on the Horizen network.
            </p>
          </div>
        </div>

        <Callout type="info">
          This architecture ensures that your data remains encrypted at rest, in transit, and during
          computation—achieving end-to-end confidentiality.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="why-harpocrates">
          Project Motivations
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Traditional AI inference services require you to trust the provider with your data. This creates several
          challenges:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Compliance requirements prevent using cloud AI for sensitive data</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Business secrets and PII are exposed to third-party providers</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>No cryptographic proof that computations were performed correctly</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Centralized control over AI infrastructure</span>
          </li>
        </ul>

        <p className="text-muted-foreground leading-relaxed">
          Harpocrates solves these problems by combining TEEs for confidential computation, zero-knowledge proofs for
          verifiable correctness, and blockchain settlement for transparent metering—all while maintaining the developer
          experience of traditional AI APIs.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="glossary">
          Glossary
        </DocHeading>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">TEE (Trusted Execution Environment)</h3>
            <p className="text-sm text-muted-foreground">
              A secure area of a processor that guarantees code and data are protected with respect to confidentiality
              and integrity. Examples include Intel SGX and AMD SEV.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Enclave</h3>
            <p className="text-sm text-muted-foreground">
              An isolated execution environment created within a TEE where sensitive computations are performed without
              exposing data to the host system.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Zero-Knowledge (ZK) Attestation</h3>
            <p className="text-sm text-muted-foreground">
              A cryptographic proof that verifies a computation was performed correctly inside a TEE without revealing
              the input data or intermediate states.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Encrypted Prompts</h3>
            <p className="text-sm text-muted-foreground">
              User inputs that are encrypted client-side before being sent to the inference engine, ensuring the service
              provider cannot read the original data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Inference</h3>
            <p className="text-sm text-muted-foreground">
              The process of using a trained AI model to make predictions or generate outputs based on new input data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">ZEN</h3>
            <p className="text-sm text-muted-foreground">
              The native token of the Horizen network used to meter and settle AI inference requests on Harpocrates.
            </p>
          </div>
        </div>
      </DocSection>
    </div>
  )
}
