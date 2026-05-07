"use client"

import { Card, CardContent } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="luxury-card overflow-hidden border-none bg-card/40">
      <CardContent className="p-0">
        {/* Image Placeholder */}
        <div className="relative aspect-square animate-pulse bg-white/5" />

        <div className="p-5">
          {/* Brand/Trend Placeholder */}
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-12 animate-pulse rounded bg-white/10" />
            <div className="h-1 w-1 rounded-full bg-white/5" />
            <div className="h-2 w-8 animate-pulse rounded bg-white/10" />
          </div>

          {/* Title Placeholder */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>

          {/* Price/Deal Placeholder */}
          <div className="mt-6 flex items-end justify-between">
            <div className="space-y-2">
              <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-2 w-16 animate-pulse rounded bg-white/5" />
            </div>
            <div className="h-4 w-8 animate-pulse rounded-full bg-primary/10" />
          </div>

          {/* Platforms Placeholder */}
          <div className="mt-5 flex gap-1.5 border-t border-white/5 pt-4">
            <div className="h-4 w-10 animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-12 animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-8 animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
