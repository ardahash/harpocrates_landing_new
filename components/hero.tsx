import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Shield } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary">
            <Lock className="h-3.5 w-3.5" />
            <span>Built on Horizen Base L3</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            Confidential AI inference,
            <br />
            <span className="text-primary">guarded by Harpocrates.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Send encrypted prompts → enclave runs inference → get verifiable outputs. No one, not even us, can see your
            data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="https://discord.gg/9DuwYJq7bf" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              Join our Discord for news <ArrowRight className="h-4 w-4" />
            </Button>
            </a>
            <a href="/docs">
            <Button size="lg" variant="outline">
              Read the Docs
            </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground pt-2">Privacy-first AI infrastructure • Metered in ZEN</p>
        </div>

        {/* Visual representation */}
        <div className="mt-20 relative">
          <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur p-12">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Encrypted Input</span>
              </div>

              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50" />

              <div className="flex flex-col items-center gap-3">
                <div className="h-20 w-20 rounded-lg bg-primary/5 border-2 border-primary/30 flex items-center justify-center relative">
                  <Shield className="h-10 w-10 text-primary" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-accent rounded-full border-2 border-background" />
                </div>
                <span className="text-sm font-medium">TEE + ZK Enclave</span>
              </div>

              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50" />

              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-accent" />
                </div>
                <span className="text-sm text-muted-foreground">Verified Output</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
