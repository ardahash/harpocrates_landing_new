import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"
import { Callout } from "@/components/docs/callout"

export default function SecurityPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Security & Privacy</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          A comprehensive overview of Harpocrates' security architecture and the privacy guarantees provided by our
          confidential computing infrastructure.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="privacy-overview">
          Overview of Privacy Guarantees
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates is designed from the ground up to ensure that your sensitive data remains confidential at every
          stage:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Client-side encryption:</strong> Data encrypted before leaving your infrastructure
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Encrypted in transit:</strong> TLS 1.3 for all network communications
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Encrypted at rest:</strong> No plaintext data stored on disk
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Encrypted in use:</strong> TEE enclaves protect data during computation
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Verifiable privacy:</strong> ZK proofs demonstrate correct execution without revealing data
            </span>
          </li>
        </ul>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="data-lifecycle">
          Data Lifecycle
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Understanding how your data flows through the Harpocrates system:
        </p>

        <div className="space-y-4">
          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">1. Encryption (Client-Side)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Your sensitive prompt is encrypted on your device using AES-256-GCM before it leaves your infrastructure.
            </p>
            <p className="text-xs text-muted-foreground">
              Threat Protection: Man-in-the-middle attacks, network sniffing, cloud provider access
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">2. Transmission (TLS 1.3)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Encrypted data is transmitted over TLS to the Harpocrates network. The payload remains encrypted
              end-to-end.
            </p>
            <p className="text-xs text-muted-foreground">
              Threat Protection: Network interception, ISP surveillance, DNS tampering
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">3. Inference (TEE Enclave)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Data is decrypted and processed entirely within a hardware-enforced TEE. The host system, OS, and
              operators cannot access the plaintext.
            </p>
            <p className="text-xs text-muted-foreground">
              Threat Protection: Host compromise, privileged user access, physical attacks
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">4. Response (Re-encryption)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The model output is encrypted inside the enclave before leaving the secure boundary. It's returned to you
              in encrypted form.
            </p>
            <p className="text-xs text-muted-foreground">Threat Protection: Same as transmission phase</p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="font-semibold text-lg mb-2">5. Decryption (Client-Side)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              You decrypt the response on your device. Only you can read the plaintext output.
            </p>
            <p className="text-xs text-muted-foreground">Threat Protection: Complete control over decrypted data</p>
          </div>
        </div>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="tee-details">
          Trusted Execution Environments (TEEs)
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          TEEs provide hardware-level isolation for sensitive computations. Harpocrates uses Intel SGX and AMD SEV-SNP
          enclaves:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Memory encryption at the CPU level</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Isolated execution environment separate from the host OS</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Remote attestation to verify genuine hardware</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Sealed storage for persistent encrypted data</span>
          </li>
        </ul>

        <Callout type="info">
          TEE attestations are cryptographically signed by the CPU manufacturer (Intel/AMD), providing verifiable proof
          that code is running in a genuine secure enclave.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="attestation-pipeline">
          Attestation Verification Pipeline
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Every inference generates a multi-layered attestation that you can verify:
        </p>

        <ol className="space-y-3 text-muted-foreground mb-4 list-decimal list-inside">
          <li>
            <strong>Hardware Attestation:</strong> CPU manufacturer signs enclave measurement
          </li>
          <li>
            <strong>Software Attestation:</strong> Hash of the exact inference code running in the enclave
          </li>
          <li>
            <strong>Data Binding:</strong> Cryptographic commitment to your input hash
          </li>
          <li>
            <strong>ZK Proof:</strong> Zero-knowledge proof of correct computation
          </li>
          <li>
            <strong>On-Chain Commitment:</strong> Attestation posted to Horizen blockchain
          </li>
        </ol>

        <p className="text-muted-foreground leading-relaxed">
          This layered approach ensures that even if one layer is compromised, the other layers maintain security
          guarantees.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="what-harpocrates-does-not-see">
          What Harpocrates Does NOT See
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          It's important to understand what data remains completely hidden from Harpocrates operators:
        </p>

        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Your plaintext prompts and responses</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Intermediate model activations and hidden states</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Encryption keys (managed entirely client-side)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Embedding vectors (if generated from encrypted inputs)</span>
          </li>
        </ul>

        <p className="text-muted-foreground leading-relaxed mb-4 font-semibold">
          What Harpocrates CAN observe (for operational purposes):
        </p>

        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>Request metadata (timestamps, API key, model used)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>Token counts (for billing)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>Response size and latency</span>
          </li>
          <li className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>Error types (but not error content)</span>
          </li>
        </ul>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="best-practices">
          Best Practices for Sensitive Workloads
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Maximize privacy and security when working with highly sensitive data:
        </p>

        <div className="space-y-3">
          <div className="border-l-2 border-primary pl-4">
            <h4 className="font-semibold mb-1">Always verify attestations</h4>
            <p className="text-sm text-muted-foreground">
              Enable attestation verification for every request in production. Don't skip this step even if it adds
              latency.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <h4 className="font-semibold mb-1">Rotate encryption keys regularly</h4>
            <p className="text-sm text-muted-foreground">
              Use ephemeral encryption keys when possible. The SDK handles this automatically, but you can also
              implement custom key rotation.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <h4 className="font-semibold mb-1">Minimize metadata leakage</h4>
            <p className="text-sm text-muted-foreground">
              Consider padding inputs to fixed sizes and batching requests to reduce timing and size information
              leakage.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <h4 className="font-semibold mb-1">Use separate API keys per application</h4>
            <p className="text-sm text-muted-foreground">
              Don't reuse the same API key across different services. This limits the blast radius if one key is
              compromised.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <h4 className="font-semibold mb-1">Implement client-side rate limiting</h4>
            <p className="text-sm text-muted-foreground">
              Prevent accidental data exfiltration by limiting how much data any single component can send to
              Harpocrates.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="threat-model">
          Threat Model
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">Harpocrates is designed to protect against:</p>

        <div className="grid gap-4 mb-4">
          <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Protected Against:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Malicious cloud providers</li>
              <li>• Compromised host systems</li>
              <li>• Network interception (MITM)</li>
              <li>• Database breaches</li>
              <li>• Insider threats at Harpocrates</li>
              <li>• Physical server access</li>
              <li>• Cold boot attacks</li>
            </ul>
          </div>

          <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">Limited Protection:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Side-channel attacks (timing, power analysis)</li>
              <li>• Spectre/Meltdown-class CPU vulnerabilities</li>
              <li>• Metadata analysis (request patterns, timing)</li>
            </ul>
          </div>

          <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-400 mb-2">NOT Protected Against:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Client-side compromise (malware on your device)</li>
              <li>• Compromised encryption keys</li>
              <li>• Hardware backdoors in CPU manufacturer</li>
              <li>• Quantum computing attacks (future threat)</li>
            </ul>
          </div>
        </div>

        <Callout type="warning">
          No system is perfectly secure. Harpocrates provides strong privacy guarantees based on current cryptographic
          and hardware security standards. Stay informed about security advisories and update your SDK regularly.
        </Callout>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="compliance">
          Compliance and Certifications
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Harpocrates is designed to help you meet regulatory requirements for sensitive data processing:
        </p>

        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>GDPR:</strong> End-to-end encryption ensures data processors cannot access personal data
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>HIPAA:</strong> TEE isolation suitable for protected health information (PHI)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>PCI DSS:</strong> Strong encryption for payment card data
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>SOC 2 Type II:</strong> In progress (expected Q2 2025)
            </span>
          </li>
        </ul>

        <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
          Note: While Harpocrates provides technical safeguards, compliance is a shared responsibility. Consult your
          legal team for specific requirements.
        </p>
      </DocSection>
    </div>
  )
}
