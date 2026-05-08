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

  const products = q ? await searchProducts(q) : await getAllProducts()
  const brands = await getBrands()
  const categoryStats = await getCategoryStats()

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
