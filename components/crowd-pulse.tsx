"use client"

import { Users, TrendingUp, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface CrowdPulseProps {
  productId: string
  currentPrice: number
  targetPrice?: number
}

export function CrowdPulse({ productId, currentPrice, targetPrice }: CrowdPulseProps) {
  const [pulse, setPulse] = useState({
    waiting: 0,
    velocity: 0,
    heat: 0
  })

  useEffect(() => {
    // Deterministic simulation based on productId
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const baseWaiting = (hash % 1000) + 150
    const baseVelocity = (hash % 15) + 5
    const baseHeat = (hash % 40) + 40

    setPulse({
      waiting: baseWaiting,
      velocity: baseVelocity,
      heat: baseHeat
    })
  }, [productId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Users className="h-5 w-5 text-muted-foreground/60" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Market Interest</p>
            <h4 className="text-sm font-bold text-white">{pulse.waiting} People Watching</h4>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase">High Interest</span>
          </div>
          <p className="text-[10px] text-muted-foreground">+{pulse.velocity}% demand vs 24h</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Demand Level</p>
          <span className="text-[10px] font-mono text-primary">{pulse.heat}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary/40 to-primary shadow-glow-primary transition-all duration-1000" 
            style={{ width: `${pulse.heat}%` }} 
          />
        </div>
        <div className="flex justify-between text-[8px] uppercase tracking-tighter text-muted-foreground/40 font-bold">
          <span>Oversupplied</span>
          <span>Equilibrium</span>
          <span className="text-primary/60">Critical Demand</span>
        </div>
      </div>

      <p className="text-[10px] leading-relaxed text-muted-foreground/80 italic border-l border-white/10 pl-3">
        "Price Update: Demand for {targetPrice ? `₹${targetPrice.toLocaleString()}` : 'this price point'} is growing. Our smart system predicts stock may run low if a price drop occurs soon."
      </p>
    </div>
  )
}
