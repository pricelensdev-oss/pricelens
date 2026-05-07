import { NextResponse } from "next/server"
import { runMarketAudit } from "@/lib/scheduler"

/**
 * PriceLens Cron Endpoint
 * This endpoint can be triggered by external CRON services (Vercel Cron, GitHub Actions)
 * to perform periodic market audits.
 * 
 * SECURITY: In production, this should be protected by an API_KEY or CRON_SECRET header.
 */
export async function GET(request: Request) {
  // Check for authorization (Optional: add CRON_SECRET check here)
  const authHeader = request.headers.get('authorization')
  
  // For demo/dev, we allow manual triggers. In production, uncomment the check below.
  /*
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  */

  const result = await runMarketAudit()

  if (result.success) {
    return NextResponse.json({
      message: "Market audit completed successfully",
      stats: result
    })
  } else {
    return NextResponse.json({
      message: "Market audit failed",
      error: result.error
    }, { status: 500 })
  }
}
