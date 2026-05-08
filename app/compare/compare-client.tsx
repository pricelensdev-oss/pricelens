"use client"

import { usePreferences } from "@/hooks/use-preferences"
import { DecisionBadge } from "@/components/decision-badge"
import { DealScore } from "@/components/deal-score"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, ExternalLink, Info, ArrowRight, Shield, ShieldOff, Zap, TrendingDown, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"
import { calculatePersonalizedPrice } from "@/lib/ppe"

export function CompareClient({ products }: { products: Product[] }) {
  const { preferences } = usePreferences()
  const { selectedBanks, isBusinessUser } = preferences

  return (
    <div className="relative overflow-x-auto rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-[240px] border-b border-white/5 bg-[#0a0a0c] p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">Feature</span>
            </th>
            {products.map((product) => (
              <th key={product.id} className="border-b border-white/5 p-6">
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/20">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="min-h-[3rem]">
                    <h3 className="line-clamp-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{product.brand}</p>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {/* ── Personalized Price Row ── */}
          <tr className="bg-primary/5">
            <th className="sticky left-0 z-10 bg-[#121214] p-6 align-top border-l-2 border-primary">
              <div className="flex flex-col">
                <p className="text-sm font-bold text-primary">Your Best Price</p>
                <p className="text-[9px] uppercase tracking-widest text-primary/40 mt-1">Smart Price Analysis</p>
              </div>
            </th>
            {products.map((product) => {
              const { personalizedPrice, breakdown } = calculatePersonalizedPrice(
                product.platforms[0],
                selectedBanks,
                isBusinessUser
              )
              const savings = product.currentBestPrice - personalizedPrice
              return (
                <td key={product.id} className="p-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tight text-primary">
                      ₹{personalizedPrice.toLocaleString("en-IN")}
                    </span>
                    {savings > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        <span className="text-[10px] font-bold text-success uppercase">
                          Smart Savings: ₹{savings.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
              )
            })}
          </tr>

          {/* ── Market Best Row ── */}
          <tr className="group">
            <th className="sticky left-0 z-10 bg-card/90 backdrop-blur-md p-6 align-top border-r border-white/5">
              <p className="text-sm font-semibold text-foreground">Market Best</p>
            </th>
            {products.map((product) => (
              <td key={product.id} className="p-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-foreground/60">
                    ₹{product.currentBestPrice.toLocaleString("en-IN")}
                  </span>
                  <DealScore score={product.decision?.confidence || 0} />
                </div>
              </td>
            ))}
          </tr>

          {/* ── Shield Row ── */}
          <tr className="group">
            <th className="sticky left-0 z-10 bg-card/90 backdrop-blur-md p-6 align-top border-r border-white/5">
              <p className="text-sm font-semibold text-foreground">Shield Status</p>
            </th>
            {products.map((product) => (
              <td key={product.id} className="p-6">
                {product.isShieldProtected ? (
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 border border-primary/20 w-fit">
                    <Shield className="h-3 w-3 text-primary fill-primary/20" />
                    <span className="text-[10px] font-bold text-primary uppercase">Protected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 opacity-20">
                    <ShieldOff className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase">Standard</span>
                  </div>
                )}
              </td>
            ))}
          </tr>

          {/* ── Business Advantage Row (Conditional) ── */}
          {isBusinessUser && (
            <tr className="bg-primary/5">
              <th className="sticky left-0 z-10 bg-[#121214] p-6 align-top border-l-2 border-primary/40">
                <p className="text-sm font-bold text-primary/80">Business Credit</p>
              </th>
              {products.map((product) => {
                const { gstCredit } = calculatePersonalizedPrice(
                  product.platforms[0],
                  selectedBanks,
                  isBusinessUser
                )
                return (
                  <td key={product.id} className="p-6">
                    <span className="text-sm font-mono text-primary/80">
                      ₹{gstCredit.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[9px] uppercase tracking-tighter text-primary/40">ITC Application</p>
                  </td>
                )
              })}
            </tr>
          )}

          {/* ── Momentum Row ── */}
          <tr className="group">
            <th className="sticky left-0 z-10 bg-card/90 backdrop-blur-md p-6 align-top border-r border-white/5">
              <p className="text-sm font-semibold text-foreground">Price Trend</p>
            </th>
            {products.map((product) => (
              <td key={product.id} className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-3 w-3 text-primary" />
                  <span className="text-[11px] font-bold text-foreground">{product.decision?.expectedMovement}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground/60" />
                  <span className="text-[10px] text-muted-foreground">{product.decision?.timeWindow}</span>
                </div>
              </td>
            ))}
          </tr>

          {/* ── AI Verdict ── */}
          <tr className="group">
            <th className="sticky left-0 z-10 bg-[#0a0a0c] p-6 align-top">
              <p className="text-sm font-semibold text-foreground">Market Verdict</p>
            </th>
            {products.map((product) => (
              <td key={product.id} className="p-6">
                <div className="mb-2">
                  <DecisionBadge decision={product.decision.decision} />
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground italic line-clamp-2">
                  "{product.decision?.reasoning}"
                </p>
              </td>
            ))}
          </tr>

          {/* ── Specs ── */}
          {Object.keys(products[0]?.specifications || {}).map((spec) => (
             <tr key={spec} className="group">
              <th className="sticky left-0 z-10 bg-card/90 backdrop-blur-md p-6 align-top border-r border-white/5">
                <p className="text-sm font-semibold text-foreground capitalize">{spec}</p>
              </th>
              {products.map((product) => (
                <td key={product.id} className="p-6 text-xs text-muted-foreground">
                  {product.specifications[spec] || "—"}
                </td>
              ))}
            </tr>
          ))}
          
          {/* ── CTA Row ── */}
          <tr>
            <th className="sticky left-0 z-10 bg-[#0a0a0c] p-6" />
            {products.map((product) => (
              <td key={product.id} className="p-6">
                <Button asChild className="w-full group/btn" variant="outline">
                  <Link href={`/product/${product.id}`} className="gap-2">
                    View Details <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
