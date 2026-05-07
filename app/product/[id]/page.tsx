import { notFound } from "next/navigation"
import { getProductById } from "@/lib/data"
import { ProductClient } from "./product-client"
import { refreshProductIfStale } from "@/lib/scraper"

export const dynamic = "force-dynamic"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Phase 1: Trigger background refresh if data is stale
  // We don't await this to keep the initial load fast
  refreshProductIfStale(id).catch(err => console.error("Refresh failed", err))

  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  // Render client component
  return <ProductClient product={product} />
}
