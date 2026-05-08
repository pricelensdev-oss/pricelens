import Link from "next/link"
import { ArrowRight, TrendingUp, Zap, Shield, Clock, Star, Users, BarChart3 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { SearchBar } from "@/components/search-bar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { getAllProducts, trendingSearches, categories } from "@/lib/data"
import { auth } from "@clerk/nextjs/server"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  console.log("[DEBUG]: HomePage starting...");
  const { userId } = await auth();
  console.log("[DEBUG]: Auth checked, userId:", userId);
  
  const products = await getAllProducts();
  console.log("[DEBUG]: Products fetched, count:", products.length);
  
  const featuredProducts = products.slice(0, 6);

  return (
    <AppShell>
      <div className="page-fade-in">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5 neural-mesh">
          {/* Animated background mesh */}
          <div className="absolute inset-0 hero-gradient opacity-40" />

          {/* Floating AI Orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="orb-1 absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="orb-2 absolute -right-40 top-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
            <div className="orb-3 absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Pill badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 backdrop-blur-xl animate-stagger-1">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Smart Purchase Assistant
                </span>
              </div>

              <h1 className="animate-stagger-2 text-balance font-display text-4xl font-black tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
                Know <span className="text-primary glow-primary">when to buy,</span><br />
                <span className="text-muted-foreground/60">not just where</span>
              </h1>

              <p className="animate-stagger-3 mt-8 mx-auto max-w-2xl text-pretty text-base leading-relaxed text-secondary-foreground sm:text-lg lg:text-xl">
                Compare prices across platforms and get real-time
                <span className="text-foreground font-bold underline decoration-primary/30 underline-offset-4 mx-2">BUY/WAIT/HOLD</span> decisions you can trust.
              </p>

              <div className="mt-12 flex flex-col items-center gap-6 animate-stagger-3">
                <div className="w-full max-w-3xl glass p-2 rounded-[2.5rem]">
                  <SearchBar size="large" className="max-w-none" />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  <span>Trending Verdicts:</span>
                  {trendingSearches.slice(0, 4).map((search) => (
                    <Link
                      key={search}
                      href={`/search?q=${encodeURIComponent(search)}`}
                      className="rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:scale-105"
                    >
                      {search}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust stats */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 animate-stagger-3">
                {[
                  { icon: BarChart3, label: "Live Tracking" },
                  { icon: Star, label: "90-Day Analytics" },
                  { icon: Users, label: "Unbiased Advice" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 opacity-50" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Pills ─────────────────────────────────────── */}
        <section className="border-b border-border py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[
                { icon: TrendingUp, title: "AI Buy Verdicts", description: "Clear BUY, WAIT, or HOLD decisions with confidence scores" },
                { icon: Zap, title: "Real-time Prices", description: "Compare across Amazon, Flipkart, Croma & Reliance Digital" },
                { icon: Clock, title: "Price History", description: "90-day trends to identify genuine deals vs fake discounts" },
                { icon: Shield, title: "Unbiased", description: "Not affiliated with any marketplace — only your savings matter" },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-card/80 sm:p-6"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 sm:h-12 sm:w-12">
                    <feature.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">{feature.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ────────────────────────────────────────── */}
        <section className="border-b border-border py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-between sm:mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">Browse by Category</h2>
                <p className="mt-1 text-sm text-muted-foreground">Find the best deals in your favourite category</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/search?q=${encodeURIComponent(category.name)}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 sm:p-5"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1">
                      {category.count} products
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:h-5 sm:w-5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ─────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-between sm:mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">Top AI Picks Today</h2>
                <p className="mt-1 text-sm text-muted-foreground">Products with the strongest buy recommendations right now</p>
              </div>
              <Button asChild variant="outline" size="sm" className="hidden gap-2 sm:flex">
                <Link href="/search">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button asChild variant="outline" size="sm">
                <Link href="/search" className="gap-2">
                  View all products <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 p-8 sm:p-12">
              {/* Decorative orbs */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/15 blur-2xl" />
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Stop guessing. Start saving.</h2>
                <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
                  Let our AI tell you exactly when to buy — and how much you&apos;ll save by waiting.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
                  <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                    <Link href="/search">Start Searching <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  {!userId && (
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                      <Link href="/how-it-works">How It Works</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="hidden border-t border-border bg-card sm:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 py-12 sm:grid-cols-4">
              {/* Brand */}
              <div className="sm:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
                    <TrendingUp className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-foreground">PriceLens</span>
                </Link>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  AI-powered purchase decision system for Indian e-commerce.
                </p>
              </div>

              {/* Navigate */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Navigate</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Browse Products", href: "/search" },
                    { label: "Today's Deals", href: "/deals" },
                    { label: "My Watchlist", href: "/watchlist" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Categories</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {["Smartphones", "Laptops", "TVs", "Audio", "Gaming", "Cameras"].map((cat) => (
                    <li key={cat}>
                      <Link href={`/search?q=${cat}`} className="transition-colors hover:text-foreground">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learn */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Learn</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/how-it-works" className="transition-colors hover:text-foreground">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works#verdicts" className="transition-colors hover:text-foreground">
                      Understanding AI Verdicts
                    </Link>
                  </li>
                  <li>
                    <Link href="/deals" className="transition-colors hover:text-foreground">
                      Best Deals Today
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 sm:flex-row">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} PriceLens. Prices are indicative and may vary.
              </p>
              <p className="text-xs text-muted-foreground">
                Not affiliated with Amazon, Flipkart, Croma or Reliance Digital.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AppShell>
  )
}
