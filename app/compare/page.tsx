import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowLeftRight, Check, X, ExternalLink, Info } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { getProductsByIds } from "@/lib/data"
import { DecisionBadge } from "@/components/decision-badge"
import { DealScore } from "@/components/deal-score"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Compare Products | PriceLens",
  description: "Detailed side-by-side analysis of your top picks. Compare prices, AI verdicts, and specs.",
}

import { CompareClient } from "./compare-client"

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids: idsString } = await searchParams
  const ids = idsString ? idsString.split(",") : []
  const products = ids.length > 0 ? await getProductsByIds(ids) : []

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/search"><ArrowLeft className="h-4 w-4" /> Back to Search</Link>
          </Button>
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Comparison Analysis</h1>
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-xl">
              <ArrowLeftRight className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {products.length} Products Selected
              </span>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-card/40 py-20 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ArrowLeftRight className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No products selected for comparison</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Go back to the search page and click the compare icon on any product to add it here.
            </p>
            <Button asChild className="mt-8" size="lg">
              <Link href="/search">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <CompareClient products={products} />
        )}
      </main>
    </AppShell>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
