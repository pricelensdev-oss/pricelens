"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeftRight, X, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useComparison } from "@/hooks/use-comparison"
import { cn } from "@/lib/utils"
import { Product } from "@/lib/types"

export function ComparisonBar() {
  const { comparisonIds, clearComparison, count, maxCount, toggleComparison } = useComparison()
  const [products, setProducts] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)

  // Fetch product basic info for the bar
  useEffect(() => {
    if (comparisonIds.length > 0) {
      setIsVisible(true)
      const fetchProducts = async () => {
        try {
          // In a real app, we might have an API for this
          // For now, we'll just show the IDs or fetch from a mock
          const response = await fetch(`/api/products/bulk?ids=${comparisonIds.join(",")}`)
          if (response.ok) {
            const data = await response.json()
            setProducts(data)
          }
        } catch (err) {
          console.error("Failed to fetch comparison products", err)
        }
      }
      fetchProducts()
    } else {
      setIsVisible(false)
      setProducts([])
    }
  }, [comparisonIds])

  if (!isVisible) return null

  const compareUrl = `/compare?ids=${comparisonIds.join(",")}`

  return (
    <div className="fixed bottom-[88px] left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4 animate-in slide-in-from-bottom-10 duration-500 sm:bottom-6">
      <div className="glass flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-card/80 p-3 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex gap-2">
            {comparisonIds.map((id) => {
              const product = products.find(p => p.id === id)
              return (
                <div key={id} className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-muted">
                  {product?.image ? (
                    <Image src={product.image} alt="" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[8px] text-muted-foreground uppercase">
                       ...
                    </div>
                  )}
                  <button 
                    onClick={() => toggleComparison(id)}
                    className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                </div>
              )
            })}
            
            {Array.from({ length: maxCount - count }).map((_, i) => (
              <div key={i} className="h-12 w-12 shrink-0 rounded-lg border border-dashed border-white/10 bg-white/5 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground/30">+</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearComparison}
            className="h-10 w-10 text-muted-foreground hover:text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button asChild size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={compareUrl}>
              Compare <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
