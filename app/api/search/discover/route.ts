import { NextRequest, NextResponse } from "next/server"
import { discoverProducts } from "@/lib/scraper"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query || query.length < 3) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    console.log(`🔍 [Discovery API] Starting search discovery for: "${query}"`)
    const discoveredIds = await discoverProducts(query)
    console.log(`✅ [Discovery API] Success. Ingested ${discoveredIds.length} new products.`)

    return NextResponse.json({ 
      success: true, 
      count: discoveredIds.length,
      discoveredIds 
    })
  } catch (error) {
    console.error("[API Error]:", error)
    return NextResponse.json({ error: "Discovery process failed" }, { status: 500 })
  }
}
