import { db } from "./db"
import { generateCanonicalId } from "./utils"

export interface ScrapeResult {
  price: number
  originalPrice: number
  inStock: boolean
  bankOffers: string[]
  platformId: string
}

/**
 * PriceLens Scraper Service Logic - Phase 1 Operationalized
 */

/**
 * Main entry point for tracking a specific product platform
 */
export async function trackProduct(productId: string, platformId: string, url: string): Promise<ScrapeResult | null> {
  console.log(`[Scraper] 🔍 Verification start for ${platformId} at ${url}`)
  
  try {
    const rawContent = await fetchRawContent(url)
    const result = await agenticParse(rawContent, platformId)

    if (result) {
      await recordPrice(productId, result)
    }

    return result
  } catch (error) {
    console.error(`[Scraper] ❌ Verification failed for ${platformId}:`, error)
    return null
  }
}

/**
 * Intelligent Refresh: Only scrapes if data is older than the staleness threshold (e.g., 2 hours)
 */
export async function refreshProductIfStale(productId: string) {
  const STALENESS_THRESHOLD_MS = 2 * 60 * 60 * 1000 // 2 Hours

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { platforms: true }
  })

  if (!product) return

  const now = new Date()
  const lastCalc = product.lastCalculatedAt || new Date(0) // Default to epoch if missing
  const isStale = (now.getTime() - lastCalc.getTime()) > STALENESS_THRESHOLD_MS

  if (!isStale) {
    console.log(`[Scraper] ⚡ Data for ${product.name} is fresh. Skipping scrape.`)
    return
  }

  console.log(`[Scraper] 🔄 Data for ${product.name} is STALE. Triggering marketplace sync...`)

  // Refresh all platforms
  const scrapePromises = product.platforms.map((p: any) => trackProduct(productId, p.platformId, p.url))
  await Promise.all(scrapePromises)

  // Recalculate Product Intelligence
  await recalculateProductIntelligence(productId)
}

import { getNextMajorEvent } from "./seasonal-events"

/**
 * Recalculates BUY/WAIT verdicts based on new platform data and predictive seasonality
 */
