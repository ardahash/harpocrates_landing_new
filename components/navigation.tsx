import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Harpocrates</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#developers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Developers
          </a>
          <a href="#roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Roadmap
          </a>
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              Dashboard
            </Button>
          </Link>
          <Link href="/dev-health">
            <Button size="sm" variant="ghost">
              Dev Health
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" size="sm">
              Read the Docs
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
