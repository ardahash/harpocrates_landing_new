import { AlertTriangle, FileCheck, Eye } from "lucide-react"

const problems = [
  {
    icon: Eye,
    title: "Your AI provider sees everything",
    description:
      "Every prompt, every document, every trade secret flows through their servers unencrypted. Complete data exposure to third-party providers.",
  },
  {
    icon: AlertTriangle,
    title: "Regulatory and compliance risk",
    description:
      "PII, PHI, financial data, and confidential business information require strict privacy guarantees that traditional AI APIs cannot provide.",
  },
  {
    icon: FileCheck,
    title: "No verifiable execution",
    description:
      "You simply trust their API black box. No proof of correct computation, no guarantees about data handling or model integrity.",
  },
]

export function WhyPrivacy() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why privacy-first AI?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional AI infrastructure exposes your most sensitive data to unnecessary risk
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <div key={problem.title} className="rounded-xl border border-border bg-card p-8 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <problem.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
