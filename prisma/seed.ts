import { db } from '../lib/db'
import { products } from './mockData'

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await db.notification.deleteMany()
  await db.protectedPurchase.deleteMany()
  await db.watchlist.deleteMany()
  await db.platform.deleteMany()
  await db.productSnapshot.deleteMany()
  await db.product.deleteMany()
  await db.user.deleteMany()

  // Create a Demo User
  const demoUser = await db.user.create({
    data: {
      email: "demo@pricelens.ai",
      clerkId: "user_2demo",
      name: "PriceLens Demo",
      pincode: "400001",
      walletBalance: 1250.00,
      isBusinessUser: true
    }
  })

  for (const product of products) {
    const createdProduct = await db.product.create({
      data: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        image: product.image,
        description: product.description,
        specifications: JSON.stringify(product.specifications),
        
        decisionType: product.decision.type,
        decisionConf: product.decision.confidence,
        decisionReason: product.decision.reasoning,
        decisionMove: product.decision.expectedMovement,
        decisionWindow: product.decision.timeWindow,
        
        trend: product.trend,
        lowestPrice: product.lowestPrice,
        highestPrice: product.highestPrice,
        averagePrice: product.averagePrice,
        currentBestPrice: product.currentBestPrice,
        currentBestPlatform: product.currentBestPlatform,

        platforms: {
          create: product.platforms.map(p => ({
            platformId: p.id,
            name: p.name,
            logo: p.logo,
            price: p.price,
            originalPrice: p.originalPrice,
            effectivePrice: p.effectivePrice,
            url: p.url,
            inStock: p.inStock,
            bankOffers: p.bankOffers ? JSON.stringify(p.bankOffers) : null,
          }))
        },

        snapshots: {
          create: product.priceHistory.map(ph => ({
            timestamp: new Date(ph.date),
            price: ph.price,
            platform: ph.platform,
            sellerName: ph.platform,
            inStock: true
          }))
        }
      }
    })

    // Simulate a protected purchase for the iPhone (ID: 1)
    if (product.id === "1") {
      await db.protectedPurchase.create({
        data: {
          userId: demoUser.id,
          productId: createdProduct.id,
          purchasePrice: 159900,
          platformId: "amazon",
          shieldStatus: "active",
          purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
      })
    }

    console.log(`Created product with id: ${createdProduct.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
