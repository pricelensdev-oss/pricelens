import { VerificationState } from '../types';
import { parseMarketplaceUrl } from '../urls';
import { generateProductFingerprint } from './fingerprint';
import { normalizeProduct, CanonicalProduct } from '../normalization';
import { scrapeFlipkart } from '../scrapers/flipkart';
import { scrapeLightweight } from '../scrapers/lightweight';
import { validateProductSemantics } from './semantic';
import { detectListingDrift } from './drift';
import { arbitratePriceTruth } from './arbitration';
import { queueForEmbedding } from './vector-hooks';
import { db } from '../db';

/**
 * PriceLens Ingestion Engine v4
 * The Brain of the Trust Pipeline.
 */

export interface IngestionResult {
  productId: string;
  confidence: number;
  state: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'LOW_CONFIDENCE' | 'FAILED';
  product: CanonicalProduct;
}

export async function ingestProductFromUrl(url: string): Promise<IngestionResult> {
  console.log(`🚀 [Ingestion Oracle] Starting Deep Scan for: ${url}`);
  
  // 1. URL Identity Resolution
  const identity = parseMarketplaceUrl(url);
  
  // 2. Hybrid Extraction Strategy
  let scrapedData: Partial<CanonicalProduct> = {};
  try {
    // Stage 1: Try lightweight fetch-based scraping first (Vercel compatible)
    console.log(`[Ingestion] Attempting Stage 1 Lightweight Scrape...`);
    scrapedData = await scrapeLightweight(url);
    
    // If we got good data, we can skip Stage 2 (Playwright)
    if (scrapedData.title && scrapedData.price && scrapedData.price > 0) {
      console.log(`[Ingestion] ✅ Stage 1 Success: ${scrapedData.title}`);
    } else {
      // Stage 2: Attempt high-fidelity browser scraping
      console.log(`[Ingestion] Stage 1 incomplete. Attempting Stage 2 Browser Scrape...`);
      const stage2Data = await scrapeFlipkart(url);
      scrapedData = { ...scrapedData, ...stage2Data };
    }
  } catch (error) {
    console.warn(`[Ingestion] Scraper chain failed. Attempting Stage 2 fallback...`, error);
    try {
      const stage2Data = await scrapeFlipkart(url);
      scrapedData = { ...scrapedData, ...stage2Data };
    } catch (stage2Error) {
      console.error(`[CRITICAL]: Scraper chain failed completely for ${url}.`, stage2Error);
      // Fallback: Use basic data from URL or empty
      scrapedData = {
        title: "Market Discovery In-Progress",
        brand: "Unknown",
        price: 0,
        images: [],
        description: "Live analysis is currently limited in this environment. Please try again later or search by name."
      };
    }
  }
  
  // 3. Normalization & Schema Validation
  const canonical = normalizeProduct(scrapedData);
  
  // 4. Identity Continuity Check (Fingerprint & Drift)
  const fingerprint = generateProductFingerprint({
    brand: canonical.brand,
    name: canonical.title,
    variant: canonical.variant,
    specs: canonical.specifications
  });

  const existingProduct = await db.product.findUnique({
    where: { fingerprintHash: fingerprint },
    include: { oracleSnapshots: true }
  });

  let driftAlert = false;
  if (existingProduct && existingProduct.oracleSnapshots.length > 0) {
    const drift = detectListingDrift(canonical.title, existingProduct.name);
    driftAlert = drift.isHijacked;
  }

  // 5. Semantic Integrity Check
  const semantic = validateProductSemantics({
    title: canonical.title,
    brand: canonical.brand,
    variant: canonical.variant,
    category: canonical.category
  });

  // 6. Truth Arbitration (Multi-Signal Resolution)
  // Fetch recent snapshots to resolve truth
  const recentSnapshots = existingProduct?.snapshots || [];
  const arbitratedPrice = arbitratePriceTruth([
    { 
      price: canonical.price, 
      timestamp: new Date(), 
      confidence: 100, // Current scan is highly trusted
      sellerScore: 0.9 
    },
    ...recentSnapshots.map(s => ({
      price: s.price,
      timestamp: s.timestamp,
      confidence: 80, // Historical data is slightly less fresh
      sellerScore: 0.8
    }))
  ]);

  // 7. Multi-Dimensional Confidence Scoring
  const rawConfidence = calculateConfidence(canonical, identity);
  let confidence = Math.max(0, Math.min(100, rawConfidence + semantic.confidenceAdjustment));
  if (driftAlert) confidence = Math.min(confidence, 20); // Slash confidence on drift

  const state = deriveVerificationState(confidence);

  // 6. Persistence & Snapshotting
  const product = await db.product.upsert({
    where: { fingerprintHash: fingerprint },
    update: {
      currentBestPrice: arbitratedPrice,
      verificationState: state,
      confidenceScore: confidence,
      driftAlert: driftAlert,
      lastCalculatedAt: new Date(),
    },
    create: {
      name: canonical.title,
      brand: canonical.brand,
      category: canonical.category || 'General',
      image: canonical.images[0] || '',
      description: canonical.description || '',
      fingerprintHash: fingerprint,
      verificationState: state,
      confidenceScore: confidence,
      driftAlert: driftAlert,
      currentBestPrice: arbitratedPrice,
      currentBestPlatform: identity.platform,
    }
  });

  // 7. Create Historical Snapshot
  await db.oracleSnapshot.create({
    data: {
      productId: product.id,
      price: canonical.price,
      originalPrice: canonical.originalPrice,
      platform: identity.platform,
      sellerName: canonical.seller,
      stockStatus: canonical.availability,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date()
    }
  });

  // 8. Queue for Semantic Embedding (Vector Moat)
  await queueForEmbedding({
    productId: product.id,
    text: `${canonical.brand} ${canonical.title} ${canonical.description}`,
    metadata: {
      category: canonical.category,
      price: canonical.price,
      fingerprint
    }
  });

  return {
    productId: product.id,
    confidence,
    state,
    product: canonical
  };
}

function calculateConfidence(product: CanonicalProduct, identity: any): number {
  let score = 0;
  
  // Weighting Factors
  if (product.metadata?.pid === identity.externalId) score += 40; // Deterministic PID match
  if (product.images.length > 2) score += 20; // Multiple high-res images
  if (product.seller) score += 10; // Seller data extracted
  if (product.rating && product.rating > 0) score += 10; // Rating data extracted
  if (product.brand && product.brand !== 'Market') score += 20; // Brand identified
  
  return score;
}

function deriveVerificationState(confidence: number): VerificationState {
  if (confidence >= 90) return 'VERIFIED';
  if (confidence >= 70) return 'PARTIALLY_VERIFIED';
  return 'LOW_CONFIDENCE';
}
