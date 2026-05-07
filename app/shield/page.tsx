"use client"

import { usePurchases, PurchasedItem } from "@/hooks/use-purchases"
import { AppShell } from "@/components/app-shell"
import { Shield, TrendingDown, ExternalLink, Calendar, Trash2, ArrowRight, Zap, RefreshCw, CheckCircle2, Loader2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { SearchResult } from "@/lib/types"

export default function ShieldDashboard() {
  const { purchasedItems, removePurchase } = usePurchases()
  const [products, setProducts] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [claimedIds, setClaimedIds] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (err) {
        console.error("Failed to load live market data", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getLivePrice = (id: string) => {
    return products.find(p => p.id === id)?.currentBestPrice || 0
  }

  const handleClaim = async (id: string) => {
    setClaimingId(id)
    // Simulate smart audit process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setClaimingId(null)
    setClaimedIds(prev => [...prev, id])
    toast.success("Price Match Verified! ₹" + (getLivePrice(id) > 0 ? (purchasedItems.find(i => i.id === id)?.purchasePrice || 0) - getLivePrice(id) : 0).toLocaleString() + " added to your wallet.")
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-black tracking-tight text-white uppercase font-display">Price Protection</h1>
            </div>
            <p className="text-sm text-secondary-foreground">
              Smart monitoring for {purchasedItems.length} protected purchases.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end px-4 border-r border-white/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wallet Balance</span>
                <span className="text-sm font-black text-primary">₹1,250.00</span>
             </div>
             <Button variant="outline" className="gap-2 border-white/5 bg-white/5 hover:bg-white/10 transition-all rounded-xl">
                <RefreshCw className="h-4 w-4" /> Sync Prices
             </Button>
          </div>
        </div>

        {purchasedItems.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-transparent p-12 text-center rounded-3xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Shield className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-bold text-white">No Active Protection</h2>
            <p className="mt-2 text-muted-foreground">Mark items as bought from your watchlist to activate Smart Shield monitoring.</p>
            <Button asChild className="mt-8 rounded-xl bg-primary text-primary-foreground font-bold px-8 h-12">
              <Link href="/watchlist">Go to Watchlist</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {purchasedItems.map((item) => {
              const livePrice = getLivePrice(item.id)
              const potentialRefund = livePrice > 0 ? item.purchasePrice - livePrice : 0
              const daysLeft = 7 - Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
              const isExpired = daysLeft < 0
              const isClaimed = claimedIds.includes(item.id)
              const isClaiming = claimingId === item.id

              return (
                <Card key={item.id} className="luxury-card border-white/5 overflow-hidden group rounded-3xl">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative aspect-square w-full sm:w-48 overflow-hidden bg-white/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      {!isExpired && !isClaimed && (
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1 backdrop-blur-md border border-primary/30 shadow-glow-primary">
                          <Zap className="h-3 w-3 text-primary animate-pulse" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-primary">Active</span>
                        </div>
                      )}
                      {isClaimed && (
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-success/20 px-2.5 py-1 backdrop-blur-md border border-success/30 shadow-glow-success">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-success">Matched</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight font-display">{item.name}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 text-primary/40" />
                              Bought {new Date(item.purchaseDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              <ExternalLink className="h-3.5 w-3.5 text-primary/40" />
                              {item.platform}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removePurchase(item.id)} className="text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Purchase Price</p>
                          <p className="text-2xl font-black text-white">₹{item.purchasePrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Live Market Price</p>
                          <div className="flex items-center gap-2">
                             <p className="text-2xl font-black text-primary">₹{livePrice.toLocaleString()}</p>
                             {potentialRefund > 0 && <TrendingDown className="h-5 w-5 text-success animate-bounce" />}
                          </div>
                        </div>
                        <div className="relative bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Protection Window</p>
                          <div className="flex items-center justify-between">
                            <p className={`text-xl font-black ${isExpired ? 'text-muted-foreground/40' : 'text-white'}`}>
                              {isExpired ? 'EXPIRED' : `${daysLeft} Days Left`}
                            </p>
                            {!isExpired && <Shield className="h-5 w-5 text-primary/60" />}
                          </div>
                          {!isExpired && <Progress value={(daysLeft / 7) * 100} className="h-1.5 mt-3 bg-white/5" />}
                        </div>
                      </div>

                      {potentialRefund > 0 && !isExpired && !isClaimed && (
                        <div className="mt-8 rounded-2xl bg-success/5 p-5 border border-success/20 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/20 shadow-glow-success">
                                <TrendingDown className="h-6 w-6 text-success" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-success uppercase tracking-widest">Price Match Opportunity</p>
                                <p className="text-base font-medium text-white">Value drop of ₹{potentialRefund.toLocaleString()} detected by Smart Audit.</p>
                              </div>
                            </div>
                            <Button 
                              size="lg" 
                              disabled={isClaiming}
                              onClick={() => handleClaim(item.id)}
                              className="w-full sm:w-auto h-12 px-8 bg-success hover:bg-success/90 text-success-foreground font-bold rounded-xl gap-2 transition-all active:scale-95"
                            >
                              {isClaiming ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Smart Auditing...
                                </>
                              ) : (
                                <>
                                  Claim Refund <ArrowRight className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {isClaimed && (
                        <div className="mt-8 rounded-2xl bg-primary/5 p-5 border border-primary/20 animate-in zoom-in-95 duration-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
                                <Wallet className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-primary uppercase tracking-widest">Refund Processed</p>
                                <p className="text-base font-medium text-white">₹{potentialRefund.toLocaleString()} added to your account.</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-success font-black text-sm uppercase tracking-tighter">
                              <CheckCircle2 className="h-5 w-5" />
                              Verified
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </AppShell>
  )
}
