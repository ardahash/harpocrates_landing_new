const phases = [
  {
    phase: "Phase 1",
    title: "Testnet MVP",
    description:
      "Initial testnet deployment with encrypted inference capabilities and basic SDK support for early developers.",
    status: "In Progress",
  },
  {
    phase: "Phase 2",
    title: "Mainnet Launch",
    description:
      "Production mainnet deployment with ZEN billing, full Horizen Base integration, and enterprise-ready features.",
    status: "Q2 2025",
  },
  {
    phase: "Phase 3",
    title: "AI Compute Marketplace",
    description:
      "Decentralized marketplace for third-party model providers, staking mechanisms, and advanced governance.",
    status: "Q4 2025",
  },
]

export function Roadmap() {
  return (
    <section id="roadmap" className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Roadmap</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our path to production-ready confidential AI infrastructure
          </p>
        </div>

        <div className="space-y-8">
          {phases.map((phase, index) => (
            <div key={phase.phase} className="relative">
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  {index < phases.length - 1 && <div className="flex-1 w-px bg-border my-2" />}
                </div>

                <div className="flex-1 pb-12">
                  <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">{phase.phase}</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {phase.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold">{phase.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
