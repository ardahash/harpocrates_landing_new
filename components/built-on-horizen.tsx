import { Shield, Coins, Lock } from "lucide-react"

export function BuiltOnHorizen() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Horizen</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Built on Horizen Base</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Harpocrates leverages Horizen's privacy-first L3 appchain infrastructure for secure settlement, proof
            verification, and ZEN-based metering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Horizen Base L3</h3>
            <p className="text-sm text-muted-foreground">Privacy-first appchain optimized for confidential computing</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">ZEN Settlement</h3>
            <p className="text-sm text-muted-foreground">Native ZEN token for gas, metering, and billing</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Privacy Infrastructure</h3>
            <p className="text-sm text-muted-foreground">Confidential computing and zero-knowledge proofs</p>
          </div>
        </div>
      </div>
    </section>
  )
}
