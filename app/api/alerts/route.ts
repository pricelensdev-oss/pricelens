import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDbUserId } from "@/lib/auth";

// GET /api/alerts - Returns the user's active price alerts
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const dbUserId = await getDbUserId();
    if (!dbUserId) return NextResponse.json({});

    const alerts = await db.alert.findMany({
      where: { userId: dbUserId, isActive: true },
    });

    // Format as { [productId]: targetPrice }
    const alertMap = alerts.reduce((acc, alert) => {
      acc[alert.productId] = alert.targetPrice;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(alertMap);
  } catch (error) {
    console.error("[ALERTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/alerts - Creates or removes a price alert
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

      await db.alert.upsert({
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
          isActive: true,
        },
      });
    } else if (action === "remove") {
      await db.alert.updateMany({
        where: {
          userId: dbUserId,
          productId: productId,
        },
        data: { isActive: false },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[ALERTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
