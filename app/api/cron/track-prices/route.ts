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
    const shieldResults = []

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
      });

      for (const alert of alerts) {
        if (alert.user.email && alert.targetPrice) {
          const emailResult = await sendPriceAlertEmail(
            alert.user.email,
            product.name,
            alert.targetPrice,
            productBestPrice,
            `https://pricelens.app/product/${product.id}`,
            product.image
          );

          alertResults.push({
            user: alert.user.email,
            product: product.name,
            sent: emailResult.success
          });
        }
      }

      // 4. Smart Shield Monitoring (Outcome Guarantee)
      const protectedPurchases = await db.protectedPurchase.findMany({
        where: {
          productId: product.id,
          shieldStatus: "active"
        },
        include: { user: true }
      });

      for (const purchase of protectedPurchases) {
        const daysSincePurchase = Math.floor((Date.now() - new Date(purchase.purchaseDate).getTime()) / (1000 * 60 * 60 * 24));
        
        // Window check (7 days)
        if (daysSincePurchase > 7) {
          await db.protectedPurchase.update({
            where: { id: purchase.id },
            data: { shieldStatus: "expired" }
          });
          continue;
        }

        // Drop check
        if (productBestPrice < purchase.purchasePrice) {
          const savings = purchase.purchasePrice - productBestPrice;
          
          // Create In-App Notification
          await db.notification.create({
            data: {
              userId: purchase.userId,
              title: "Price Shield Alert!",
              message: `Price dropped by ₹${savings.toLocaleString()} on ${product.name}. Claim your match now!`,
              type: "price_drop",
              link: "/shield"
            }
          });

          shieldResults.push({
            user: purchase.user.email,
            product: product.name,
            savingsDetected: savings
          });
        }
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      trackingSummary: {
        totalProcessed: trackResults.length,
        successful: trackResults.filter((r: any) => r.success).length
      },
      alertsTriggered: alertResults,
      shieldAlerts: shieldResults
    });

  } catch (error) {
    console.error("[Cron Error]:", error);
    return NextResponse.json({ error: "Tracking cycle failed" }, { status: 500 });
  }
}