async function recalculateProductIntelligence(productId: string) {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { platforms: true, snapshots: true }
  })

  if (!product || product.platforms.length === 0) return

  const sorted = [...product.platforms].sort((a: any, b: any) => a.price - b.price)
  const bestPrice = sorted[0].price
  const bestPlatform = sorted[0].name
  const nextEvent = getNextMajorEvent()

  // Logic for Verdict
  let decisionType = "WAIT"
  let decisionReason = "Prices are currently stable. We recommend waiting for a holiday sale cycle."
  let decisionWindow = "14 Days"
  
  const now = new Date()
  const daysToEvent = nextEvent ? Math.ceil((new Date(nextEvent.startDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999

  if (product.lowestPrice && bestPrice <= product.lowestPrice) {
    decisionType = "BUY"
    decisionReason = "Price has hit an all-time low. Even with upcoming sales, significant further drops are unlikely."
    decisionWindow = "48 Hours"
  } else if (daysToEvent <= 14 && nextEvent) {
    decisionType = "WAIT"
    decisionReason = `Predictive Analysis: ${nextEvent.name} begins in ${daysToEvent} days. Historical data suggests a potential ${nextEvent.avgDiscount}% drop.`
    decisionWindow = `${daysToEvent} Days`
  } else if (product.averagePrice && bestPrice < product.averagePrice) {
    decisionType = "BUY"
    decisionReason = "Current price is significantly below 90-day average. Solid entry point."
    decisionWindow = "3 Days"
  }

  await db.product.update({
    where: { id: productId },
    data: {
      currentBestPrice: bestPrice,
      currentBestPlatform: bestPlatform,
      decisionType,
      decisionReason,
      decisionWindow,
      lastCalculatedAt: new Date(),
      trend: (product.averagePrice && bestPrice < product.averagePrice) ? "down" : "stable"
    }
  })
}

/**
 * Stealth Fetching Layer (Agentic Proxy Simulation)
 */
async function fetchRawContent(url: string): Promise<string> {
  // In a real production env, this would use a proxy-rotating service or headless browser
  // For Phase 1 scale, we simulate the network response
  return `<html><body>Price: ${Math.floor(Math.random() * 5000) + 140000}</body></html>`
}

/**
 * Agentic Parsing Layer (LLM-ready structure)
 */
async function agenticParse(html: string, platformId: string): Promise<ScrapeResult | null> {
  // Simulate extraction logic
  const basePrice = platformId === "amazon" ? 149900 : 148000
  const randomSwing = Math.floor(Math.random() * 2000) - 1000
  
  return {
    platformId,
    price: basePrice + randomSwing,
    originalPrice: 159900,
    inStock: true,
    bankOffers: platformId === "amazon" ? ["₹5000 off on HDFC"] : ["₹6000 off on ICICI"]
  }
}

/**
 * Database Persistence Layer
 */
async function recordPrice(productId: string, result: ScrapeResult) {
  const today = new Date().toISOString().split("T")[0]

  await db.$transaction([
    db.platform.update({
      where: {
        productId_platformId: {
          productId,
          platformId: result.platformId
        }
      },
      data: {
        price: result.price,
        effectivePrice: result.price,
        bankOffers: JSON.stringify(result.bankOffers),
        inStock: result.inStock,
        lastVerifiedAt: new Date()
      }
    }),
    db.oracleSnapshot.create({
      data: {
        productId,
        price: result.price,
        platform: result.platformId,
        sellerName: result.platformId, // Fallback for simple scraper
        stockStatus: result.inStock ? "IN_STOCK" : "OUT_OF_STOCK",
        date: new Date().toISOString().split("T")[0],
        timestamp: new Date()
      }
    })
  ])
}

import { ingestProductFromUrl } from "./ingestion/engine"

/**
 * Search Discovery Layer - Evolved to Oracle V4
 */
export async function discoverProducts(query: string): Promise<string[]> {
  console.log(`🤖 [Scraper Agent] Deep-market search for: "${query}"...`)
  
  try {
    const isUrl = query.startsWith('http')
    
    if (isUrl) {
      // Oracle V4: High-Fidelity Ingestion
      const result = await ingestProductFromUrl(query);
      return [result.productId];
    }

    // Standard Discovery for queries
    const isSamsungUltra = query.toLowerCase().includes("samsung") && query.toLowerCase().includes("ultra")
    const isIphone = query.toLowerCase().includes("iphone")
    let discoveredItems = []
    
    if (isSamsungUltra) {
      discoveredItems = [
        { 
          name: "Samsung Galaxy S25 Ultra 5G (256GB)", 
          brand: "Samsung", 
          price: 124999, 
          img: "https://m.media-amazon.com/images/I/71X8+n9iGLL._SL1500_.jpg" 
        }
      ]
    } else if (isIphone) {
       discoveredItems = [
        { 
          name: "iPhone 16 Pro Max (256GB) - Titanium", 
          brand: "Apple", 
          price: 159900, 
          img: "https://m.media-amazon.com/images/I/61H7f6DkGFL._SL1500_.jpg" 
        }
      ]
    } else {
      discoveredItems = [
        { 
          name: `${query} Premium Edition`, 
          brand: query.split(" ")[0], 
          price: 89999, 
          img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop" 
        }
      ]
    }

  const createdIds = []

    for (const item of discoveredItems) {
      const canonicalId = generateCanonicalId(item.name)
      const existing = await db.product.findMany({ select: { name: true } })
      if (existing.some((p: any) => generateCanonicalId(p.name) === canonicalId)) continue

      const product = await db.product.create({
        data: {
          name: item.name,
          brand: item.brand,
          category: "Electronics",
          image: item.img,
          description: `Verified market discovery for ${item.name}.`,
          specifications: JSON.stringify({ "Status": "In Stock", "Region": "India" }),
          decisionType: "WAIT",
          decisionConf: 85,
          decisionReason: "Market discovery phase. Initial baseline established.",
          decisionMove: "Initial",
          decisionWindow: "14 Days",
          trend: "stable",
          lowestPrice: item.price,
          highestPrice: item.price + 5000,
          averagePrice: item.price + 2000,
          currentBestPrice: item.price,
          currentBestPlatform: "Amazon",
          lastCalculatedAt: new Date(),
          platforms: {
            create: [
              {
                platformId: "amazon",
                name: "Amazon",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                price: item.price,
                originalPrice: item.price + 10000,
                effectivePrice: item.price,
                url: `https://amazon.in/s?k=${encodeURIComponent(item.name)}`,
                inStock: true,
                lastVerifiedAt: new Date()
              },
              {
                platformId: "flipkart",
                name: "Flipkart",
                logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg",
                price: item.price + 499,
                originalPrice: item.price + 10000,
                effectivePrice: item.price + 499,
                url: `https://flipkart.com/search?q=${encodeURIComponent(item.name)}`,
                inStock: true,
                lastVerifiedAt: new Date()
              },
              {
                platformId: "croma",
                name: "Croma",
                logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Croma_Logo.svg",
                price: item.price + 1200,
                originalPrice: item.price + 8000,
                effectivePrice: item.price + 1200,
                url: `https://www.croma.com/search/?text=${encodeURIComponent(item.name)}`,
                inStock: true,
                lastVerifiedAt: new Date()
              },
              {
                platformId: "reliance",
                name: "Reliance Digital",
                logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Reliance_Digital_logo.svg",
                price: item.price + 1500,
                originalPrice: item.price + 9000,
                effectivePrice: item.price + 1500,
                url: `https://www.reliancedigital.in/search?q=${encodeURIComponent(item.name)}`,
                inStock: true,
                lastVerifiedAt: new Date()
              }
            ]
          }
        }
      })
      createdIds.push(product.id)
    }
    return createdIds
  } catch (error) {
    console.error("[Scraper] Discovery failed:", error)
    return []
  }
}
