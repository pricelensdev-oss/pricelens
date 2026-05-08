"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Bell, Share2, Heart, Check, ExternalLink, Zap, ArrowLeftRight, Calendar, Users, Shield, ShieldOff, MapPin } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { usePreferences } from "@/hooks/use-preferences"
import { usePurchases } from "@/hooks/use-purchases"
import { AppShell } from "@/components/app-shell"
import { DecisionBadge } from "@/components/decision-badge"
import { TrendIndicator } from "@/components/trend-indicator"
import { ConfidenceMeter } from "@/components/confidence-meter"
import { PriceChart } from "@/components/price-chart"
import { PlatformCard } from "@/components/platform-card"
import { BankOfferFilter } from "@/components/bank-offer-filter"
import { CrowdPulse } from "@/components/crowd-pulse"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { PriceForecast } from "@/components/price-forecast"
import { AiSentiment } from "@/components/ai-sentiment"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { calculatePersonalizedPrice } from "@/lib/ppe"


const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function parseSuggestedTarget(currentPrice: number, movement: string): number {
  const match = movement.match(/[₹]?([\d,]+)/)
  if (match) {
    const amount = parseInt(match[1].replace(/,/g, ""))
    if (movement.toLowerCase().includes("drop")) {
      return currentPrice - amount
    }
  }
  return Math.round(currentPrice * 0.95) // Fallback to 5% drop
}

