import { AppShell } from "@/components/app-shell"
import { syncUser } from "@/lib/auth"
import { WatchlistClient } from "./watchlist-client"
import { getAllProducts } from "@/lib/data"

export default async function WatchlistPage() {
  // Ensure user is synced with DB
  await syncUser()
  
  // Fetch products for the client component
  const allProducts = await getAllProducts()

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        <WatchlistClient allProducts={allProducts} />
      </main>
    </AppShell>
  )
}

