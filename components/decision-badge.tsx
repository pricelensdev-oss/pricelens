import { cn } from "@/lib/utils"
import type { DecisionType } from "@/lib/types"

interface DecisionBadgeProps {
  decision: DecisionType
  confidence?: number
  size?: "sm" | "md" | "lg"
  showConfidence?: boolean
}

export function DecisionBadge({
  decision,
  confidence,
  size = "md",
  showConfidence = false,
}: DecisionBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  }

  const decisionStyles: Record<DecisionType, string> = {
    BUY: "bg-primary/20 text-primary border border-primary/30 glow-success",
    WAIT: "bg-warning/20 text-warning border border-warning/30",
    HOLD: "bg-white/5 text-muted-foreground border border-white/10",
    AVOID: "bg-destructive/20 text-destructive border border-destructive/30",
  }

  const decisionDots: Record<DecisionType, string> = {
    BUY: "bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]",
    WAIT: "bg-warning",
    HOLD: "bg-muted-foreground/40",
    AVOID: "bg-destructive shadow-[0_0_8px_var(--destructive)]",
  }

  const decisionLabels: Record<DecisionType, string> = {
    BUY: "BUY",
    WAIT: "WAIT",
    HOLD: "HOLD",
    AVOID: "AVOID",
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "inline-flex items-center rounded-full font-display font-black uppercase tracking-[0.15em]",
          sizeClasses[size],
          decisionStyles[decision]
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", decisionDots[decision])} />
        {decisionLabels[decision]}
      </span>
      {showConfidence && confidence !== undefined && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          {confidence}% Confidence
        </span>
      )}
    </div>
  )
}
