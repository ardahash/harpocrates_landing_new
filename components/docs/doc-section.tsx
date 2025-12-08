import type React from "react"
export function DocSection({ children }: { children: React.ReactNode }) {
  return <section className="mb-10">{children}</section>
}
