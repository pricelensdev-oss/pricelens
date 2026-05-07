import { getAllProducts } from "@/lib/data"
import { DealsClient } from "./deals-client"

export const metadata = {
  title: "AI Market Deals | PriceLens",
  description: "High-velocity price drops and neural market picks across Amazon, Flipkart, Croma, and Reliance Digital.",
}

export const dynamic = "force-dynamic"

export default async function DealsPage() {
  const allProducts = await getAllProducts()
  
  // Filter for products with a "BUY" verdict (the high-velocity deals)
  const deals = allProducts.filter(p => p.decision === "BUY")

  return <DealsClient initialDeals={deals} />
}
