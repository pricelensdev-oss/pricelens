import { db } from "@/lib/db"
import { supabaseAdmin } from "@/lib/supabase"

/**
 * PriceLens Intelligence Scheduler
 * This service orchestrates the periodic auditing of all tracked products.
 * It identifies products in the Watchlist and ProtectedPurchases and 
 * triggers the Stealth Scraper Edge Function for real-time market data.
 */
export async function runMarketAudit() {
  console.log("Initializing Market Audit...")

  try {
    // 1. Fetch all unique products that are currently being tracked
    // We prioritize products with active Shield protection
    const productsToAudit = await db.product.findMany({
      where: {
        OR: [
          { watchlistedBy: { some: {} } },
          { protectedPurchases: { some: { shieldStatus: "active" } } }
        ]
      },
      include: {
        platforms: true
      }
    })

    console.log(`Found ${productsToAudit.length} products requiring audit.`)

    for (const product of productsToAudit) {
      for (const platform of product.platforms) {
        console.log(`Triggering stealth scraper for: ${product.name} on ${platform.name}`)

        // Trigger the Supabase Edge Function
        // In a production environment, this call is asynchronous and fire-and-forget
        const { data, error } = await supabaseAdmin.functions.invoke('scraper', {
          body: {
            productId: product.id,
            url: platform.url,
            platform: platform.platformId
          }
        })

        if (error) {
          console.error(`Failed to audit ${product.name}:`, error)
        } else {
          console.log(`Audit successful for ${product.name}. Current Market Price: ₹${data.price}`)
        }
      }
    }

    return { success: true, auditedCount: productsToAudit.length }
  } catch (error) {
    console.error("Critical error during market audit:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
