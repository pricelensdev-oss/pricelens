import Link from "next/link"
import { ArrowRight, TrendingUp, Zap, Shield, AlertTriangle, Target, Search } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { SearchBar } from "@/components/search-bar"
import { VerdictCard } from "@/components/verdict-card"
import { Button } from "@/components/ui/button"
import { getAllProducts, trendingSearches } from "@/lib/data"
import { analyzePriceSignals } from "@/lib/decision-engine"
import { auth } from "@clerk/nextjs/server"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const { userId } = await auth()
  const products = await getAllProducts()
  
  // Using the pre-calculated intelligence from our Oracle Ingestion
  const featuredSignals = products.slice(0, 2).map(p => ({
    product: p,
    signal: p // SearchResult now extends DecisionSignal
  }))

  return (
    <AppShell>
      <div className="animate-reveal">
        {/* ── Hero & Intelligence Bar ────────────────────────── */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center neural-mesh border-b border-white/5 px-4 overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-30" />
          
          <div className="relative z-10 w-full max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-3xl">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Anti-Regret Intelligence
              </span>
            </div>

            <h1 className="text-balance font-display text-5xl font-black tracking-tighter text-white sm:text-8xl">
              Should I buy this <span className="text-primary italic">right now?</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg font-medium text-white/40 sm:text-xl">
              Paste any product URL to get an instant, high-conviction 
              <span className="text-white mx-2">BUY / WAIT / AVOID</span> verdict.
            </p>

            <div className="mt-12 glass p-4 rounded-[3rem] search-spotlight transition-all duration-700 max-w-3xl mx-auto border-white/10">
              <SearchBar size="large" className="max-w-none border-none bg-transparent" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                <Shield className="w-3 h-3" /> Fraud Protection Active
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                <Target className="w-3 h-3" /> Market Fair Price Analysis
              </div>
            </div>
          </div>
        </section>

        {/* ── Live Market Intelligence ────────────────────────── */}
        <section className="py-24 bg-[#0B0C0E]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center space-y-4">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Live Intelligence Feed</h2>
              <p className="text-3xl font-bold text-white tracking-tight">Current Market Convictions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              {featuredSignals.map(({ product, signal }) => (
                <div key={product.id} className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{product.name}</span>
                    <Link href={`/product/${product.id}`} className="text-xs font-bold text-primary hover:underline">Full Analysis</Link>
                  </div>
                  <VerdictCard signal={signal} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: TrendingUp, 
                  title: "Fake Sale Detection", 
                  desc: "We expose artificial price hikes designed to make discounts look bigger than they are." 
                },
                { 
                  icon: Search, 
                  title: "Cross-Market Analysis", 
                  desc: "Real-time pricing from Amazon, Flipkart, Croma, and Reliance Digital in one view." 
                },
                { 
                  icon: AlertTriangle, 
                  title: "Regret Prevention", 
                  desc: "Our predictive engine warns you if a significant price drop is expected within 14 days." 
                }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-primary/20 transition-all">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA: Join the Intelligence Network ─────────────── */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[120px]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              Never buy blindly <span className="text-primary italic">ever again.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto font-medium">
              Join 50,000+ smart shoppers using PriceLens to shield themselves from market manipulation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary text-black font-black uppercase tracking-widest px-10 h-16 rounded-2xl hover:scale-105 transition-all">
                Add to Browser — Free
              </Button>
              <Button variant="outline" size="lg" className="border-white/10 text-white font-black uppercase tracking-widest px-10 h-16 rounded-2xl hover:bg-white/5">
                Learn our AI
              </Button>
            </div>
          </div>
        </section>

        <footer className="py-20 border-t border-white/5 bg-black">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-10 w-10 bg-primary flex items-center justify-center rounded-xl shadow-2xl shadow-primary/40">
                <TrendingUp className="h-5 w-5 text-black" />
              </div>
              <span className="text-2xl font-black text-white italic tracking-tighter">PriceLens.</span>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4">
              © 2026 Intelligence Infrastructure • Not Affiliated with Marketplaces
            </p>
            <div className="flex items-center justify-center gap-8 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
              <Link href="/terms" className="hover:text-primary">Terms</Link>
              <Link href="/api" className="hover:text-primary">API</Link>
              <Link href="/docs" className="hover:text-primary">Methodology</Link>
            </div>
          </div>
        </footer>
      </div>
    </AppShell>
  )
}
