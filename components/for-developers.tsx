import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

const devFeatures = [
  "Simple JS and Python SDKs",
  "Deterministic billing in ZEN",
  "Local encryption helpers",
  "Copy-paste examples for common workloads",
]

export function ForDevelopers() {
  return (
    <section id="developers" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for developers</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Integrate confidential AI inference into your applications with just a few lines of code.
              </p>
            </div>

            <div className="space-y-3">
              {devFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <a href="/docs">
            <Button size="lg" className="gap-2">
              View Documentation
            </Button>
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-secondary/50 px-6 py-3 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-muted" />
                <div className="h-3 w-3 rounded-full bg-muted" />
                <div className="h-3 w-3 rounded-full bg-muted" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">example.ts</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-1">
              <div className="text-muted-foreground">{"// Initialize Harpocrates client"}</div>
              <div>
                <span className="text-accent">const</span> <span className="text-foreground">client</span>{" "}
                <span className="text-muted-foreground">=</span> <span className="text-accent">new</span>{" "}
                <span className="text-primary">Harpocrates</span>
                <span className="text-muted-foreground">{"({"}</span>
              </div>
              <div className="pl-4">
                <span className="text-foreground">apiKey:</span> <span className="text-primary">"your-api-key"</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="text-muted-foreground">{"})"}</div>
              <div className="h-4" />
              <div className="text-muted-foreground">{"// Perform confidential inference"}</div>
              <div>
                <span className="text-accent">const</span> <span className="text-foreground">result</span>{" "}
                <span className="text-muted-foreground">=</span> <span className="text-accent">await</span>{" "}
                <span className="text-foreground">client</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-primary">infer</span>
                <span className="text-muted-foreground">{"({"}</span>
              </div>
              <div className="pl-4">
                <span className="text-foreground">model:</span> <span className="text-primary">"llm-secure-7b"</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="pl-4">
                <span className="text-foreground">input:</span> <span className="text-primary">encrypt</span>
                <span className="text-muted-foreground">(</span>
                <span className="text-primary">"Analyze this..."</span>
                <span className="text-muted-foreground">)</span>
              </div>
              <div className="text-muted-foreground">{"})"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
