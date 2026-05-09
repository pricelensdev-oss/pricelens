import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await db.notification.findMany({
      where: { user: { clerkId: userId } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("[API_NOTIFICATIONS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, action } = await request.json();
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (action === "markAsRead") {
      await db.notification.update({
        where: { id },
        data: { read: true }
      });
    } else if (action === "markAllAsRead") {
      await db.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API_NOTIFICATIONS_POST_ERROR]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
