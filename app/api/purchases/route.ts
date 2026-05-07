import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const purchases = await db.protectedPurchase.findMany({
    where: { user: { clerkId: userId } },
    include: { product: true }
  });

  return NextResponse.json(purchases.map((p: any) => ({
    ...p,
    ...p.product,
    id: p.productId // For client compatibility
  })));
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { action, item, id } = body;

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "add") {
    await db.protectedPurchase.upsert({
      where: { id: id || "new-purchase" }, // Simplified for mock transition
      create: {
        userId: user.id,
        productId: item.id,
        purchasePrice: item.purchasePrice,
        platformId: item.platform,
        shieldStatus: "active"
      },
      update: {
        purchasePrice: item.purchasePrice,
        shieldStatus: "active"
      }
    });
  } else if (action === "remove") {
    await db.protectedPurchase.deleteMany({
      where: { userId: user.id, productId: id }
    });
  } else if (action === "claim") {
    await db.protectedPurchase.updateMany({
      where: { userId: user.id, productId: id },
      data: { shieldStatus: "claimed" }
    });
  }

  return NextResponse.json({ success: true });
}
