import { Suspense } from "react"
import { SearchPageClient } from "./search-client"

export const metadata = {
  title: "Browse Products",
  description: "Search and filter products across Amazon, Flipkart, Croma and Reliance Digital. Get AI buy verdicts to know when to purchase.",
}

import { searchProducts, getAllProducts, getBrands, getCategoryStats } from "@/lib/data"
import { discoverProducts } from "@/lib/scraper"
import { redirect } from "next/navigation"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; analyze?: string }>
}) {
  const { q, analyze } = await searchParams

  // Handle Smart Link Analysis
  if (analyze) {
    const productIds = await discoverProducts(analyze)
    if (productIds.length > 0) {
      redirect(`/product/${productIds[0]}`)
    }
  }

  let products = []
  let brands = []
  let categoryStats = []

  try {
    products = q ? await searchProducts(q) : await getAllProducts()
    brands = await getBrands()
    categoryStats = await getCategoryStats()
  } catch (error) {
    console.error("[CRITICAL]: Search page data fetching failed", error)
    // Keep them as empty arrays to avoid crashing the client component
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
