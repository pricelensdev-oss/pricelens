"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { SearchBar } from "@/components/search-bar"
import { ProductCard } from "@/components/product-card"
import { SkeletonGrid } from "@/components/skeleton-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories } from "@/lib/data"
import type { SearchResult, DecisionType, TrendType } from "@/lib/types"
import { X, SlidersHorizontal, ArrowUpDown, Sparkles, Loader2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { calculatePersonalizedPrice } from "@/lib/ppe"
import { usePreferences } from "@/hooks/use-preferences"

type SortOption = "relevance" | "price-asc" | "price-desc" | "discount" | "confidence"

function ProductGrid({ products, isLoading }: { products: any[], isLoading?: boolean }) {
  if (isLoading) {
    return <SkeletonGrid count={8} />
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <SlidersHorizontal className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground sm:text-lg">
            No products found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

interface FilterItem {
  name: string
  count: number
}

interface Filters {
  decisions: DecisionType[]
  categories: string[]
  brands: string[]
  trends: TrendType[]
  minPrice: number | null
  maxPrice: number | null
}

function FilterSidebar({
  filters,
  setFilters,
  availableBrands,
  availableCategories,
  className = "",
}: {
  filters: Filters
  setFilters: (filters: Filters) => void
  availableBrands: FilterItem[]
  availableCategories: FilterItem[]
  className?: string
}) {
  const toggleDecision = (decision: DecisionType) => {
    if (filters.decisions.includes(decision)) {
      setFilters({ ...filters, decisions: filters.decisions.filter((d) => d !== decision) })
    } else {
      setFilters({ ...filters, decisions: [...filters.decisions, decision] })
    }
  }

  const toggleCategory = (category: string) => {
    if (filters.categories.includes(category)) {
      setFilters({ ...filters, categories: filters.categories.filter((c) => c !== category) })
    } else {
      setFilters({ ...filters, categories: [...filters.categories, category] })
    }
  }

  const toggleBrand = (brand: string) => {
    if (filters.brands.includes(brand)) {
      setFilters({ ...filters, brands: filters.brands.filter((b) => b !== brand) })
    } else {
      setFilters({ ...filters, brands: [...filters.brands, brand] })
    }
  }

  const toggleTrend = (trend: TrendType) => {
    if (filters.trends.includes(trend)) {
      setFilters({ ...filters, trends: filters.trends.filter((t) => t !== trend) })
    } else {
      setFilters({ ...filters, trends: [...filters.trends, trend] })
    }
  }

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Decision Filter */}
      <div>
        <h3 className="mb-2.5 text-sm font-semibold text-foreground">AI Recommendation</h3>
        <div className="space-y-2">
          {[
            { label: "BUY NOW", value: "BUY" as DecisionType, color: "bg-success" },
            { label: "WAIT", value: "WAIT" as DecisionType, color: "bg-warning" },
            { label: "HOLD", value: "HOLD" as DecisionType, color: "bg-muted-foreground" },
          ].map((option) => (
            <label
              key={option.label}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/50 sm:p-3"
            >
              <input
                type="checkbox"
                checked={filters.decisions.includes(option.value)}
                onChange={() => toggleDecision(option.value)}
                className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${option.color}`} />
                <span className="text-sm text-foreground">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="mb-2.5 text-sm font-semibold text-foreground">Categories</h3>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <label
              key={category.name}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/50 sm:p-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.name)}
                  onChange={() => toggleCategory(category.name)}
                  className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">{category.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="mb-2.5 text-sm font-semibold text-foreground">Brands</h3>
        <div className="space-y-2">
          {availableBrands.map((brand) => (
            <label
              key={brand.name}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/50 sm:p-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand.name)}
                  onChange={() => toggleBrand(brand.name)}
                  className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">{brand.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{brand.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-2.5 text-sm font-semibold text-foreground">Price Range (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Trend Filter */}
      <div>
        <h3 className="mb-2.5 text-sm font-semibold text-foreground">Price Trend</h3>
        <div className="space-y-2">
          {[
            { label: "Trending Down ↓", value: "down" as TrendType, color: "text-success" },
            { label: "Stable →", value: "stable" as TrendType, color: "text-muted-foreground" },
            { label: "Trending Up ↑", value: "up" as TrendType, color: "text-danger" },
          ].map((trend) => (
            <label
              key={trend.label}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/50 sm:p-3"
            >
              <input
                type="checkbox"
                checked={filters.trends.includes(trend.value)}
                onChange={() => toggleTrend(trend.value)}
                className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
              />
              <span className={`text-sm ${trend.color}`}>{trend.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SearchPageClient({ 
  initialProducts,
  availableBrands,
  availableCategories 
}: { 
  initialProducts: SearchResult[],
  availableBrands: FilterItem[],
  availableCategories: FilterItem[]
}) {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const [sort, setSort] = useState<SortOption>("relevance")
  const { preferences } = usePreferences()

  const [filters, setFilters] = useState<Filters>({
    decisions: [],
    categories: [],
    brands: [],
    trends: [],
    minPrice: null,
    maxPrice: null,
  })

  const [isDiscovering, setIsDiscovering] = useState(false)
  const lastDiscoveredQuery = useRef<string | null>(null)
  const router = useRouter()

  const allProducts = initialProducts

  const filteredProducts = useMemo(() => {
    const withPersonalPrice = allProducts.map(p => {
      const personalizedPlatforms = p.platforms.map(pl => ({
        ...pl,
        personalPrice: calculatePersonalizedPrice(pl as any, preferences)
      })).sort((a, b) => a.personalPrice - b.personalPrice)
      
      const bestPersonal = personalizedPlatforms.length > 0 ? personalizedPlatforms[0].personalPrice : p.currentBestPrice
      return { ...p, personalizedPrice: bestPersonal }
    })

    const filtered = withPersonalPrice.filter((product) => {
      // Search query filtering
      if (query) {
        const lowerQuery = query.toLowerCase()
        const matchesQuery = 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.brand.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
        
        if (!matchesQuery) return false
      }

      if (filters.decisions.length > 0 && !filters.decisions.includes(product.decision)) {
        return false
      }

      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) {
          return false
        }
      }

      if (filters.trends.length > 0 && !filters.trends.includes(product.trend)) {
        return false
      }

      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      if (filters.minPrice !== null && product.personalizedPrice < filters.minPrice) {
        return false
      }
      if (filters.maxPrice !== null && product.personalizedPrice > filters.maxPrice) {
        return false
      }

      return true
    })

    // Sorting
    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.personalizedPrice - b.personalizedPrice)
      case "price-desc":
        return [...filtered].sort((a, b) => b.personalizedPrice - a.personalizedPrice)
      case "discount":
        return [...filtered].sort((a, b) => {
          const discountA = ((a.originalPrice - a.personalizedPrice) / a.originalPrice) * 100
          const discountB = ((b.originalPrice - b.personalizedPrice) / b.originalPrice) * 100
          return discountB - discountA
        })
      case "confidence":
        return [...filtered].sort((a, b) => b.confidence - a.confidence)
      default:
        return filtered
    }
  }, [allProducts, filters, sort, query, preferences])

  useEffect(() => {
    const triggerDiscovery = async () => {
      if (query && query.length >= 3 && !isDiscovering && lastDiscoveredQuery.current !== query) {
        // Only trigger if we have very few results
        if (filteredProducts.length < 2) {
          lastDiscoveredQuery.current = query
          console.group(`🚀 PriceLens AI: Discovering "${query}"`)
          console.log("Status: Local results low. Triggering Agentic Discovery...")
          setIsDiscovering(true)
          try {
            const response = await fetch("/api/search/discover", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query }),
            })
            if (response.ok) {
              const data = await response.json()
              console.log(`Success: Found ${data.count} new items. Refreshing UI...`)
              if (data.count > 0) {
                router.refresh()
              }
            } else {
              console.error("Discovery API returned an error")
            }
          } catch (err) {
            console.error("Discovery request failed", err)
          } finally {
            setIsDiscovering(false)
            console.groupEnd()
          }
        }
      }
    }

    triggerDiscovery()
  }, [query, filteredProducts.length, isDiscovering, router])

  const activeFilterCount =
    filters.decisions.length +
    filters.categories.length +
    filters.brands.length +
    filters.trends.length +
    (filters.minPrice !== null ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0)

  const clearFilters = () => {
    setFilters({
      decisions: [],
      categories: [],
      brands: [],
      trends: [],
      minPrice: null,
      maxPrice: null,
    })
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Search and Filters Row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex flex-1 gap-2">
            <SearchBar defaultValue={query} className="flex-row items-center gap-0" />
            
            {/* Mobile filter button integrated in the row */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-2xl border-white/10 bg-white/5 lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                  <span className="sr-only">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-background">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Filters
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-auto gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 max-h-[calc(100vh-120px)] overflow-y-auto pb-20">
                  <FilterSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    availableBrands={availableBrands}
                    availableCategories={availableCategories}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden shrink-0 lg:block lg:w-64">
            <div className="sticky top-20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Filters</h2>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </Button>
                )}
              </div>
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                availableBrands={availableBrands}
                availableCategories={availableCategories}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
              <div>
                <h1 className="text-lg font-bold text-foreground sm:text-2xl">
                  {query ? `Results for "${query}"` : "All Products"}
                </h1>
                <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                  {activeFilterCount > 0 &&
                    ` · ${activeFilterCount} filter${activeFilterCount !== 1 ? "s" : ""} active`}
                </p>
              </div>

              {/* Sort control */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  <SelectTrigger className="h-9 w-[160px] text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="discount">Biggest Discount</SelectItem>
                    <SelectItem value="confidence">AI Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:mb-6 sm:flex-wrap sm:pb-0">
                {filters.decisions.map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setFilters({ ...filters, decisions: filters.decisions.filter((x) => x !== d) })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary hover:bg-primary/20 sm:px-3 sm:text-sm"
                  >
                    {d}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.categories.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        categories: filters.categories.filter((x) => x !== c),
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:bg-secondary/80 sm:px-3 sm:text-sm"
                  >
                    {c}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.brands.map((b) => (
                  <button
                    key={b}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        brands: filters.brands.filter((x) => x !== b),
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:bg-secondary/80 sm:px-3 sm:text-sm"
                  >
                    {b}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.trends.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setFilters({ ...filters, trends: filters.trends.filter((x) => x !== t) })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:bg-secondary/80 sm:px-3 sm:text-sm"
                  >
                    {t === "down" ? "Trending ↓" : t === "up" ? "Trending ↑" : "Stable"}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {(filters.minPrice !== null || filters.maxPrice !== null) && (
                  <button
                    onClick={() => setFilters({ ...filters, minPrice: null, maxPrice: null })}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:bg-secondary/80 sm:px-3 sm:text-sm"
                  >
                    ₹{filters.minPrice ?? "0"}–{filters.maxPrice ?? "Any"}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {isDiscovering && (
              <div className="mb-6 flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="relative mb-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                  <Sparkles className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-foreground">AI is discovering fresh deals...</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  We are searching major platforms for {query} and analyzing 90-day price trends to find you the best recommendation.
                </p>
                <div className="mt-6 flex gap-1.5">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" />
                </div>
              </div>
            )}

            <ProductGrid products={filteredProducts} isLoading={isDiscovering && filteredProducts.length === 0} />
          </div>
        </div>
      </main>
    </AppShell>
  )
}
