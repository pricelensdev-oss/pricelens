import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idsString = searchParams.get("ids")
    
    if (!idsString) {
      return NextResponse.json([])
    }

    const ids = idsString.split(",")

    const products = await db.product.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        image: true,
        currentBestPrice: true,
        brand: true,
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("[PRODUCTS_BULK_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
