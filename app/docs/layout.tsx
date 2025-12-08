import type React from "react"
import { DocsNav } from "@/components/docs/docs-nav"
import { DocsHeader } from "@/components/docs/docs-header"

export const metadata = {
  title: "Harpocrates Documentation",
  description: "Complete guide to integrating confidential AI inference with Harpocrates",
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DocsHeader />
      <div className="container mx-auto">
        <div className="flex gap-8">
          <DocsNav />
          <main className="flex-1 py-8 px-4 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
