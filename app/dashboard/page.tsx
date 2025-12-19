import Link from "next/link"
import { Button } from "@/components/ui/button"
import { appConfig } from "@/lib/config"
import { PrivacyDemo } from "@/components/dashboard/privacy-demo"

export const metadata = {
  title: "Dashboard | Harpocrates",
}

const emptyStates = [
  {
    title: "Inference Workspace",
    body: "This is where you will send encrypted prompts, invoke models running in TEEs, and receive encrypted outputs.",
    action: "Open docs",
    href: "/docs",
  },
  {
    title: "Attestation & Receipts",
    body: "View attestations, verify proofs, and reference on-chain receipts posted to Horizen L3.",
    action: "View concepts",
    href: "/docs/concepts",
  },
  {
    title: "Billing & Usage",
    body: "Track token usage, costs, and funding status. Settlement will occur in ETH on Horizen L3.",
    action: "Read settlement guide",
    href: "/docs/zen-integration",
  },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="container mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Harpocrates</p>
            <h1 className="text-3xl md:text-4xl font-bold">Core App</h1>
            <p className="text-muted-foreground mt-2">
              Confidential inference with client-side encryption and ETH-settled metering on Horizen L3.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dev-health">
              <Button variant="outline">Dev Health</Button>
            </Link>
            <Link href="/docs">
              <Button>Docs</Button>
            </Link>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold">Network</h2>
            <p className="text-sm text-muted-foreground">
              Target: {appConfig.network.name || "Horizen L3"}{" "}
              {appConfig.network.chainId ? `(Chain ID ${appConfig.network.chainId})` : ""}
            </p>
            <p className="text-sm text-muted-foreground break-all">
              RPC: {appConfig.network.rpcUrl || "Not configured"}
            </p>
            <p className="text-sm text-muted-foreground break-all">
              Billing contract: {appConfig.billingContract || "Not configured"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold">Authentication</h2>
            <p className="text-sm text-muted-foreground">
              API keys and wallet auth are not wired yet. This space will host key management and session controls.
            </p>
            <p className="text-sm text-muted-foreground">Use docs and the Dev Health page to verify env configuration.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {emptyStates.map((state) => (
            <div key={state.title} className="rounded-xl border border-dashed border-border bg-card/60 p-6 space-y-3">
              <h3 className="text-lg font-semibold">{state.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{state.body}</p>
              <Link href={state.href}>
                <Button variant="outline" size="sm">
                  {state.action}
                </Button>
              </Link>
            </div>
          ))}
        </section>

        <PrivacyDemo />

        <section className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Privacy Workflow</h2>
            <Link href="/docs/security" className="text-sm text-primary hover:underline">
              Review security model
            </Link>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Encrypt prompts locally (keys stay client-side).</li>
            <li>Send encrypted payload to the Harpocrates TEE-backed service.</li>
            <li>Receive encrypted output + attestation + usage.</li>
            <li>Verify attestation and on-chain receipt, then decrypt output locally.</li>
          </ol>
          <p className="text-xs text-muted-foreground">
            This dashboard will orchestrate that flow; business logic is intentionally stubbed in this phase.
          </p>
        </section>
      </div>
    </main>
  )
}
