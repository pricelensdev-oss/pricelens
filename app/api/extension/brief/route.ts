import { NextRequest, NextResponse } from "next/server"
import { analyzePriceSignals } from "@/lib/decision-engine"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { url, price, title } = await req.json()

    if (!url || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await db.product.findFirst({
      where: {
        OR: [
          { name: { contains: title } },
          { platforms: { some: { url: { contains: url } } } }
        ]
      },
      include: {
        snapshots: true
      }
    })

    // 2. Run the Intelligence Engine
    const snapshots = (product?.snapshots || []).map(s => ({
      date: s.timestamp.toISOString(),
      price: s.price,
      platform: s.platform,
      sellerName: s.sellerName || undefined,
      stockStatus: s.stockStatus || undefined,
      imageHash: s.imageHash || undefined,
    }))

    const decision = analyzePriceSignals(
      snapshots,
      price,
      title
    )

    // 3. Construct the "Human-Readable Brief"
    let brief = "Analysis Complete."
    if (decision.isFakeSale) {
      brief = "Avoid. This is an artificial price hike disguised as a sale."
    } else if (decision.type === "BUY") {
      brief = `Strong Buy. Current price is ${Math.round((1 - price/decision.fairValue) * 100)}% below fair market value.`
    } else if (decision.type === "WAIT") {
      brief = `Wait. Our engine predicts a correction within ${decision.timeWindow}.`
    }

    return NextResponse.json({
      verdict: decision.verdict,
      type: decision.type,
      score: decision.score,
      brief,
      isShieldProtected: decision.isShieldProtected
    })

  } catch (error) {
    console.error("[EXTENSION_API_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
