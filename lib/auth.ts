import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

/**
 * Syncs the currently authenticated Clerk user with our local database.
 * Returns the database user record.
 */
export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  // Check if user exists in our DB
  const existingUser = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) return existingUser;

  // Create user in our DB
  const newUser = await db.user.create({
    data: {
      clerkId: userId,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
}

/**
 * Gets the current database user ID based on the authenticated Clerk session.
 */
export async function getDbUserId() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  return user?.id || null;
}
