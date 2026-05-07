import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { trackProduct } from "@/lib/scraper"
import { sendPriceAlertEmail } from "@/lib/mail"

/**
 * PRODUCTION CRON: Real-Time Price Tracking & Alerts
 * This endpoint is triggered by Vercel Cron or a GitHub Action.
 */
export async function GET(request: Request) {
  // Security Check (Optional: API Key or Cron Header)
  // const authHeader = request.headers.get('authorization');
  // if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  try {
    // 1. Fetch all products and their platforms
    const products = await db.product.findMany({
      include: {
        platforms: true,
      },
    })

    const trackResults = []
    const alertResults = []

    // 2. Iterate through each platform and trigger the scraper
    for (const product of products) {
      console.log(`[Cron] Tracking: ${product.name}`)
      
      let productBestPrice = product.currentBestPrice

      for (const platform of product.platforms) {
        const scrapeResult = await trackProduct(
          product.id,
          platform.platformId,
          platform.url
        )
        
        if (scrapeResult && scrapeResult.price < productBestPrice) {
          productBestPrice = scrapeResult.price
        }

        trackResults.push({
          productId: product.id,
          platformId: platform.platformId,
          success: !!scrapeResult,
          newPrice: scrapeResult?.price
        })
      }

      // 3. Trigger Alerts if a new low is reached
      const alerts = await db.watchlist.findMany({
        where: {
          productId: product.id,
          targetPrice: {
            gte: productBestPrice
          }
        },
        include: {
          user: true
        }
      })

      for (const alert of alerts) {
        if (alert.user.email && alert.targetPrice) {
          const emailResult = await sendPriceAlertEmail(
            alert.user.email,
            product.name,
            alert.targetPrice,
            productBestPrice,
            `https://pricelens.app/product/${product.id}`,
            product.image
          )

          // In Watchlist model, we don't necessarily disable it, 
          // but we could set targetPrice to null or similar if we wanted it to be a one-time alert.
          // For now, we'll keep it active so the user continues to track.

          alertResults.push({
            user: alert.user.email,
            product: product.name,
            sent: emailResult.success
          })
        }
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      trackingSummary: {
        totalProcessed: trackResults.length,
        successful: trackResults.filter((r: any) => r.success).length
      },
      alertsTriggered: alertResults
    })

  } catch (error) {
    console.error("[Cron Error]:", error)
    return NextResponse.json({ error: "Tracking cycle failed" }, { status: 500 })
  }
}
