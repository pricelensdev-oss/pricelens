"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { ProductCard } from "@/components/product-card"
import { SkeletonGrid } from "@/components/skeleton-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingDown, Zap, Filter, ArrowUpRight } from "lucide-react"
import type { SearchResult } from "@/lib/types"

export function DealsClient({ initialDeals }: { initialDeals: SearchResult[] }) {
  const [filter, setFilter] = useState<"all" | "electronics" | "fashion" | "home">("all")
  
  const filteredDeals = useMemo(() => {
    if (filter === "all") return initialDeals
    return initialDeals.filter(d => d.category?.toLowerCase() === filter)
  }, [initialDeals, filter])

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 neural-mesh">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Market Discovery</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl">
              Current <span className="text-primary">Best</span> Deals
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Our smart engine has identified these significant price drops across 4 marketplaces. These items are at their lowest price in 90 days.
            </p>
          </div>
          
          <div className="flex gap-2">
            {(["all", "electronics", "fashion", "home"] as const).map((f) => (
              <Button
                key={f}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(f)}
                className={`rounded-full px-6 capitalize transition-all ${filter === f ? "bg-primary text-primary-foreground shadow-glow-primary" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1 space-y-6">
            <Card className="luxury-card border-primary/20 bg-primary/5 p-6 backdrop-blur-xl">
              <TrendingDown className="mb-4 h-8 w-8 text-primary" />
              <h3 className="text-lg font-bold text-white">Deal Alerts</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Deals in this section are moving fast. 82% of these prices are expected to change within 48 hours based on past trends.
              </p>
            </Card>

            <Card className="luxury-card border-white/5 bg-white/5 p-6">
              <Zap className="h-6 w-6 text-warning mb-4" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Picks</h4>
              <ul className="mt-4 space-y-4">
                {initialDeals.slice(0, 3).map((deal, i) => (
                  <li key={i} className="group cursor-pointer">
                    <p className="text-[10px] text-primary/60 font-bold uppercase">{deal.brand}</p>
                    <p className="text-xs text-white group-hover:text-primary transition-colors">{deal.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                       <span className="text-xs font-bold text-white">₹{deal.currentBestPrice.toLocaleString()}</span>
                       <span className="text-[10px] text-success font-black">-{Math.round(((deal.originalPrice-deal.currentBestPrice)/deal.originalPrice)*100)}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="lg:col-span-3">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDeals.map((deal) => (
                  <ProductCard key={deal.id} product={deal} />
                ))}
             </div>
          </div>
        </div>
      </main>
    </AppShell>
  )
}