export function ProductClient({ product }: { product: Product }) {
  const { preferences, toggleBank } = usePreferences()
  const { selectedBanks, isBusinessUser } = preferences
  const { isPurchased, getPurchase } = usePurchases()
  
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [alertPrice, setAlertPrice] = useState("")
  const [hasAlert, setHasAlert] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)

  const calculatePersonalPrice = (p: any) => {
    return calculatePersonalizedPrice(p, selectedBanks, isBusinessUser)
  }

  const id = product.id

  const { userId, isLoaded: authLoaded } = useAuth()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("alert") === "true") {
      setAlertDialogOpen(true)
    }
  }, [searchParams])
  useEffect(() => {
    const checkStatus = async () => {
      if (!userId) {
        // Fallback to localStorage if not logged in
        const watchlist = JSON.parse(localStorage.getItem("pricelens-watchlist") ?? "[]")
        setIsInWatchlist(watchlist.includes(id))
        const alerts = JSON.parse(localStorage.getItem("pricelens-alerts") ?? "{}")
        if (alerts[id]) {
          setHasAlert(true)
          setAlertPrice(String(alerts[id]))
        }
        return
      }

      // If logged in, fetch from Cloud
      try {
        const [watchResponse, alertResponse] = await Promise.all([
          fetch("/api/watchlist"),
          fetch("/api/alerts")
        ])

        if (watchResponse.ok) {
          const watchlist = await watchResponse.json()
          setIsInWatchlist(watchlist.includes(id))
        }

        if (alertResponse.ok) {
          const alerts = await alertResponse.json()
          if (alerts[id]) {
            setHasAlert(true)
            setAlertPrice(String(alerts[id]))
          }
        }
      } catch (err) {
        console.error("Failed to fetch cloud status", err)
      }
    }

    checkStatus()
  }, [id, userId])

  const toggleWatchlist = async () => {
    if (!userId) {
      // Handle local state if not logged in
      const watchlist = JSON.parse(localStorage.getItem("pricelens-watchlist") ?? "[]")
      if (isInWatchlist) {
        const updated = watchlist.filter((wid: string) => wid !== id)
        localStorage.setItem("pricelens-watchlist", JSON.stringify(updated))
        setIsInWatchlist(false)
        toast.success("Stopped Tracking", {
          description: "This item is no longer in your list."
        })
      } else {
        watchlist.push(id)
        localStorage.setItem("pricelens-watchlist", JSON.stringify(watchlist))
        setIsInWatchlist(true)
        toast.success("Now Tracking", {
          description: "We will notify you if the price drops."
        })
      }
      return
    }

    // Handle Cloud
    try {
      const action = isInWatchlist ? "remove" : "add"
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, action }),
      })

      if (response.ok) {
        setIsInWatchlist(!isInWatchlist)
        toast.success(isInWatchlist ? "Removed from List" : "Tracking on all devices", {
          description: isInWatchlist ? "Item removed from your profile." : "You'll get alerts on all your devices."
        })
      }
    } catch (err) {
      toast.error("Failed to update watchlist")
    }
  }

  const setAlert = async () => {
    const priceValue = Number(alertPrice)
    if (!priceValue || priceValue <= 0) {
      toast.error("Please enter a valid price")
      return
    }

    if (!userId) {
      // Handle local state
      const alerts = JSON.parse(localStorage.getItem("pricelens-alerts") ?? "{}")
      alerts[id] = priceValue
      localStorage.setItem("pricelens-alerts", JSON.stringify(alerts))
      setHasAlert(true)
      setAlertDialogOpen(false)
      toast.success(`Local alert set for ${formatPrice(priceValue)}`)
      return
    }

    // Handle Cloud
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, targetPrice: priceValue, action: "set" }),
      })

      if (response.ok) {
        setHasAlert(true)
        setAlertDialogOpen(false)
        toast.success(`Cloud alert set for ${formatPrice(priceValue)}`)
        
        // Also ensure it's in the watchlist cloud-side
        if (!isInWatchlist) {
          await fetch("/api/watchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id, action: "add" }),
          })
          setIsInWatchlist(true)
        }
      }
    } catch (err) {
      toast.error("Failed to set alert")
    }
  }

  const removeAlert = async () => {
    if (!userId) {
      const alerts = JSON.parse(localStorage.getItem("pricelens-alerts") ?? "{}")
      delete alerts[id]
      localStorage.setItem("pricelens-alerts", JSON.stringify(alerts))
      setHasAlert(false)
      setAlertPrice("")
      toast.success("Local alert removed")
      return
    }

    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, action: "remove" }),
      })

      if (response.ok) {
        setHasAlert(false)
        setAlertPrice("")
        toast.success("Cloud alert removed")
      }
    } catch (err) {
      toast.error("Failed to remove alert")
    }
  }

  const shareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on PriceLens - Best price: ${formatPrice(product.currentBestPrice)}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  const sortedPlatforms = useMemo(() => {
    return [...product.platforms].map(p => {
      const result = calculatePersonalPrice(p)
      return { 
        ...p, 
        personalPrice: result.personalizedPrice, 
        breakdown: result.breakdown,
        delivery: result.deliveryEstimate
      }
    }).sort((a, b) => a.personalPrice - b.personalPrice)
  }, [product.platforms, preferences])

  const personalBestPrice = sortedPlatforms[0].personalPrice

  return (
    <AppShell hideBottomNav>
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Background Atmosphere */}
        <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -translate-x-1/2 -translate-y-1/2" />

        {/* Breadcrumb */}
        <nav className="relative mb-8">
          <Link
            href="/search"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Search
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image & Basic Info */}
          <div className="space-y-8">
            <div className="luxury-card relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-card">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover opacity-90 transition-opacity hover:opacity-100"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute left-6 top-6">
                <DecisionBadge decision={product.decision.decision} size="lg" />
              </div>
            </div>

            {/* Specifications */}
            <Card className="luxury-card border-none">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-tight text-foreground">Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0"
                    >
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{key}</dt>
                      <dd className="text-sm font-medium text-foreground">{value as string}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* AI Sentiment Intelligence */}
            <AiSentiment productName={product.name} />
          </div>

          {/* Product Details & Decision Engine */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary text-glow">
                  {product.brand}
                </span>
                <div className="h-1 w-1 rounded-full bg-white/10" />
                <TrendIndicator trend={product.trend} size="sm" />
                <div className="h-1 w-1 rounded-full bg-white/10" />
                <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-0.5 border border-white/5">
                  <Users className="h-3 w-3 text-muted-foreground/60" />
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                    {Math.floor(Math.random() * 500) + 120} Tracking
                  </span>
                </div>
              </div>
              <h1 className="font-display text-4xl font-black tracking-tighter text-foreground sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-secondary-foreground">{product.description}</p>
            </div>

            {/* Price Summary Hub */}
            <Card className="luxury-card border-none overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-20" />
              <CardContent className="relative p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-2">
                      Best Price Verdict ({product.currentBestPlatform})
                    </p>
                    <p className="font-display text-5xl font-black tracking-tighter text-foreground text-glow">
                      {formatPrice(personalBestPrice)}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 group/ppe cursor-help">
                      <Zap className="h-3 w-3 text-primary animate-pulse" />
                      <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest border-b border-primary/20 border-dotted">
                        Best Possible Savings
                      </p>
                      <div className="h-4 w-[1px] bg-white/10 mx-1" />
                      <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                        <MapPin className="h-2.5 w-2.5 text-primary/40" />
                        {sortedPlatforms[0].delivery}
                      </div>
                      <div className="invisible absolute left-0 top-full z-30 mt-2 w-72 rounded-xl glass border-primary/20 bg-card p-4 opacity-0 transition-all group-hover/ppe:visible group-hover/ppe:opacity-100 shadow-2xl">
                        <p className="text-[10px] font-black uppercase text-primary mb-3 flex items-center gap-2">
                          <Zap className="h-3 w-3" /> Price Breakdown
                        </p>
                        <div className="space-y-2 text-[10px] text-white/80">
                           <div className="flex justify-between border-b border-white/5 pb-1.5">
                             <span className="text-muted-foreground">Market Price ({sortedPlatforms[0].name})</span>
                             <span className="font-mono font-bold">{formatPrice(sortedPlatforms[0].price)}</span>
                           </div>
                           
                           {/* Bank Offer Breakdown */}
                           {sortedPlatforms[0].bankOffers && selectedBanks.some(bank => sortedPlatforms[0].bankOffers?.some((offer: string) => offer.toUpperCase().includes(bank.toUpperCase()))) && (
                             <div className="flex justify-between text-success">
                               <span>Bank Preferred Discount</span>
                               <span className="font-mono font-bold">-{formatPrice(sortedPlatforms[0].price - calculatePersonalizedPrice(sortedPlatforms[0] as any, { ...preferences, memberships: [], isBusinessUser: false }).personalizedPrice)}</span>
                             </div>
                           )}

                           {/* Membership Breakdown */}
                           {preferences.memberships.length > 0 && (
                             <div className="flex justify-between text-success">
                               <span>Membership Loyalty</span>
                               <span className="font-mono font-bold">-{formatPrice(calculatePersonalizedPrice(sortedPlatforms[0] as any, { ...preferences, memberships: [], isBusinessUser: false }).personalizedPrice - calculatePersonalizedPrice(sortedPlatforms[0] as any, { ...preferences, isBusinessUser: false }).personalizedPrice)}</span>
                             </div>
                           )}

                           {/* Business/GST Breakdown */}
                           {preferences.isBusinessUser && (
                             <div className="flex justify-between text-success-foreground bg-success/10 px-1 py-0.5 rounded">
                               <span>GST Input Credit (18%)</span>
                               <span className="font-mono font-bold">-{formatPrice(calculatePersonalizedPrice(sortedPlatforms[0] as any, { ...preferences, isBusinessUser: false }).personalizedPrice - personalBestPrice)}</span>
                             </div>
                           )}

                           <div className="border-t border-primary/20 pt-2 flex justify-between font-display text-xs font-black text-primary">
                             <span>Final Personalized Price</span>
                             <span className="text-glow">{formatPrice(personalBestPrice)}</span>
                           </div>
                        </div>
                        <p className="mt-3 text-[8px] text-muted-foreground italic leading-tight border-t border-white/5 pt-2 uppercase tracking-tighter">
                          Verified across 14 data sources. AI Confidence: {product.decision.confidence}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground/40 line-through">
                        {formatPrice(product.platforms[0].originalPrice)}
                      </span>
                      <div className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold tracking-widest text-primary border border-primary/20">
                        {Math.round(
                          ((product.platforms[0].originalPrice - product.currentBestPrice) /
                            product.platforms[0].originalPrice) *
                            100
                        )}
                        % SAVINGS POTENTIAL
                      </div>
                    </div>
                  </div>
                  <div className="glass h-14 w-auto px-5 rounded-2xl flex items-center justify-center glow-primary">
                    <TrendIndicator trend={product.trend} size="md" />
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">90D Low</p>
                    <p className="font-display text-base font-bold text-primary">
                      {formatPrice(product.lowestPrice)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">90D Avg</p>
                    <p className="font-display text-base font-bold text-foreground/80">
                      {formatPrice(product.averagePrice)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">90D High</p>
                    <p className="font-display text-base font-bold text-destructive/60">
                      {formatPrice(product.highestPrice)}
                    </p>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="mt-10 space-y-4">
                  <Button asChild className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-display text-lg font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <a
                      href={`/api/redirect?productId=${product.id}&platformId=${sortedPlatforms[0].platformId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3"
                    >
                      Buy on {sortedPlatforms[0].name}
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>

                  {/* PriceLens Shield - Outcome Guarantee */}
                  <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10">
                    <div className="absolute -right-4 -top-4 h-16 w-16 rotate-12 bg-primary/10 opacity-20 blur-2xl transition-all group-hover:scale-150" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 shadow-glow-primary">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-black uppercase tracking-widest text-white">Best Price Guarantee</h5>
                            <span className="rounded-full bg-success/20 px-2 py-0.5 text-[8px] font-bold text-success border border-success/20 uppercase tracking-tighter">Active</span>
                          </div>
                          <p className="mt-1 text-[10px] text-secondary-foreground leading-tight">
                            AI-Guaranteed. If the price drops within 7 days of your purchase, we cover the difference.
                          </p>
                        </div>
                      </div>
                      <Link href="/shield-protection" className="text-[10px] font-bold text-cta-blue uppercase hover:underline decoration-cta-blue/30 underline-offset-4">Details</Link>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="flex-1 h-14 rounded-2xl glass border-white/5 font-bold uppercase tracking-widest text-[10px] hover:bg-primary/10 hover:text-primary transition-all">
                          {hasAlert ? (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4" />
                              Price Alert Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              Set Price Alert
                            </div>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass border-white/10 p-8 rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="font-display text-2xl tracking-tight">Price Alerts</DialogTitle>
                          <DialogDescription className="text-muted-foreground/60">
                            Configure the AI to trigger a notification when the market hits your target.
                          </DialogDescription>
                        </DialogHeader>
                         <div className="space-y-6 pt-6">
                          {product.decision.decision === "WAIT" && !hasAlert && (
                            <div className="rounded-2xl bg-primary/5 p-5 border border-primary/20 glass">
                              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                                <Zap className="h-3 w-3" /> Target Price
                              </p>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-display text-2xl font-black text-foreground">
                                    {formatPrice(parseSuggestedTarget(product.currentBestPrice, product.decision.expectedMovement))}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground/60 italic mt-1 uppercase tracking-tight">
                                    Reason: {product.decision.expectedMovement}
                                  </p>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest"
                                  onClick={() => setAlertPrice(String(parseSuggestedTarget(product.currentBestPrice, product.decision.expectedMovement)))}
                                >
                                  Lock Target
                                </Button>
                              </div>
                            </div>
                          )}
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                              Your Target Price (INR)
                            </label>
                            <Input
                              type="number"
                              className="h-14 glass border-white/5 rounded-xl text-lg font-display"
                              placeholder={`Reference: ${product.currentBestPrice}`}
                              value={alertPrice}
                              onChange={(e) => setAlertPrice(e.target.value)}
                              suppressHydrationWarning
                            />
                            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-tight">
                              Historic Floor: {formatPrice(product.lowestPrice)}
                            </p>
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button onClick={setAlert} className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs">
                              {hasAlert ? "Update Monitor" : "Activate Monitor"}
                            </Button>
                            {hasAlert && (
                              <Button variant="ghost" className="h-14 px-6 rounded-xl border border-white/5 hover:bg-destructive/10 hover:text-destructive" onClick={removeAlert}>
                                Deactivate
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      className={cn(
                        "flex-1 h-14 rounded-2xl glass border-white/5 font-bold uppercase tracking-widest text-[10px] transition-all",
                        isInWatchlist ? "text-primary bg-primary/5" : "text-muted-foreground/60 hover:text-foreground"
                      )}
                      onClick={toggleWatchlist}
                    >
                      <Heart
                        className={cn("h-4 w-4 mr-2", isInWatchlist ? "fill-primary text-primary" : "")}
                      />
                      {isInWatchlist ? "Added to List" : "Track Price"}
                    </Button>

                    {!isPurchased(product.id) ? (
                      <Button
                        variant="ghost"
                        className="flex-1 h-14 rounded-2xl glass border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px] hover:bg-primary/5 transition-all"
                        onClick={() => setPurchaseDialogOpen(true)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Mark as Bought
                      </Button>
                    ) : (
                      <div className="flex-1 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Shield Active</span>
                      </div>
                    )}
                  </div>

                  {/* Predictive Intelligence (Stage 4) */}
                  <div className="mt-8 space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 px-1">
                      Smart Price Prediction
                    </h4>
                    <Card className="luxury-card border-primary/10 bg-primary/5 p-5 backdrop-blur-xl border-dashed">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Next Price Drop</p>
                            <h5 className="text-xs font-bold text-white">Independence Day Sale</h5>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-success uppercase tracking-tighter">-10% Drop</p>
                          <p className="text-[9px] text-muted-foreground">Historical Avg</p>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex gap-1">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={cn("h-4 w-1 rounded-full", i < 4 ? "bg-primary shadow-glow-primary" : "bg-white/5")} />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-primary">In 72 Days</span>
                      </div>
                      <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground italic">
                        "High confidence: Market data for {product.brand} suggests a scheduled entry window in mid-August. Early buyers usually pay 8-12% premium currently."
                      </p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Price Forecast */}
            <PriceForecast currentPrice={product.currentBestPrice} trend={product.trend} />

            {/* AI Decision Hub */}
            <Card className="luxury-card border-none">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-xl tracking-tight text-foreground">AI Analysis</CardTitle>
                  <DecisionBadge
                    decision={product.decision.decision}
                    confidence={product.decision.confidence}
                    showConfidence
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConfidenceMeter value={product.decision.confidence} />

                <div className="space-y-6 glass rounded-2xl p-6 border-white/5">
                  <div className="relative pl-4 border-l-2 border-primary/30">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-2">
                      Why Buy?
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80">{product.decision.reasoning}</p>
                  </div>
                  
                  <div className="border-t border-white/5 pt-6">
                    <CrowdPulse 
                      productId={product.id} 
                      currentPrice={product.currentBestPrice} 
                      targetPrice={hasAlert ? Number(alertPrice) : undefined}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">
                        Price Trend
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {product.decision.expectedMovement}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">
                        Best Time to Buy
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {product.decision.timeWindow}
                      </p>
                    </div>
                  </div>

                  {/* PriceLens Shield Integration */}
                  {product.isShieldProtected ? (
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-5 border border-primary/30 shadow-glow-primary transition-all hover:scale-[1.02]">
                      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 shadow-glow-primary">
                          <Shield className="h-5 w-5 text-primary fill-primary/20" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">PriceLens Shield Active</h5>
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          </div>
                          <p className="text-xs font-bold text-white mb-2">Verified Outcome Guarantee</p>
                          <p className="text-[10px] leading-relaxed text-muted-foreground/80 italic">
                            "Optimal Entry Detected. If the price of {product.name} drops within 7 days of purchase, our smart system will automatically trigger an alert for your Price Protection claim."
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white/5 p-4 border border-white/5 opacity-60">
                      <div className="flex items-center gap-3">
                        <ShieldOff className="h-4 w-4 text-muted-foreground/40" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                          Shield Guarantee Unavailable (Neutral Confidence)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-center pt-4 opacity-30">
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
                    PriceLens Smart Analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Price History & Analysis */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Chart Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                90-Day Price History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart 
                data={product.priceHistory} 
                className="h-[300px] w-full" 
                targetPrice={hasAlert ? Number(alertPrice) : undefined} 
                onPointClick={(price) => {
                  setAlertPrice(price.toString())
                  setAlertDialogOpen(true)
                  toast.info(`Set target to ₹${price.toLocaleString()}`)
                }}
              />
            </CardContent>
          </Card>

          {/* Platform Matrix Card */}
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" />
                Marketplace Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-2 space-y-1">
                {sortedPlatforms.map((platform: any, index: number) => (
                  <PlatformCard
                    key={platform.id}
                    platform={{ ...platform, effectivePrice: platform.personalPrice }}
                    productId={product.id}
                    isBestPrice={index === 0}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-white/5 bg-background/90 p-4 backdrop-blur-2xl sm:hidden animate-in slide-in-from-bottom-full duration-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
             <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Best Price</p>
             <p className="text-xl font-black text-foreground">{formatPrice(personalBestPrice)}</p>
          </div>
          <Button asChild className="h-12 rounded-xl bg-primary px-8 font-bold uppercase tracking-widest text-[10px] shadow-glow-primary">
            <a
              href={`/api/redirect?productId=${product.id}&platformId=${sortedPlatforms[0].platformId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Now
            </a>
          </Button>
        </div>
      </div>
      
      <PurchaseDialog 
        product={{
          id: product.id,
          name: product.name,
          image: product.image,
          currentBestPrice: product.currentBestPrice
        }}
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
      />
    </AppShell>
  )
}
