"use client"

import { ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useComparison } from "@/hooks/use-comparison"
import { cn } from "@/lib/utils"

interface CompareToggleProps {
  productId: string
  className?: string
  variant?: "icon" | "full"
}

export function CompareToggle({ productId, className, variant = "icon" }: CompareToggleProps) {
  const { toggleComparison, isInComparison } = useComparison()
  const active = isInComparison(productId)

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-full bg-background/60 backdrop-blur-md transition-all border border-white/5 shadow-xl",
          active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-primary/20 hover:text-primary",
          className
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleComparison(productId)
        }}
        title={active ? "Remove from comparison" : "Add to comparison"}
      >
        <ArrowLeftRight className={cn("h-4 w-4", active && "animate-pulse")} />
      </Button>
    )
  }

  return (
    <Button
      variant={active ? "default" : "outline"}
      className={cn("gap-2", className)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleComparison(productId)
      }}
    >
      <ArrowLeftRight className={cn("h-4 w-4", active && "animate-pulse")} />
      {active ? "In Comparison" : "Compare"}
    </Button>
  )
}
