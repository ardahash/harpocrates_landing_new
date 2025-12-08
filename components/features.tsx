import { Lock, Shield, Zap, Coins, Code, FileCheck } from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "End-to-end encrypted prompts",
    description:
      "Client-side encryption ensures your prompts and data remain confidential throughout the entire inference pipeline.",
  },
  {
    icon: Shield,
    title: "TEE + ZK attestation",
    description:
      "Hardware-backed trusted execution environments combined with zero-knowledge proofs for cryptographic verification.",
  },
  {
    icon: Zap,
    title: "Horizen Base L3 integration",
    description:
      "Native integration with Horizen's privacy-first appchain for secure settlement and proof verification.",
  },
  {
    icon: Coins,
    title: "ZEN-based metering and billing",
    description:
      "Transparent, deterministic billing in ZEN tokens. Pay only for what you use with on-chain settlement.",
  },
  {
    icon: Code,
    title: "Developer-friendly SDKs",
    description:
      "Simple JavaScript and Python SDKs with local encryption helpers and copy-paste examples for common workloads.",
  },
  {
    icon: FileCheck,
    title: "Compliance-ready private inference",
    description: "Meet GDPR, HIPAA, and enterprise compliance requirements with verifiable private computation.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Privacy-first infrastructure</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build confidential AI applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
