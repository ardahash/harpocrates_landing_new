import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"

export default function FAQPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Frequently Asked Questions</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Common questions about Harpocrates and confidential AI inference.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">How is Harpocrates different from traditional AI APIs?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Traditional AI APIs like OpenAI or Anthropic can see your plaintext prompts and responses. Harpocrates
              uses Trusted Execution Environments (TEEs) to process your data in hardware-enforced secure enclaves,
              ensuring that even Harpocrates operators cannot access your sensitive information.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What is a Trusted Execution Environment (TEE)?</h3>
            <p className="text-muted-foreground leading-relaxed">
              A TEE is a secure area within a processor that provides hardware-level isolation for code and data. It
              ensures that sensitive computations are protected from the host operating system, other applications, and
              even physical access to the machine. Examples include Intel SGX and AMD SEV-SNP.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Can I use my own models with Harpocrates?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Currently, Harpocrates offers a curated set of models optimized for confidential inference. Enterprise
              customers can work with us to deploy custom models in secure enclaves. Contact sales for more information.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How much does Harpocrates cost compared to OpenAI?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pricing is competitive with major AI providers. The privacy guarantees and on-chain transparency justify
              the premium. Current rates start at 0.0001 ZEN per token (~$0.007 per 1K tokens), with volume discounts
              available.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What happens if a TEE vulnerability is discovered?</h3>
            <p className="text-muted-foreground leading-relaxed">
              We monitor security advisories from Intel and AMD closely. In the event of a critical vulnerability, we
              would immediately migrate to patched hardware or alternative TEE technologies. All attestations are
              versioned so you can verify which enclave version processed your data.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Can Harpocrates see my API keys or passwords in prompts?</h3>
            <p className="text-muted-foreground leading-relaxed">
              No. Your prompts are encrypted client-side before transmission. Only the TEE enclave can decrypt them, and
              the enclave is designed not to log or export any plaintext data.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How do I verify that my data was processed securely?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every inference returns a zero-knowledge attestation that you can verify using the SDK's{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">verifyAttestation()</code> method. This
              cryptographically proves your data was processed in a genuine TEE without tampering.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What is ZEN and why do I need it?</h3>
            <p className="text-muted-foreground leading-relaxed">
              ZEN is the native token of the Horizen blockchain. Harpocrates uses ZEN for transparent, on-chain billing
              and metering. This eliminates vendor lock-in and provides verifiable receipts for all inference requests.
              You can acquire ZEN from major crypto exchanges.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Is there a free tier or trial?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Yes! New users receive 10 ZEN (~$70) in testnet credits to explore the platform. For production use, we
              offer pay-as-you-go pricing with no minimum commitment.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What's the latency compared to standard AI APIs?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Confidential inference adds ~10-15% latency overhead due to encryption and attestation generation. For
              most applications, this is acceptable given the privacy benefits. Use{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">llm-secure-fast</code> for lower-latency
              workloads.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Can I use Harpocrates for real-time applications?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Yes. The <code className="text-sm bg-muted px-1.5 py-0.5 rounded">llm-secure-fast</code> model is
              optimized for low latency and suitable for chatbots, autocomplete, and other real-time use cases.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Does Harpocrates support streaming responses?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Streaming is currently in beta. Contact support to enable it for your account. Note that streaming
              requires additional attestation complexity.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Can I self-host Harpocrates?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Enterprise customers can deploy Harpocrates in their own infrastructure with dedicated TEE hardware. This
              requires specialized hardware (SGX/SEV-capable servers) and enterprise licensing. Contact sales for
              details.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What programming languages are supported?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Official SDKs are available for JavaScript/TypeScript and Python. Community SDKs exist for Go, Rust, and
              Java. The REST API can be used from any language.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How do I report a security vulnerability?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Email security@harpocrates.ai with details. We offer a responsible disclosure program with rewards for
              valid findings. Please do not disclose vulnerabilities publicly before we've had a chance to address them.
            </p>
          </div>
        </div>
      </DocSection>
    </div>
  )
}
