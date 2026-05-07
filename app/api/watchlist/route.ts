import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDbUserId } from "@/lib/auth";

// GET /api/watchlist - Returns the user's cloud watchlist
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUserId = await getDbUserId();
    if (!dbUserId) {
      return NextResponse.json([]);
    }

    const watchlist = await db.watchlist.findMany({
      where: { userId: dbUserId },
      select: { productId: true },
    });

    return NextResponse.json(watchlist.map((item: any) => item.productId));
  } catch (error) {
    console.error("[WATCHLIST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/watchlist - Toggles an item in the cloud watchlist
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUserId = await getDbUserId();
    if (!dbUserId) {
      return new NextResponse("User not synced", { status: 400 });
    }

    const { productId, action } = await req.json();

    if (!productId) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    if (action === "add") {
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
        },
        update: {}, // Do nothing if already exists
      });
    } else if (action === "remove") {
      await db.watchlist.deleteMany({
        where: {
          userId: dbUserId,
          productId: productId,
        },
      });
    } else if (action === "sync") {
      // Bulk sync from localStorage (used during migration)
      const { productIds } = await req.json();
      if (Array.isArray(productIds)) {
        for (const id of productIds) {
          await db.watchlist.upsert({
            where: { userId_productId: { userId: dbUserId, productId: id } },
            create: { userId: dbUserId, productId: id },
            update: {},
          });
        }
      }
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[WATCHLIST_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
