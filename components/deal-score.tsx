"use client"

import { cn } from "@/lib/utils"

export function DealScore({ score }: { score: number }) {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "text-primary"
    if (s >= 50) return "text-warning"
    return "text-danger"
  }

  const strokeDasharray = `${score}, 100`

  return (
    <div className="relative flex items-center justify-center h-20 w-20">
      <svg className="h-full w-full" viewBox="0 0 36 36">
        <path
          className="stroke-muted"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={cn("transition-all duration-1000 ease-out", getColor(score).replace("text-", "stroke-"))}
          strokeWidth="3"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-xl font-black leading-none", getColor(score))}>
          {score}
        </span>
        <span className="text-[8px] font-bold uppercase tracking-tighter text-muted-foreground">
          Deal
        </span>
      </div>
    </div>
  )
}
