import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { refreshProductIfStale } from "@/lib/scraper"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    
    // 1. Simple validation
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 })
    
    // 2. Check if we already have this product (via URL matching or partial slug)
    // For simulation, we'll try to find a product whose name or a platform URL matches
    const existingPlatform = await db.platform.findFirst({
      where: { url: { contains: url.split('?')[0] } }
    })

    if (existingPlatform) {
      // Trigger a refresh to ensure data is fresh for the user
      await refreshProductIfStale(existingPlatform.productId)
      return NextResponse.json({ productId: existingPlatform.productId })
    }

    // 3. New Product Discovery (Agentic Ingestion)
    // In a real app, we would scrape the URL here to get the product name
    // For simulation, we'll pick a random product from our "Discovery Pool" if not found
    const discoveryPool = [
      { id: "cm0-123", name: "iPhone 15 Pro" },
      { id: "cm0-456", name: "Sony WH-1000XM5" },
      { id: "cm0-789", name: "MacBook Pro M3" }
    ]
    
    // Randomly pick one or return the first one
    const placeholder = discoveryPool[Math.floor(Math.random() * discoveryPool.length)]
    
    // Ensure it exists in DB (simulate creation if needed)
    const product = await db.product.findFirst({
      where: { name: { contains: placeholder.name } }
    })

    if (product) {
      return NextResponse.json({ productId: product.id })
    }

    return NextResponse.json({ error: "Intelligence engine could not map this URL. Try a popular electronic item." }, { status: 404 })

  } catch (error) {
    console.error("[Ingest API Error]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
