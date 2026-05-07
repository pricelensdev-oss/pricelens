import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { resend } from "@/lib/resend"
import { PriceAlertEmail } from "@/components/emails/price-alert"

export async function POST(req: Request) {
  try {
    // 1. Get all active alerts that haven't been notified recently (e.g., in the last 24h)
    const activeAlerts = await db.alert.findMany({
      where: {
        isActive: true,
        emailEnabled: true,
        OR: [
          { lastNotifiedAt: null },
          { lastNotifiedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        ]
      },
      include: {
        product: true,
        user: true,
      }
    })

    const notificationsSent = []

    for (const alert of activeAlerts) {
      const { product, user, targetPrice } = alert
      
      // 2. Check if current price meets target
      if (product.currentBestPrice <= targetPrice) {
        console.log(`🔔 Alert Triggered for ${user.email}: ${product.name} @ ₹${product.currentBestPrice}`)

        // 3. Send Email via Resend
        if (resend) {
          try {
            await resend.emails.send({
              from: 'PriceLens <alerts@pricelens.ai>', // This would need domain verification
              to: [user.email],
              subject: `Price Drop Alert: ${product.name}`,
              react: PriceAlertEmail({
                productName: product.name,
                currentPrice: product.currentBestPrice,
                targetPrice: targetPrice,
                productImage: product.image,
                productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}`,
              }),
            })

            // 4. Update Alert Status
            await db.alert.update({
              where: { id: alert.id },
              data: { lastNotifiedAt: new Date() }
            })

            notificationsSent.push({ email: user.email, product: product.name })
          } catch (emailError) {
            console.error(`Failed to send email to ${user.email}:`, emailError)
          }
        } else {
          console.warn("Resend client not initialized. Skipping email.")
          // Still update notifiedAt to avoid re-processing in this run if we're simulating
          await db.alert.update({
            where: { id: alert.id },
            data: { lastNotifiedAt: new Date() }
          })
          notificationsSent.push({ email: user.email, product: product.name, status: "simulated" })
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: activeAlerts.length, 
      notified: notificationsSent 
    })
  } catch (error) {
    console.error("[ALERTS_PROCESS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
