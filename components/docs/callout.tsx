import type React from "react"
import { AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  type?: "info" | "warning" | "error"
  children: React.ReactNode
}

export function Callout({ type = "info", children }: CalloutProps) {
  const styles = {
    info: "border-blue-500/30 bg-blue-500/5 text-blue-200",
    warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-200",
    error: "border-red-500/30 bg-red-500/5 text-red-200",
  }

  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
  }

  const Icon = icons[type]

  return (
    <div className={cn("border rounded-lg p-4 flex gap-3", styles[type])}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}
