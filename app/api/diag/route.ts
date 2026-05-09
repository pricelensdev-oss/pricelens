import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      has_database_url: !!process.env.DATABASE_URL,
      has_clerk_pub_key: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      has_clerk_secret: !!process.env.CLERK_SECRET_KEY,
      node_env: process.env.NODE_ENV,
    },
    database: {
      status: 'Unknown',
      error: null,
    }
  };

  try {
    // Attempt a simple query
    await db.$queryRaw`SELECT 1`;
    diagnostics.database.status = 'Connected';
  } catch (error: any) {
    diagnostics.database.status = 'Failed';
    diagnostics.database.error = error.message;
  }

  return NextResponse.json(diagnostics);
}
