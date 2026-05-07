import { AppShell } from "@/components/app-shell"

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-card/40 animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-12 rounded-full bg-white/5" />
          <div className="h-2 w-8 rounded-full bg-white/5" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded-lg bg-white/5" />
          <div className="h-4 w-2/3 rounded-lg bg-white/5" />
        </div>
        <div className="flex items-end justify-between pt-4">
          <div className="h-8 w-24 rounded-xl bg-white/10" />
          <div className="h-4 w-12 rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Hero skeleton */}
        <div className="mb-8 space-y-3 animate-pulse">
          <div className="mx-auto h-10 w-48 rounded-full bg-muted" />
          <div className="mx-auto h-12 w-96 max-w-full rounded-xl bg-muted" />
          <div className="mx-auto h-6 w-72 max-w-full rounded bg-muted" />
        </div>
        {/* Product grid skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </AppShell>
  )
}
