import { Coins, TrendingUp, Store } from "lucide-react"

const economics = [
  {
    icon: Coins,
    title: "Pay per inference in ETH on Horizen L3",
    description: "Simple, transparent pricing. Pay only for the compute you use with deterministic on-chain settlement.",
  },
  {
    icon: TrendingUp,
    title: "Throughput tiers with funding controls",
    description: "Fund with ETH to unlock higher rate limits and preferential pricing as your usage scales.",
  },
  {
    icon: Store,
    title: "Future: AI Compute Marketplace",
    description: "Model providers can offer their models and earn ETH on Horizen L3 in a verified private marketplace.",
  },
]

export function TokenEconomics() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Token & Economics</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent economics powered by ETH on Horizen L3
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {economics.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-8 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
