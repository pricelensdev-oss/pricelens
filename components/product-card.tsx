"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Bell, Zap, Shield } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { DecisionBadge } from "./decision-badge"
import { DealScore } from "./deal-score"
import { TrendIndicator } from "./trend-indicator"
import { CompareToggle } from "./compare-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { SearchResult } from "@/lib/types"
import { toast } from "sonner"
import { usePreferences } from "@/hooks/use-preferences"
import { calculatePersonalizedPrice } from "@/lib/ppe"

interface ProductCardProps {
  product: SearchResult
}

export function ProductCard({ product }: ProductCardProps) {
  const { userId } = useAuth()
  const { preferences } = usePreferences()
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!userId) {
        const watchlist = JSON.parse(localStorage.getItem("pricelens-watchlist") ?? "[]")
        setIsInWatchlist(watchlist.includes(product.id))
        return
      }

      try {
        const response = await fetch("/api/watchlist")
        if (response.ok) {
          const watchlist = await response.json()
          setIsInWatchlist(watchlist.includes(product.id))
        }
      } catch (err) {
        console.error("Watchlist check failed", err)
      }
    }
    
    checkWatchlist()
  }, [product.id, userId])

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      const watchlist = JSON.parse(localStorage.getItem("pricelens-watchlist") ?? "[]")
      if (isInWatchlist) {
        const updated = watchlist.filter((id: string) => id !== product.id)
        localStorage.setItem("pricelens-watchlist", JSON.stringify(updated))
        setIsInWatchlist(false)
        toast.success("Removed from local watchlist")
      } else {
        watchlist.push(product.id)
        localStorage.setItem("pricelens-watchlist", JSON.stringify(watchlist))
        setIsInWatchlist(true)
        toast.success("Added to local watchlist")
      }
      return
    }

    try {
      const action = isInWatchlist ? "remove" : "add"
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, action }),
      })

      if (response.ok) {
        setIsInWatchlist(!isInWatchlist)
        toast.success(isInWatchlist ? "Removed from cloud" : "Added to cloud")
      }
    } catch (err) {
      toast.error("Failed to update watchlist")
    }
  }

  const discount = Math.round(
    ((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100
  )
  
  // Calculate Personalized Best Price across all platforms
  const personalizedPlatforms = product.platforms.map(p => {
    const result = calculatePersonalizedPrice(p as any, preferences)
    return {
      ...p,
      personalPrice: result.personalizedPrice
    }
  }).sort((a, b) => a.personalPrice - b.personalPrice)

  const currentPersonalBest = personalizedPlatforms.length > 0 
    ? personalizedPlatforms[0].personalPrice 
    : product.currentBestPrice

  const isPpeActive = currentPersonalBest < product.currentBestPrice

  return (
    <Link href={`/product/${product.id}`} className="block">
      <Card className="luxury-card group overflow-hidden border-none shadow-2xl">
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-card">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            
            {/* Top Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              <div className={`transition-transform duration-500 group-hover:scale-110 ${product.decision === 'BUY' ? 'buy-verdict-pulse' : ''}`}>
                <DecisionBadge decision={product.decision} size="sm" />
              </div>
              {product.isShieldProtected && (
                <div className="flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1 backdrop-blur-xl border border-primary/30 shadow-glow-primary animate-stagger-1">
                  <Shield className="h-3 w-3 text-primary fill-primary/20" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary">Shield Protected</span>
                </div>
              )}
            </div>

            {discount > 0 && (
              <div className="absolute right-3 top-3 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold tracking-widest text-primary backdrop-blur-md border border-primary/20">
                {discount}% OFF
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute bottom-3 right-3 flex gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
              <CompareToggle productId={product.id} />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-background/60 backdrop-blur-md hover:bg-primary hover:text-primary-foreground border border-white/5 shadow-xl"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = `/product/${product.id}?alert=true`
                }}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-background/60 backdrop-blur-md hover:bg-primary hover:text-primary-foreground border border-white/5 shadow-xl"
                onClick={toggleWatchlist}
              >
                <Heart
                  className={`h-4 w-4 ${isInWatchlist ? "fill-danger text-danger" : ""}`}
                />
              </Button>
            </div>

            {/* Quick Verdict Reasoning Reveal */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 via-background/90 to-transparent p-5 transition-transform duration-500 group-hover:translate-y-0 z-10 border-t border-primary/20 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <Zap className="h-3 w-3 animate-pulse" /> Price Analysis
              </p>
              <p className="text-[11px] italic leading-relaxed text-white/90 line-clamp-3 mb-4">
                &ldquo;{product.reasoning}&rdquo;
              </p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-tighter text-secondary-foreground mb-1">Price Trend</p>
                  <p className="text-[10px] font-bold text-primary glow-primary truncate">{product.expectedMovement}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-tighter text-secondary-foreground mb-1">Target Window</p>
                  <p className="text-[10px] font-bold text-white truncate">{product.timeWindow}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                {product.brand}
              </span>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <TrendIndicator trend={product.trend} size="sm" />
            </div>

            <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-base font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            <div className="mt-4 flex items-end justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-display font-bold tracking-tight text-foreground">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(currentPersonalBest)}
                  </span>
                  {isPpeActive && (
                    <div className="flex items-center gap-0.5 rounded-full bg-primary/20 px-1.5 py-0.5 border border-primary/20">
                      <Zap className="h-2.5 w-2.5 text-primary fill-primary animate-pulse" />
                      <span className="text-[8px] font-black text-primary uppercase tracking-tighter">BEST</span>
                    </div>
                  )}
                  <DealScore score={product.dealScore} />
                </div>
                {product.originalPrice > product.currentBestPrice && (
                  <span className="text-[11px] font-medium text-muted-foreground/60 line-through">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(product.originalPrice)}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                  Reliability
                </span>
                <span className="text-[11px] font-mono text-primary/80">
                  {product.confidence}%
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 opacity-40">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                Verified 4 mins ago
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between border-t border-white/5 pt-4">
              <div className="flex flex-wrap gap-1.5">
                {product.platforms.slice(0, 2).map((platform, index) => (
                  <span
                    key={`${platform.platformId}-${index}`}
                    className="rounded-full bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                  >
                    {platform.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-primary/5 px-2 py-1 border border-primary/10">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">
                    {product.platforms.length} Platforms
                  </span>
                </div>
                {product.dealScore && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-success/5 px-2 py-1 border border-success/10">
                    <span className="text-[9px] font-bold text-success uppercase tracking-tighter">
                      Score: {product.dealScore}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
