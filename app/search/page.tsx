import { Suspense } from "react"
import { SearchPageClient } from "./search-client"

export const metadata = {
  title: "Browse Products",
  description: "Search and filter products across Amazon, Flipkart, Croma and Reliance Digital. Get AI buy verdicts to know when to purchase.",
}

import { searchProducts, getAllProducts, getBrands, getCategoryStats } from "@/lib/data"
import { discoverProducts } from "@/lib/scraper"
import { redirect } from "next/navigation"
import type { SearchResult } from "@/lib/types"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; analyze?: string }>
}) {
  const { q, analyze } = await searchParams

  // Handle Smart Link Analysis
  if (analyze) {
    try {
      const productIds = await discoverProducts(analyze)
      if (productIds.length > 0) {
        redirect(`/product/${productIds[0]}`)
      }
    } catch (e) {
      console.error("[CRITICAL]: URL Analysis failed", e)
    }
  }

  let products: SearchResult[] = []
  let brands: { name: string; count: number }[] = []
  let categoryStats: { name: string; count: number }[] = []

  try {
    products = q ? await searchProducts(q) : await getAllProducts()
    brands = await getBrands()
    categoryStats = await getCategoryStats()
  } catch (error) {
    console.error("[CRITICAL]: Search page data fetching failed", error)
  }

  return (
    <Suspense fallback={null}>
      <SearchPageClient 
        initialProducts={products} 
        availableBrands={brands}
        availableCategories={categoryStats}
      />
    </Suspense>
  )
}
