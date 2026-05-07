import { AppShell } from "@/components/app-shell"

export default function ProductLoading() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-6 lg:px-8 animate-pulse">
        {/* Breadcrumb */}
        <div className="mb-6 h-5 w-32 rounded bg-muted" />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left: image + specs */}
          <div className="space-y-6">
            <div className="aspect-square rounded-xl bg-muted" />
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="h-5 w-32 rounded bg-muted" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between border-b border-border pb-3">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-4 w-32 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-4/5 rounded bg-muted" />
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="h-8 w-40 rounded bg-muted" />
              <div className="h-4 w-56 rounded bg-muted" />
              <div className="mt-6 h-10 w-full rounded-xl bg-muted" />
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="h-5 w-28 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="space-y-3 rounded-lg bg-secondary p-4">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 flex-1 rounded-lg bg-muted" />
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="h-10 w-10 rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart tabs */}
        <div className="mt-12 space-y-4">
          <div className="flex gap-6 border-b border-border pb-3">
            <div className="h-5 w-24 rounded bg-muted" />
            <div className="h-5 w-36 rounded bg-muted" />
          </div>
          <div className="h-80 rounded-xl bg-muted" />
        </div>
      </main>
    </AppShell>
  )
}
