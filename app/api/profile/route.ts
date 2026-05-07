import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { syncUser } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ensure user is synced
  const user = await syncUser();

  return NextResponse.json({
    pincode: user.pincode,
    isBusinessUser: user.isBusinessUser,
    walletBalance: user.walletBalance,
    exchangePref: user.exchangePref
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  
  const updatedUser = await db.user.update({
    where: { clerkId: userId },
    data: {
      pincode: body.pincode,
      isBusinessUser: body.isBusinessUser,
      exchangePref: body.exchangePref,
      walletBalance: body.walletBalance
    }
  });

  return NextResponse.json({ success: true, profile: updatedUser });
}
