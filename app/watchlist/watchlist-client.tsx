"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { DecisionBadge } from "@/components/decision-badge"
import { TrendIndicator } from "@/components/trend-indicator"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth, SignInButton } from "@clerk/nextjs"
import { Heart, Bell, Trash2, Search, Plus, CloudOff, ArrowRight, Zap, Share2, Check, Shield } from "lucide-react"
import { toast } from "sonner"
import { usePreferences } from "@/hooks/use-preferences"
import { usePurchases } from "@/hooks/use-purchases"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { calculatePersonalizedPrice } from "@/lib/ppe"
import type { SearchResult } from "@/lib/types"

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function WatchlistClient({ allProducts }: { allProducts: SearchResult[] }) {
  const { userId, isLoaded } = useAuth()
  const { preferences } = usePreferences()
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [priceAlerts, setPriceAlerts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchWatchlist = async () => {
      const localSaved = localStorage.getItem("pricelens-watchlist")
      if (localSaved) setWatchlist(JSON.parse(localSaved))

      if (!userId) return

      try {
        const response = await fetch("/api/watchlist")
        if (response.ok) {
          const cloudIds = await response.json()
          setWatchlist(cloudIds)
        }
      } catch (error) {
        console.error("Failed to sync vault", error)
      }
    }

    if (isLoaded) fetchWatchlist()
    
    const savedAlerts = localStorage.getItem("pricelens-alerts")
    if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts))
  }, [userId, isLoaded])

  const removeFromVault = async (productId: string) => {
    const updated = watchlist.filter((id) => id !== productId)
    setWatchlist(updated)
    
    if (userId) {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "remove" }),
      })
    } else {
      localStorage.setItem("pricelens-watchlist", JSON.stringify(updated))
    }
  }

  const watchedProducts = allProducts.filter((p) => watchlist.includes(p.id)).map(p => {
    const personalizedPlatforms = p.platforms.map(pl => {
      const result = calculatePersonalizedPrice(pl as any, preferences)
      return { ...pl, personalPrice: result.personalizedPrice }
    }).sort((a, b) => a.personalPrice - b.personalPrice)
    
    const bestPersonal = personalizedPlatforms.length > 0 ? personalizedPlatforms[0].personalPrice : p.currentBestPrice
    return { ...p, personalizedPrice: bestPersonal }
  })
  
  // Intelligence Metrics
  const regretAvoided = watchedProducts
    .filter(p => p.decision === 'AVOID' || p.isFakeSale)
    .reduce((acc, p) => acc + (p.originalPrice - p.currentBestPrice), 0)
  
  const marketAlpha = watchedProducts
    .filter(p => p.decision === 'BUY')
    .reduce((acc, p) => acc + (p.originalPrice - p.personalizedPrice), 0)

  if (!isLoaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Zap className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Intelligence Header ── */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="luxury-card border-danger/20 bg-danger/5 p-8 backdrop-blur-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-danger/60 mb-2">Money Saved</p>
          <h3 className="text-4xl font-black tracking-tighter text-white">₹{(regretAvoided || 0).toLocaleString()}</h3>
          <p className="mt-4 text-[11px] text-white/40 leading-relaxed font-medium">
            This is the money you didn't lose by ignoring fake sales and bad deals.
          </p>
        </Card>

        <Card className="luxury-card border-primary/20 bg-primary/5 p-8 backdrop-blur-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-2">Total Profit</p>
          <h3 className="text-4xl font-black tracking-tighter text-white">₹{(marketAlpha || 0).toLocaleString()}</h3>
          <p className="mt-4 text-[11px] text-white/40 leading-relaxed font-medium">
            Your total discount compared to the normal market price.
          </p>
        </Card>

        <Card className="luxury-card border-white/10 bg-white/5 p-8 backdrop-blur-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Items Tracked</p>
          <h3 className="text-4xl font-black tracking-tighter text-white">{watchedProducts.length} <span className="text-lg text-white/40">Items</span></h3>
          <p className="mt-4 text-[11px] text-white/40 leading-relaxed font-medium">
            We are checking prices for these items every hour across all stores.
          </p>
        </Card>
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">My Saved Items<span className="text-primary">.</span></h1>
          <p className="mt-2 text-sm font-medium text-white/40">
            Smart price tracking for {watchedProducts.length} products
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
            Share List
          </Button>
          <Button size="lg" className="rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:scale-105 transition-all">
            Check Prices Now
          </Button>
        </div>
      </div>

      {watchedProducts.length === 0 ? (
        <Card className="border-white/5 bg-white/[0.02] p-16 text-center rounded-[2rem]">
          <h2 className="text-xl font-bold text-white/40 uppercase tracking-widest">Vault Empty</h2>
          <p className="mt-4 text-sm text-white/20">Awaiting your first intelligence commitment.</p>
          <Button asChild size="lg" className="mt-8 rounded-2xl bg-white/5 text-white font-bold border border-white/10">
            <Link href="/search">Browse Market</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {watchedProducts.map((product) => (
            <VaultItem
              key={product.id}
              product={product}
              onRemove={() => removeFromVault(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function VaultItem({ product, onRemove }: { product: any, onRemove: () => void }) {
  const isPpeActive = product.personalizedPrice < product.currentBestPrice

  return (
    <Card className="luxury-card group border-white/5 bg-white/[0.03] p-6 rounded-[1.5rem] transition-all hover:bg-white/[0.05]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Identity */}
        <div className="flex gap-6 flex-1 min-w-0">
          <Link href={`/product/${product.id}`} className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-black">
            <Image src={product.image} alt={product.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{product.brand}</span>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                product.decision === 'BUY' ? "border-primary/40 text-primary bg-primary/5" : "border-white/10 text-white/40"
              )}>
                {product.verdict || product.decision}
              </span>
            </div>
            <Link href={`/product/${product.id}`} className="text-lg font-bold text-white hover:text-primary transition-colors line-clamp-1 block">
              {product.name}
            </Link>
            <p className="mt-2 text-[11px] italic text-white/40 line-clamp-2 leading-relaxed">
              &ldquo;{product.reasoning}&rdquo;
            </p>
          </div>
        </div>

        {/* Information Section */}
        <div className="flex items-center justify-between lg:justify-end gap-12 shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
          <div className="flex flex-col">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Current Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">
                ₹{product.personalizedPrice ? product.personalizedPrice.toLocaleString() : "---"}
              </span>
              {isPpeActive && <Zap className="h-3 w-3 text-primary animate-pulse" />}
            </div>
          </div>
          
          <div className="text-right">
             <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Deal Score</p>
             <span className={cn(
               "text-2xl font-black font-display",
               product.score >= 80 ? "text-primary" : product.score >= 50 ? "text-warning" : "text-danger"
             )}>
               {product.score}
             </span>
          </div>

          <div className="flex items-center gap-2">
             <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-white/5 hover:text-primary transition-all">
               <Link href={`/product/${product.id}`}><ArrowRight className="h-5 w-5" /></Link>
             </Button>
             <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-danger/10 hover:text-danger transition-all" onClick={onRemove}>
               <Trash2 className="h-5 w-5" />
             </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
