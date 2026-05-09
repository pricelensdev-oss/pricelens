import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { refreshProductIfStale } from "@/lib/scraper"
import { ingestProductFromUrl } from "@/lib/ingestion/engine"

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

    // 3. High-Fidelity Ingestion (Oracle V4)
    const result = await ingestProductFromUrl(url);
    
    if (result && result.productId) {
      return NextResponse.json({ productId: result.productId });
    }

    return NextResponse.json({ error: "Intelligence engine could not map this URL. Please verify the URL or try a popular marketplace." }, { status: 404 });

  } catch (error) {
    console.error("[Ingest API Error]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
