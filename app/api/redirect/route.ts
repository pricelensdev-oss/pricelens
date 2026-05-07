import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const AFFILIATE_TAGS: Record<string, string> = {
  amazon: "pricelens-21",
  flipkart: "pricelens_aff",
  croma: "pl001",
  reliance: "pl001",
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const platformId = searchParams.get("platformId")
  const productId = searchParams.get("productId")

  if (!platformId || !productId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  }

  try {
    const platform = await db.platform.findUnique({
      where: {
        productId_platformId: {
          productId,
          platformId,
        },
      },
    })

    if (!platform) {
      return NextResponse.json({ error: "Platform not found" }, { status: 404 })
    }

    let finalUrl = platform.url

    // Append affiliate tag based on platform
    const tag = AFFILIATE_TAGS[platformId.toLowerCase()]
    if (tag) {
      const url = new URL(finalUrl)
      if (platformId.toLowerCase() === "amazon") {
        url.searchParams.set("tag", tag)
      } else if (platformId.toLowerCase() === "flipkart") {
        url.searchParams.set("affid", tag)
      } else {
        // Generic tracking param for others
        url.searchParams.set("utm_source", "pricelens")
        url.searchParams.set("utm_medium", "affiliate")
        url.searchParams.set("ref", tag)
      }
      finalUrl = url.toString()
    }

    // Redirect to the external store
    return NextResponse.redirect(finalUrl)
  } catch (error) {
    console.error("Redirect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
