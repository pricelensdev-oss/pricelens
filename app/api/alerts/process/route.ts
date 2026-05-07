import { NextResponse } from "next/server"

// This route has been deprecated in favor of /api/cron/route.ts
// and the Supabase Edge Scraper. Kept here to prevent 404s on old webhooks.
export async function POST() {
  return NextResponse.json({ 
    success: true, 
    message: "Alert processing is now handled by the cron scheduler." 
  })
}
