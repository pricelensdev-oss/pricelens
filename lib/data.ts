import { db } from "./db"
import { analyzePriceSignals } from "./decision-engine"
import type { Product, SearchResult, DecisionType, VerificationState } from "./types"

/**
 * Computes a deterministic deal score 0-100 from product data.
 * Formula: 60% weight on discount depth, 40% on AI confidence.
 */
function computeDealScore(currentBestPrice: number, originalPrice: number, confidence: number): number {
  const discount = Math.max(0, Math.min(100, ((originalPrice - currentBestPrice) / originalPrice) * 100))
  const score = Math.round(discount * 0.6 + confidence * 0.4)
  return Math.max(10, Math.min(99, score))
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products = await db.product.findMany({
    where: { id: { in: ids } },
    include: {
      platforms: true,
      oracleSnapshots: true,
    },
  })

  return products.map((product: any) => {
    const dynamicSignal = analyzePriceSignals(
      product.snapshots as any,
      product.currentBestPrice,
      product.name
    )

    let parsedSpecs = {};
    try {
      parsedSpecs = typeof product.specifications === "string" 
        ? JSON.parse(product.specifications || "{}") 
        : (product.specifications || {});
    } catch (e) {
      console.error("[ERROR]: Failed to parse specifications for product", product.id, e);
    }

    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      image: product.image,
      description: product.description,
      specifications: parsedSpecs,
      platforms: product.platforms.map((p: any) => ({
        id: p.id,
        platformId: p.platformId,
        name: p.name,
        logo: p.logo,
        price: p.price,
        originalPrice: p.originalPrice,
        effectivePrice: p.effectivePrice,
        url: p.url,
        inStock: p.inStock,
        bankOffers: p.bankOffers ? JSON.parse(p.bankOffers) : undefined,
      })),
      priceHistory: product.snapshots.map((s: any) => ({
        date: s.timestamp.toISOString(),
        price: s.price,
        platform: s.platform,
        sellerName: s.sellerName || undefined,
        stockStatus: s.stockStatus || undefined,
        imageHash: s.imageHash || undefined,
      })),
      verificationState: product.verificationState as any,
      driftAlert: product.driftAlert,
      decision: dynamicSignal,
      isShieldProtected: dynamicSignal.isShieldProtected,
      trend: product.trend as "up" | "down" | "stable",
      lowestPrice: product.lowestPrice ?? product.currentBestPrice,
      highestPrice: product.highestPrice ?? product.currentBestPrice,
      averagePrice: product.averagePrice ?? product.currentBestPrice,
      currentBestPrice: product.currentBestPrice,
      currentBestPlatform: product.currentBestPlatform,
    }
  })
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        platforms: true,
        snapshots: true,
      },
    })

    if (!product) return undefined

    const dynamicSignal = analyzePriceSignals(
      (product.snapshots || []) as any,
      product.currentBestPrice,
      product.name
    )

    let parsedSpecs = {};
    try {
      parsedSpecs = typeof product.specifications === "string" 
        ? JSON.parse(product.specifications || "{}") 
        : (product.specifications || {});
    } catch (e) {
      console.error("[ERROR]: Failed to parse specifications for product", id, e);
    }

    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      image: product.image,
      description: product.description || "",
      specifications: parsedSpecs,
      platforms: (product.platforms || []).map((p: any) => {
        let bankOffers = [];
        try {
          bankOffers = p.bankOffers ? JSON.parse(p.bankOffers) : [];
        } catch (e) {
          console.error("[ERROR]: Failed to parse bankOffers", p.id);
        }
        return {
          id: p.id,
          platformId: p.platformId,
          name: p.name,
          logo: p.logo,
          price: p.price,
          originalPrice: p.originalPrice,
          effectivePrice: p.effectivePrice,
          url: p.url,
          inStock: p.inStock,
          bankOffers,
        }
      }),
      priceHistory: (product.snapshots || []).map((s: any) => ({
        date: s.timestamp?.toISOString() || new Date().toISOString(),
        price: s.price,
        platform: s.platform,
        sellerName: s.sellerName || undefined,
        stockStatus: s.stockStatus || undefined,
        imageHash: s.imageHash || undefined,
      })),
      decision: dynamicSignal,
      verificationState: (product.verificationState as any) || "UNVERIFIED",
      driftAlert: product.driftAlert || false,
      isShieldProtected: dynamicSignal.isShieldProtected,
      trend: (product.trend as any) || "stable",
      lowestPrice: product.lowestPrice ?? product.currentBestPrice,
      highestPrice: product.highestPrice ?? product.currentBestPrice,
      averagePrice: product.averagePrice ?? product.currentBestPrice,
      currentBestPrice: product.currentBestPrice,
      currentBestPlatform: product.currentBestPlatform || "Unknown",
    }
  } catch (error) {
    console.error("[CRITICAL ERROR]: getProductById failed", id, error);
    return undefined;
  }
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const lowerQuery = query.toLowerCase()
  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: lowerQuery } },
        { brand: { contains: lowerQuery } },
        { category: { contains: lowerQuery } },
      ],
    },
    include: {
      platforms: true,
      snapshots: true,
    },
  })

  return products.map((p: any) => {
    const dynamicSignal = analyzePriceSignals(
      p.snapshots as any,
      p.currentBestPrice,
      p.name
    )

    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      image: p.image,
      currentBestPrice: p.currentBestPrice,
      originalPrice: p.platforms[0]?.originalPrice || p.currentBestPrice,
      ...dynamicSignal,
      trend: p.trend as "up" | "down" | "stable",
      platforms: p.platforms.map((pl: any) => ({
        platformId: pl.platformId,
        name: pl.name,
        price: pl.price,
        originalPrice: pl.originalPrice,
        bankOffers: pl.bankOffers ? JSON.parse(pl.bankOffers) : undefined,
      })),
      dealScore: computeDealScore(p.currentBestPrice, p.platforms[0]?.originalPrice || p.currentBestPrice, dynamicSignal.confidence),
      verificationState: p.verificationState as VerificationState,
      driftAlert: p.driftAlert,
    }
  })
}

