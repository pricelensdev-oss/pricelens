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
      const alerts = await db.alert.findMany({
        where: {
          productId: product.id,
          isActive: true,
          targetPrice: {
            gte: productBestPrice
          }
        },
        include: {
          user: true
        }
      })

      for (const alert of alerts) {
        if (alert.user.email) {
          const emailResult = await sendPriceAlertEmail(
            alert.user.email,
            product.name,
            alert.targetPrice,
            productBestPrice,
            `https://pricelens.app/product/${product.id}`,
            product.image
          )

          // Mark alert as completed
          await db.alert.update({
            where: { id: alert.id },
            data: { isActive: false }
          })

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
        successful: trackResults.filter(r => r.success).length
      },
      alertsTriggered: alertResults
    })

  } catch (error) {
    console.error("[Cron Error]:", error)
    return NextResponse.json({ error: "Tracking cycle failed" }, { status: 500 })
  }
}
