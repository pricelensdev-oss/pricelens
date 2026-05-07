import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDbUserId } from "@/lib/auth";

// GET /api/alerts - Returns the user's active price alerts (mapped from Watchlist)
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const dbUserId = await getDbUserId();
    if (!dbUserId) return NextResponse.json({});

    const alerts = await db.watchlist.findMany({
      where: { userId: dbUserId },
    });

    // Format as { [productId]: targetPrice }
    const alertMap = alerts.reduce((acc, alert) => {
      if (alert.targetPrice) {
        acc[alert.productId] = alert.targetPrice;
      }
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(alertMap);
  } catch (error) {
    console.error("[ALERTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/alerts - Creates or removes a price alert (mapped to Watchlist)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const dbUserId = await getDbUserId();
    if (!dbUserId) return new NextResponse("User not synced", { status: 400 });

    const { productId, targetPrice, action } = await req.json();

    if (!productId) return new NextResponse("Product ID required", { status: 400 });

    if (action === "set") {
      if (!targetPrice) return new NextResponse("Target price required", { status: 400 });

      await db.watchlist.upsert({
        where: {
          userId_productId: {
            userId: dbUserId,
            productId: productId,
          },
        },
        create: {
          userId: dbUserId,
          productId: productId,
          targetPrice: Number(targetPrice),
        },
        update: {
          targetPrice: Number(targetPrice),
        },
      });
    } else if (action === "remove") {
      try {
        await db.watchlist.delete({
          where: {
            userId_productId: {
              userId: dbUserId,
              productId: productId,
            },
          }
        });
      } catch (e) {
        // Ignore error if it doesn't exist
      }
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[ALERTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
