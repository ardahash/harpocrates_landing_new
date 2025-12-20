import { getRuntimeEnvStatus, getRuntimeConfig } from "@/lib/config"

export const metadata = {
  title: "Dev Health | Harpocrates",
}

export const dynamic = "force-dynamic"

const buildInfo = [
  { label: "Node Env", value: process.env.NODE_ENV || "unknown" },
  { label: "App Version", value: process.env.NEXT_PUBLIC_APP_VERSION || "not set" },
  { label: "Build Time", value: new Date().toISOString() },
]

export default function DevHealthPage() {
  const envStatus = getRuntimeEnvStatus()
  const appConfig = getRuntimeConfig()

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-5xl space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Diagnostics</p>
          <h1 className="text-3xl md:text-4xl font-bold">Dev Health</h1>
          <p className="text-muted-foreground">
            Build and environment status for the Harpocrates core app skeleton. No sensitive data is inspected here.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Build Info</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            {buildInfo.map((item) => (
              <div key={item.label} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="break-all">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Environment Variables</h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {envStatus.map((envVar) => (
              <div
                key={envVar.key}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
              >
                <span className="font-mono text-xs">{envVar.key}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    envVar.present ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {envVar.present ? "present" : "missing"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Add these to your environment to enable network calls, billing lookups, and API routing in later phases.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Chain / Provider Connectivity</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="font-medium text-foreground">RPC URL:</span>
              <span className="break-all">{appConfig.network.rpcUrl || "Not configured"}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium text-foreground">Chain ID:</span>
              <span>{appConfig.network.chainId ?? "Not provided"}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium text-foreground">Billing Contract:</span>
              <span className="break-all">{appConfig.billingContract || "Not configured"}</span>
            </p>
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                Live connectivity checks are stubbed in this phase. Once RPC credentials are set, add a client-side ping
                to confirm the provider is reachable.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">App State</h2>
          <p className="text-sm text-muted-foreground">
            Wallet/auth is intentionally not wired yet. This page will surface session state and signer status once
            integrated.
          </p>
        </section>
      </div>
    </main>
  )
}
