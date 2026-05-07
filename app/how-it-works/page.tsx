import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import {
  Search,
  TrendingUp,
  Bell,
  ShoppingCart,
  Zap,
  Shield,
  Clock,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "Search Any Product",
      description:
        "Enter the product you want to buy. We support smartphones, laptops, TVs, audio equipment, gaming consoles, and more across major Indian e-commerce platforms.",
    },
    {
      icon: BarChart3,
      title: "AI Analyzes Price Data",
      description:
        "Our AI examines 90 days of price history, current offers, bank discounts, upcoming sales, and stock levels to understand the complete pricing picture.",
    },
    {
      icon: Zap,
      title: "Get Your AI Verdict",
      description:
        "Receive a clear BUY, WAIT, or HOLD recommendation with a confidence score. We explain why and tell you exactly when to act for maximum savings.",
    },
    {
      icon: ShoppingCart,
      title: "Buy at the Best Price",
      description:
        "Follow our recommendation to purchase at the optimal time. We show you which platform has the best effective price including all bank offers.",
    },
  ]

  const features = [
    {
      icon: TrendingUp,
      title: "90-Day Price History",
      description:
        "See complete price trends across all platforms to understand if current prices are truly good deals.",
    },
    {
      icon: Bell,
      title: "Price Alerts",
      description:
        "Set your target price and get notified instantly when any platform drops to your desired price point.",
    },
    {
      icon: Shield,
      title: "Unbiased Recommendations",
      description:
        "We are not affiliated with any marketplace. Our only goal is to help you save money.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Prices are monitored continuously. Our recommendations update as market conditions change.",
    },
  ]

  const decisions = [
    {
      type: "BUY NOW",
      color: "bg-success text-success-foreground",
      meaning: "Price is at or near the lowest point. Buy now before prices increase.",
      factors: [
        "Current price is below or at historical lows",
        "No major sales expected soon",
        "Stock levels may be limited",
        "Prices showing upward momentum",
      ],
    },
    {
      type: "WAIT",
      color: "bg-warning text-warning-foreground",
      meaning: "Better deals are expected soon. Hold off on purchasing.",
      factors: [
        "Major sale event approaching",
        "Prices are currently above average",
        "Historical data shows regular price drops",
        "New model launch may reduce prices",
      ],
    },
    {
      type: "HOLD",
      color: "bg-muted text-muted-foreground",
      meaning: "Prices are stable. Buy if urgent, otherwise monitor.",
      factors: [
        "Prices are at average levels",
        "No clear price direction",
        "Consider waiting for occasional deals",
        "Urgency is the deciding factor",
      ],
    },
  ]

  return (
    <AppShell>
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background py-10 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                How PriceLens Works
              </h1>
              <p className="mt-4 text-sm text-muted-foreground sm:mt-6 sm:text-base lg:text-lg">
                We combine AI analysis with historical price data to tell you exactly when to buy
                for the best price.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="border-b border-border py-10 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-center text-xl font-bold text-foreground sm:mb-10 sm:text-2xl lg:text-3xl">
              Four Simple Steps
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:h-12 sm:w-12">
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground/30 sm:text-4xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold text-foreground sm:mb-2 sm:text-lg">{step.title}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Decision Types */}
        <section className="border-b border-border py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Understanding Market Verdicts
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our AI generates three types of recommendations based on comprehensive market
                analysis
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {decisions.map((decision) => (
                <div
                  key={decision.type}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div
                    className={`mb-4 inline-flex rounded-lg px-4 py-2 text-sm font-bold ${decision.color}`}
                  >
                    {decision.type}
                  </div>
                  <p className="mb-4 font-medium text-foreground">{decision.meaning}</p>
                  <ul className="space-y-2">
                    {decision.factors.map((factor) => (
                      <li key={factor} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 p-8 sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Ready to Start Saving?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Search for any product and get your first AI-powered buy recommendation in
                  seconds.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/search" className="gap-2">
                      Start Searching <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/deals">View Today&apos;s Deals</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  )
}
