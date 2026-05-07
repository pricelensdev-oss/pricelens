"use client"

import { cn } from "@/lib/utils"

interface ConfidenceMeterProps {
  value: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function ConfidenceMeter({
  value,
  size = "md",
  showLabel = true,
}: ConfidenceMeterProps) {
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }

  const getColor = (val: number) => {
    if (val >= 80) return "bg-success"
    if (val >= 60) return "bg-warning"
    return "bg-muted-foreground"
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Neural Confidence</span>
          </div>
          <span className="text-xs font-black text-foreground">{value}%</span>
        </div>
      )}
      <div
        className={cn("relative w-full overflow-hidden rounded-full bg-white/5", sizeClasses[size])}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            value >= 80 ? "bg-primary shadow-glow-primary" : "bg-muted-foreground/40"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && value < 80 && (
        <p className="mt-2 text-[9px] text-muted-foreground italic leading-tight">
          Confidence is currently limited by marketplace data staleness. Background refresh active.
        </p>
      )}
    </div>
  )
}
