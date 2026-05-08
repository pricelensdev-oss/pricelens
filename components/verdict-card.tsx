"use client"

import { motion } from "framer-motion"
import { Shield, AlertTriangle, Timer, TrendingDown, Target, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { DecisionSignal } from "@/lib/types"

interface VerdictCardProps {
  signal: DecisionSignal
  className?: string
}

export function VerdictCard({ signal, className }: VerdictCardProps) {
  const isBuy = signal.decision === "BUY"
  const isWait = signal.decision === "WAIT"
  const isAvoid = signal.decision === "AVOID"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "luxury-card rounded-3xl p-8 border-t-2",
        isBuy && "verdict-buy",
        isWait && "verdict-wait",
        isAvoid && "verdict-avoid",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full",
              isBuy && "bg-primary/20 text-primary",
              isWait && "bg-warning/20 text-warning",
              isAvoid && "bg-danger/20 text-danger",
              signal.decision === "HOLD" && "bg-white/10 text-white/60"
            )}>
              PriceLens Smart Check
            </span>
            {signal.isShieldProtected && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                <Shield className="w-3 h-3" /> Best Price Guarantee
              </span>
            )}
          </div>
          
          <h2 className={cn(
            "text-5xl md:text-6xl font-black tracking-tighter italic",
            isBuy && "text-primary",
            isWait && "text-warning",
            isAvoid && "text-danger"
          )}>
            {signal.verdict}
          </h2>
          
          <p className="text-lg text-white/80 max-w-xl font-medium leading-relaxed">
            {signal.reasoning}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
              Deal Score
            </div>
            <div className="text-4xl font-display font-black text-white">
              {signal.score}/100
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
          <Target className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">The Right Price</div>
            <div className="text-lg font-bold text-white">
              {signal.fairValue ? `₹${signal.fairValue.toLocaleString()}` : "Checking..."}
            </div>
            <div className="text-xs text-white/40">Don't pay more than this</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
          <TrendingDown className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Price Chance</div>
            <div className="text-lg font-bold text-white">{signal.expectedMovement}</div>
            <div className="text-xs text-white/40">Expected in {signal.timeWindow}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
          {isAvoid ? (
            <AlertTriangle className="w-5 h-5 text-danger mt-0.5" />
          ) : (
            <Timer className="w-5 h-5 text-primary mt-0.5" />
          )}
          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Risk Level</div>
            <div className="text-lg font-bold text-white">
              {isAvoid ? "HIGH" : signal.volatility > 15 ? "MEDIUM" : "LOW"}
            </div>
            <div className="text-xs text-white/40">Is it safe to buy now?</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <Info className="w-3 h-3" /> 
          Price Analysis Complete
        </div>
        <div>PriceLens</div>
      </div>
    </motion.div>
  )
}
