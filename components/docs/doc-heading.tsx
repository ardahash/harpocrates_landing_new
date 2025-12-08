import { cn } from "@/lib/utils"
import type React from "react" // Import React to declare JSX

interface DocHeadingProps {
  level: 1 | 2 | 3
  id?: string
  children: React.ReactNode
  className?: string
}

export function DocHeading({ level, id, children, className }: DocHeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements

  const styles = {
    1: "text-4xl font-bold mb-4 scroll-mt-20",
    2: "text-2xl font-bold mt-12 mb-4 scroll-mt-20 border-b border-border pb-2",
    3: "text-xl font-semibold mt-8 mb-3 scroll-mt-20",
  }

  return (
    <Component id={id} className={cn(styles[level], className)}>
      {id && (
        <a href={`#${id}`} className="text-muted-foreground hover:text-foreground transition-colors no-underline">
          {children}
        </a>
      )}
      {!id && children}
    </Component>
  )
}
