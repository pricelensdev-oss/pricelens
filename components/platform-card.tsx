import { ExternalLink, Tag, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Platform } from "@/lib/types"

interface PlatformCardProps {
  platform: Platform
  productId: string
  isBestPrice?: boolean
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function PlatformCard({ platform, productId, isBestPrice }: PlatformCardProps) {
  const discount = Math.round(
    ((platform.originalPrice - platform.effectivePrice) / platform.originalPrice) * 100
  )

  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-transparent p-4 transition-all",
        isBestPrice && "border-primary/20 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 p-1.5">
          <img src={platform.logo} alt={platform.name} className="h-full w-full object-contain brightness-0 invert opacity-60" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              {platform.name}
            </h3>
            {isBestPrice && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary border border-primary/20">
                Best Price
              </span>
            )}
            {platform.inStock ? (
              <span className="flex items-center gap-1 text-[10px] text-success font-medium">
                <Check className="h-2.5 w-2.5" /> In Stock
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-danger font-medium">
                <X className="h-2.5 w-2.5" /> Out of Stock
              </span>
            )}
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-black text-foreground">
              {formatPrice(platform.effectivePrice)}
            </span>
            {platform.effectivePrice < platform.price && (
              <span className="text-xs text-muted-foreground line-through opacity-40">
                {formatPrice(platform.price)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[10px] font-black text-primary uppercase">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          asChild
          size="sm"
          className="rounded-full px-6"
          disabled={!platform.inStock}
        >
          <a
            href={`/api/redirect?productId=${productId}&platformId=${platform.platformId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <span>Buy</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  )
}
