"use client"

import { AppShell } from "@/components/app-shell"
import { usePurchases } from "@/hooks/use-purchases"
import { usePreferences } from "@/hooks/use-preferences"
import { Shield, Wallet, TrendingUp, ArrowUpRight, History, CreditCard, Settings, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default function ProfilePage() {
  const { purchasedItems } = usePurchases()
  const { preferences } = usePreferences()

  // Mock stats for simulation
  const stats = {
    totalSavings: 4250,
    potentialShieldSavings: purchasedItems.length * 150, // Simulated
    activeProtections: purchasedItems.length,
    claimAccuracy: 98,
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 page-fade-in">
        {/* Profile Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 rounded-3xl bg-primary/10 p-1 ring-1 ring-primary/20 shadow-glow-primary/20">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <span className="text-2xl font-black">JD</span>
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-white/10">
                <Shield className="h-3 w-3 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase font-display">John Doe</h1>
              <p className="text-sm text-secondary-foreground font-medium">PriceLens Elite Member • Since 2024</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 gap-2">
            <Settings className="h-4 w-4" /> Manage Account
          </Button>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="md:col-span-2 luxury-card p-8 rounded-3xl border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Wallet className="h-24 w-24" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Lifetime Savings Wallet</p>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-6">{formatPrice(stats.totalSavings)}</h2>
            <div className="flex items-center gap-4">
              <Button className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-glow-primary">
                Withdraw to Bank
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-white gap-2 text-[10px] font-bold uppercase tracking-widest">
                View History <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </Card>
          
          <Card className="luxury-card p-8 rounded-3xl border-white/5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Shield</p>
              <h3 className="text-2xl font-black text-white">{stats.activeProtections} Items</h3>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-1 mb-2">
                <Zap className="h-3 w-3 fill-success" /> Guarding ₹{formatPrice(stats.potentialShieldSavings)}
              </p>
              <Progress value={85} className="h-1 bg-white/5" />
            </div>
          </Card>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Personalization Hub</h4>
          
          <Link href="/shield">
            <div className="group flex items-center justify-between p-6 luxury-card rounded-2xl border-white/5 hover:border-primary/20 mb-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                  <Shield className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Price Protection Dashboard</p>
                  <p className="text-xs text-muted-foreground">Monitor and claim your price match refunds</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>
          </Link>

          <Link href="/watchlist">
            <div className="group flex items-center justify-between p-6 luxury-card rounded-2xl border-white/5 hover:border-primary/20 mb-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                  <History className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Shopping Watchlist</p>
                  <p className="text-xs text-muted-foreground">Manage your tracked items and alerts</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>
          </Link>

          <div className="group flex items-center justify-between p-6 luxury-card rounded-2xl border-white/5 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">Payment Methods</p>
                <p className="text-xs text-muted-foreground">Manage cards for 1-click buy decisions (Coming Soon)</p>
              </div>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full text-muted-foreground">Beta</span>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-12 p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
           <div className="flex flex-col sm:flex-row items-center gap-6">
              <TrendingUp className="h-10 w-10 text-primary" />
              <div>
                <h5 className="text-lg font-bold text-white">AI Shopping Insight</h5>
                <p className="text-sm text-secondary-foreground leading-relaxed mt-1">
                  Based on your recent watchlist activity, you can save an additional <span className="text-primary font-bold">₹1,840</span> by waiting for the upcoming "Freedom Sale" starting in 12 days.
                </p>
              </div>
           </div>
        </div>
      </main>
    </AppShell>
  )
}
