import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: {
      walletBalance: true,
      isBusinessUser: true,
      pincode: true,
      exchangePref: true
    }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}
