import { FileText, Search, MessageSquare, Building } from "lucide-react"

const useCases = [
  {
    icon: FileText,
    title: "Private document analysis",
    description:
      "Keep board decks, contracts, and internal memos in sacred silence. Analyze sensitive documents without exposing content to third parties.",
  },
  {
    icon: Search,
    title: "Confidential embeddings search",
    description:
      "Build semantic search over proprietary data while maintaining complete privacy. No leakage of business intelligence.",
  },
  {
    icon: MessageSquare,
    title: "Enterprise AI copilots",
    description:
      "Deploy AI assistants that work with sensitive customer data, financial records, and confidential communications securely.",
  },
  {
    icon: Building,
    title: "Secure ML for regulated industries",
    description:
      "Healthcare, finance, and legal sectors can leverage AI while meeting strict compliance and privacy requirements.",
  },
]

export function UseCases() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Use cases</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confidential AI for your most sensitive workloads
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="rounded-xl border border-border bg-card p-8 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <useCase.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{useCase.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