export async function getAllProducts(): Promise<SearchResult[]> {
  try {
    const products = await db.product.findMany({
      include: {
        platforms: true,
        snapshots: true,
      },
    })

    return products.map((p: any) => {
      try {
        const dynamicSignal = analyzePriceSignals(
          (p.snapshots || []) as any,
          p.currentBestPrice,
          p.name
        )

        return {
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          image: p.image,
          currentBestPrice: p.currentBestPrice,
          originalPrice: p.platforms?.[0]?.originalPrice || p.currentBestPrice,
          ...dynamicSignal,
          trend: (p.trend as any) || "stable",
          platforms: (p.platforms || []).map((pl: any) => {
            let bankOffers = [];
            try {
              bankOffers = pl.bankOffers ? JSON.parse(pl.bankOffers) : [];
            } catch (e) {
              console.error("[ERROR]: Failed to parse bankOffers in search", pl.id);
            }
            return {
              platformId: pl.platformId,
              name: pl.name,
              price: pl.price,
              originalPrice: pl.originalPrice,
              bankOffers,
            };
          }),
          dealScore: computeDealScore(p.currentBestPrice, p.platforms?.[0]?.originalPrice || p.currentBestPrice, dynamicSignal.confidence),
          verificationState: (p.verificationState as any) || "UNVERIFIED",
          driftAlert: p.driftAlert || false,
        }
      } catch (innerError) {
        console.error("[ERROR]: Failed to map product", p.id, innerError);
        return null;
      }
    }).filter((p): p is SearchResult => p !== null)
  } catch (error) {
    console.error("[CRITICAL ERROR]: getAllProducts failed", error);
    return [];
  }
}

export async function getBrands(): Promise<{ name: string; count: number }[]> {
  const products = await db.product.findMany({
    select: { brand: true },
  })

  const brandCounts: Record<string, number> = {}
  products.forEach((p: any) => {
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1
  })

  return Object.entries(brandCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getCategoryStats(): Promise<{ name: string; count: number }[]> {
  const products = await db.product.findMany({
    select: { category: true },
  })

  const categoryCounts: Record<string, number> = {}
  products.forEach((p: any) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1
  })

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export const trendingSearches = [
  "iPhone 15",
  "Samsung S24",
  "MacBook Air",
  "Sony Headphones",
  "PS5",
  "OLED TV",
]

export const categories = [
  { name: "Smartphones", count: 4 },
  { name: "Laptops", count: 2 },
  { name: "TVs", count: 2 },
  { name: "Audio", count: 3 },
  { name: "Gaming", count: 2 },
  { name: "Cameras", count: 2 },
]
