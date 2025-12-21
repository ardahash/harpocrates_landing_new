"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Concepts", href: "/docs/concepts" },
      { title: "Models", href: "/docs/models" },
    ],
  },
  {
    title: "API & SDKs",
    items: [
      { title: "API Reference", href: "/docs/api-reference" },
      { title: "SDK Guides", href: "/docs/sdk-guides" },
    ],
  },
  {
    title: "Integration",
    items: [
      { title: "Settlement on Horizen L3", href: "/docs/zen-integration" },
      { title: "ZK Billing Proofs", href: "/docs/zk-billing" },
      { title: "Production", href: "/docs/production" },
      { title: "Security & Privacy", href: "/docs/security" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "FAQ", href: "/docs/faq" },
      { title: "Changelog", href: "/docs/changelog" },
    ],
  },
]

export function DocsNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
      <nav className="space-y-6">
        {navigation.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold mb-2">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 text-sm py-1.5 px-2 rounded transition-colors",
                        isActive
                          ? "text-primary bg-primary/10 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      {isActive && <ChevronRight className="h-3 w-3" />}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
