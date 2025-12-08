import { Lock, Shield, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Lock,
    title: "Encrypt",
    description:
      "Encrypt your prompt or embeddings client-side before transmission. Your data never leaves your control in plaintext.",
  },
  {
    number: "02",
    icon: Shield,
    title: "Compute in Silence",
    description:
      "Trusted execution environments (TEE) and ZK attestations guarantee privacy and correctness inside a secure enclave.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Verify & Settle",
    description:
      "Verify cryptographic proofs on-chain and settle compute costs in ZEN on Horizen Base. Fully auditable and transparent.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How Harpocrates works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three steps to confidential, verifiable AI inference
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="rounded-xl border border-border bg-card p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
