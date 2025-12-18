import { DocHeading } from "@/components/docs/doc-heading"
import { DocSection } from "@/components/docs/doc-section"

export default function ModelsPage() {
  return (
    <div className="max-w-4xl">
      <DocHeading level={1}>Models</DocHeading>

      <DocSection>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Harpocrates offers a range of confidential AI models optimized for secure inference inside TEE enclaves.
        </p>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="language-models">
          Language Models
        </DocHeading>

        <div className="space-y-6">
          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">llm-secure-7b</h3>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Recommended</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              General-purpose language model optimized for confidential inference. 7B parameters, suitable for most text
              generation tasks.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Context Window:</span>
                <span className="ml-2 font-semibold">8,192 tokens</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>
                <span className="ml-2 font-semibold">0.0001 ETH/token</span>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="text-lg font-semibold mb-3">llm-secure-13b</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Larger model with improved reasoning and instruction-following capabilities. Best for complex tasks
              requiring deeper understanding.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Context Window:</span>
                <span className="ml-2 font-semibold">16,384 tokens</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>
                <span className="ml-2 font-semibold">0.00025 ETH/token</span>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="text-lg font-semibold mb-3">llm-secure-fast</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Optimized for low-latency inference. Smaller model (3B) with faster response times, ideal for real-time
              applications.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Context Window:</span>
                <span className="ml-2 font-semibold">4,096 tokens</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>
                <span className="ml-2 font-semibold">0.00005 ETH/token</span>
              </div>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="embedding-models">
          Embedding Models
        </DocHeading>

        <div className="space-y-6">
          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="text-lg font-semibold mb-3">embed-secure-base</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Generate 768-dimensional embeddings for semantic search, clustering, and retrieval tasks while maintaining
              data confidentiality.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="ml-2 font-semibold">768</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>
                <span className="ml-2 font-semibold">0.00002 ETH/token</span>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/20">
            <h3 className="text-lg font-semibold mb-3">embed-secure-large</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Higher-dimensional embeddings (1536d) for improved accuracy in semantic search and similarity tasks.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="ml-2 font-semibold">1,536</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>
                <span className="ml-2 font-semibold">0.00004 ETH/token</span>
              </div>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="choosing-models">
          How to Choose a Model
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">Select the right model based on your use case:</p>

        <ul className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-semibold">General Use:</span>
            <span>
              Start with <code className="text-sm bg-muted px-1.5 py-0.5 rounded">llm-secure-7b</code> for the best
              balance of quality and cost
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-semibold">Complex Tasks:</span>
            <span>
              Use <code className="text-sm bg-muted px-1.5 py-0.5 rounded">llm-secure-13b</code> for reasoning,
              analysis, or long-form content
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-semibold">Real-Time:</span>
            <span>
              Choose <code className="text-sm bg-muted px-1.5 py-0.5 rounded">llm-secure-fast</code> for low-latency
              applications like chatbots
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-semibold">Search/RAG:</span>
            <span>
              Use <code className="text-sm bg-muted px-1.5 py-0.5 rounded">embed-secure-base</code> for semantic
              embeddings
            </span>
          </li>
        </ul>
      </DocSection>

      <DocSection>
        <DocHeading level={2} id="model-parameters">
          Model-Specific Parameters
        </DocHeading>
        <p className="text-muted-foreground leading-relaxed mb-4">All language models support these parameters:</p>

        <div className="space-y-4">
          <div className="border-l-2 border-primary pl-4">
            <code className="text-sm font-semibold">temperature</code>
            <span className="text-xs text-muted-foreground ml-2">0.0 - 2.0, default: 0.7</span>
            <p className="text-sm text-muted-foreground mt-1">
              Controls randomness. Lower values make output more focused and deterministic.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <code className="text-sm font-semibold">max_tokens</code>
            <span className="text-xs text-muted-foreground ml-2">1 - context_length</span>
            <p className="text-sm text-muted-foreground mt-1">Maximum number of tokens to generate in the response.</p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <code className="text-sm font-semibold">top_p</code>
            <span className="text-xs text-muted-foreground ml-2">0.0 - 1.0, default: 0.9</span>
            <p className="text-sm text-muted-foreground mt-1">
              Nucleus sampling parameter. Alternative to temperature for controlling randomness.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <code className="text-sm font-semibold">stop</code>
            <span className="text-xs text-muted-foreground ml-2">array of strings</span>
            <p className="text-sm text-muted-foreground mt-1">Sequences where the model will stop generating tokens.</p>
          </div>
        </div>
      </DocSection>
    </div>
  )
}
