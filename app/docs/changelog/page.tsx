import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Changelog</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Track updates, new features, and improvements to the Harpocrates platform.
        </p>

        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">v0.3.0</h2>
              <span className="text-sm text-muted-foreground">March 15, 2024</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Latest</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">New Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    ƒ?› Added <code className="text-xs bg-muted px-1 rounded">llm-secure-fast</code> model for low-latency
                    inference
                  </li>
                  <li>ƒ?› Streaming responses now in beta (contact support to enable)</li>
                  <li>ƒ?› Python SDK now supports async/await patterns</li>
                  <li>ƒ?› Added spending limit controls via API and dashboard</li>
                  <li>
                    ƒ?› New embedding model: <code className="text-xs bg-muted px-1 rounded">embed-secure-large</code>{" "}
                    (1536d)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-blue-400 mb-2">Improvements</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>ƒ?› Reduced attestation verification time by 40%</li>
                  <li>ƒ?› Improved error messages with more actionable details</li>
                  <li>ƒ?› Enhanced dashboard with real-time usage graphs</li>
                  <li>ƒ?› SDK now automatically retries failed requests with exponential backoff</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">Bug Fixes</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>ƒ?› Fixed race condition in key exchange protocol</li>
                  <li>ƒ?› Resolved memory leak in long-running inference sessions</li>
                  <li>ƒ?› Corrected ETH pricing calculation for very small requests</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">v0.2.0</h2>
              <span className="text-sm text-muted-foreground">February 1, 2024</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">New Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>ƒ?› Launch of JavaScript/TypeScript SDK</li>
                  <li>
                    ƒ?› Added <code className="text-xs bg-muted px-1 rounded">llm-secure-13b</code> model for complex
                    reasoning tasks
                  </li>
                  <li>ƒ?› On-chain attestation verification now available</li>
                  <li>ƒ?› Added usage analytics and monitoring dashboard</li>
                  <li>ƒ?› Support for custom temperature and max_tokens parameters</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-blue-400 mb-2">Improvements</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>ƒ?› Reduced inference latency by 25% through enclave optimizations</li>
                  <li>ƒ?› Improved documentation with more code examples</li>
                  <li>ƒ?› Enhanced API error responses with detailed error codes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">Bug Fixes</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>ƒ?› Fixed issue with large input contexts (&gt;4K tokens)</li>
                  <li>ƒ?› Resolved attestation timestamp validation edge case</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">v0.1.0</h2>
              <span className="text-sm text-muted-foreground">January 10, 2024</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">Initial Release</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>ƒ?› Public beta launch of Harpocrates platform</li>
                  <li>ƒ?› Python SDK with encryption and attestation support</li>
                  <li>
                    ƒ?› Base language model: <code className="text-xs bg-muted px-1 rounded">llm-secure-7b</code>
                  </li>
                  <li>
                    ƒ?› Embedding model: <code className="text-xs bg-muted px-1 rounded">embed-secure-base</code>
                  </li>
                  <li>ƒ?› Intel SGX and AMD SEV-SNP enclave support</li>
                  <li>ƒ?› ETH settlement integration on Horizen L3 for on-chain billing</li>
                  <li>ƒ?› REST API for inference and verification</li>
                  <li>ƒ?› Testnet environment for development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection>
        <div className="mt-12 border border-border rounded-lg p-6 bg-muted/20">
          <h3 className="font-semibold mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our changelog to receive notifications about new features, improvements, and important security
            updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 text-sm border border-border rounded bg-background"
            />
            <button className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded hover:opacity-90">
              Subscribe
            </button>
          </div>
        </div>
      </DocSection>
    </div>
  )
}
