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
      // 1. Fetch from Local Storage first (for instant feedback)
      const localSaved = localStorage.getItem("pricelens-watchlist")
      if (localSaved) {
        setWatchlist(JSON.parse(localSaved))
      }

      if (!userId) return // Stop here for guests

      try {
        // 2. Fetch from Cloud
        const response = await fetch("/api/watchlist")
        if (response.ok) {
          const cloudIds = await response.json()
          
          // 3. Handle Migration if local storage exists
          if (localSaved) {
            const localIds = JSON.parse(localSaved)
            const newIds = localIds.filter((id: string) => !cloudIds.includes(id))
            
            if (newIds.length > 0) {
              await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "sync", productIds: localIds }),
              })
              setWatchlist([...new Set([...cloudIds, ...localIds])])
            } else {
              setWatchlist(cloudIds)
            }
            localStorage.removeItem("pricelens-watchlist")
          } else {
            setWatchlist(cloudIds)
          }
        }
      } catch (error) {
        console.error("Failed to sync watchlist", error)
      }
    }

    if (isLoaded) {
      fetchWatchlist()
    }
    
    const savedAlerts = localStorage.getItem("pricelens-alerts")
    if (savedAlerts) {
      setPriceAlerts(JSON.parse(savedAlerts))
    }
  }, [userId, isLoaded])

  const removeFromWatchlist = async (productId: string) => {
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

  const [isProcessing, setIsProcessing] = useState(false)

  const processAlerts = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/alerts/process", { method: "POST" })
      if (response.ok) {
        const data = await response.json()
        if (data.notified.length > 0) {
          toast.success(`Processed! Sent ${data.notified.length} notifications.`)
        } else {
          toast.info("Checked all alerts. No new price drops detected.")
        }
      }
    } catch (err) {
      toast.error("Failed to process alerts")
    } finally {
      setIsProcessing(false)
    }
  }

  const watchedProducts = allProducts.filter((p) => watchlist.includes(p.id)).map(p => {
    const personalizedPlatforms = p.platforms.map(pl => {
      const result = calculatePersonalizedPrice(pl as any, preferences)
      return {
        ...pl,
        personalPrice: result.personalizedPrice
      }
    }).sort((a, b) => a.personalPrice - b.personalPrice)
    
    const bestPersonal = personalizedPlatforms.length > 0 ? personalizedPlatforms[0].personalPrice : p.currentBestPrice
    return { ...p, personalizedPrice: bestPersonal }
  })
  
  // Growth & Retention Metrics
  // Potential Savings: Original Market Price - Your Personalized Best Price
  const totalPotentialSavings = watchedProducts.reduce((acc, p) => acc + (p.originalPrice - p.personalizedPrice), 0)
  const greatDealsCount = watchedProducts.filter(p => p.decision === 'BUY').length
  const activeAlertsCount = Object.keys(priceAlerts).length

  const handleShareWatchlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My PriceLens Watchlist',
          text: `I'm tracking ${watchlist.length} items on PriceLens. Check out these deals!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('User cancelled share')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Zap className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Savings Summary ── */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="luxury-card border-primary/20 bg-primary/5 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Total Market Opportunity</p>
              <h3 className="text-2xl font-black tracking-tight text-white">₹{totalPotentialSavings.toLocaleString()}</h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Aggregate savings across your entire watchlist based on historical peaks.
          </p>
        </Card>

        <Card className="luxury-card border-success/20 bg-success/5 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
              <Check className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-success/60">Active Deals</p>
              <h3 className="text-2xl font-black tracking-tight text-white">{greatDealsCount} Ready Now</h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Items that have hit their optimal 90-day price point based on smart analysis.
          </p>
        </Card>

        <Card className="luxury-card border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
              <Bell className="h-6 w-6 text-white/60" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Price Alerts</p>
              <h3 className="text-2xl font-black tracking-tight text-white">{activeAlertsCount} Set</h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Monitoring market fluctuations 24/7. You will be notified instantly on a match.
          </p>
        </Card>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Your Smart Watchlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {watchedProducts.length} items tracked across 4 major marketplaces
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" onClick={handleShareWatchlist} className="gap-2 border-white/10 bg-white/5">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          {!userId && (
            <SignInButton mode="modal">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Save to Cloud
              </Button>
            </SignInButton>
          )}
          {userId && (
          <Button 
            onClick={processAlerts} 
            disabled={isProcessing}
            variant="outline" 
            className="gap-2 border-primary/20 hover:bg-primary/5"
          >
            {isProcessing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Zap className="h-4 w-4 text-primary" />
            )}
            Run Price Check
          </Button>
        )}
        </div>
      </div>

      {/* Guest Banner */}
      {!userId && isLoaded && (
        <Card className="mb-6 border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CloudOff className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Cloud Sync is disabled</p>
                <p className="text-xs text-muted-foreground">Sign in to save your watchlist across all your devices and get email alerts.</p>
              </div>
            </div>
            <SignInButton mode="modal">
              <Button size="sm" className="w-full gap-2 sm:w-auto">
                Sign In to Sync <ArrowRight className="h-4 w-4" />
              </Button>
            </SignInButton>
          </div>
        </Card>
      )}

      {watchedProducts.length === 0 ? (
        <Card className="border-border bg-card p-8 sm:p-12">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted sm:mb-6 sm:h-16 sm:w-16">
              <Heart className="h-7 w-7 text-muted-foreground sm:h-8 sm:w-8" />
            </div>
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Your watchlist is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start adding products to track their prices.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="/search" className="gap-2">
                  <Search className="h-4 w-4" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {watchedProducts.map((product) => (
            <WatchlistItem
              key={product.id}
              product={product}
              alertPrice={priceAlerts[product.id]}
              onRemove={() => removeFromWatchlist(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function WatchlistItem({
  product,
  alertPrice,
  onRemove,
}: {
  product: any
  alertPrice?: number
  onRemove: () => void
}) {
  const { isPurchased, getPurchase } = usePurchases()
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)
  const isPpeActive = product.personalizedPrice < product.currentBestPrice
  const purchase = getPurchase(product.id)

  return (
    <Card className="border-border bg-card p-3 sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        {/* Product Image */}
        <Link
          href={`/product/${product.id}`}
          className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-24"
        >
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
        </Link>

        {/* Product Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {product.brand}
                </p>
                <Link
                  href={`/product/${product.id}`}
                  className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground hover:text-primary sm:text-base"
                >
                  {product.name}
                </Link>
                {purchase && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase">Shield Active</span>
                  </div>
                )}
              </div>
              <DecisionBadge decision={product.decision} size="sm" />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-base font-bold text-foreground sm:text-lg">
                    {formatPrice(product.personalizedPrice)}
                  </p>
                  {isPpeActive && (
                    <div className="flex items-center gap-0.5 rounded-full bg-primary/20 px-1.5 py-0.5 border border-primary/20">
                      <Zap className="h-2.5 w-2.5 text-primary fill-primary animate-pulse" />
                      <span className="text-[8px] font-black text-primary uppercase tracking-tighter">BEST</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Best price found
                </p>
              </div>
              <TrendIndicator trend={product.trend} size="sm" />

              {alertPrice && (
                <div className="flex-1 min-w-[120px] max-w-[200px] ml-2">
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Target: {formatPrice(alertPrice)}</p>
                    <p className="text-[9px] font-mono text-muted-foreground">
                      {product.personalizedPrice <= alertPrice 
                        ? "READY" 
                        : `${Math.round(Math.max(0, (1 - (product.personalizedPrice - alertPrice) / (product.originalPrice - alertPrice)) * 100))}%`}
                    </p>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${product.personalizedPrice <= alertPrice ? 'bg-success shadow-glow-success animate-pulse' : 'bg-primary'}`}
                      style={{ 
                        width: `${product.personalizedPrice <= alertPrice 
                          ? 100 
                          : Math.round(Math.max(5, (1 - (product.personalizedPrice - alertPrice) / (product.originalPrice - alertPrice)) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="mt-2 flex items-center gap-2 sm:hidden">
            <Button asChild variant="outline" size="sm" className="h-7 flex-1 text-xs">
              <Link href={`/product/${product.id}`}>View</Link>
            </Button>
            {!purchase && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 flex-1 text-xs border-primary/20 text-primary"
                onClick={() => setPurchaseDialogOpen(true)}
              >
                Bought
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-danger"
              onClick={onRemove}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {!purchase && (
            <Button variant="outline" size="sm" onClick={() => setPurchaseDialogOpen(true)} className="border-primary/20 text-primary hover:bg-primary/5">
              Mark as Bought
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/product/${product.id}`}>View Details</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-danger"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove from watchlist</span>
          </Button>
        </div>
      </div>

      <PurchaseDialog 
        product={{
          id: product.id,
          name: product.name,
          image: product.image,
          currentBestPrice: product.personalizedPrice
        }}
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
      />
    </Card>
  )
}
