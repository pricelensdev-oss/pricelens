import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TrendType } from "@/lib/types"

interface TrendIndicatorProps {
  trend: TrendType
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function TrendIndicator({
  trend,
  size = "md",
  showLabel = true,
}: TrendIndicatorProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const trendConfig = {
    up: {
      icon: TrendingUp,
      label: "Trending Up",
      color: "text-danger",
    },
    down: {
      icon: TrendingDown,
      label: "Trending Down",
      color: "text-success",
    },
    stable: {
      icon: Minus,
      label: "Stable",
      color: "text-muted-foreground",
    },
  }

  const config = trendConfig[trend]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-2 shrink-0", config.color)}>
      <Icon className={sizeClasses[size]} />
      {showLabel && (
        <span className={cn("font-bold whitespace-nowrap uppercase tracking-widest text-[10px]", textSizes[size] === "text-base" ? "text-xs" : "text-[10px]")}>
          {config.label}
        </span>
      )}
    </div>
  )
}
