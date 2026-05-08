/**
 * PriceLens Truth Arbitration Layer (V5)
 * Resolves conflicting signals into a single "Arbitrated Truth".
 */

export interface PriceSignal {
  price: number;
  timestamp: Date;
  confidence: number;
  sellerScore: number;
}

export function arbitratePriceTruth(signals: PriceSignal[]): number {
  if (signals.length === 0) return 0;
  if (signals.length === 1) return signals[0].price;

  let totalWeight = 0;
  let weightedPrice = 0;

  const now = new Date().getTime();

  for (const signal of signals) {
    // 1. Recency Weight (linear decay over 24 hours)
    const ageInHours = (now - signal.timestamp.getTime()) / (1000 * 60 * 60);
    const recencyWeight = Math.max(0, 1 - (ageInHours / 24));

    // 2. Total Weight Calculation
    // Confidence (0-100) + Seller Score (0-1) + Recency (0-1)
    const weight = (signal.confidence / 100) * 0.5 + 
                   (signal.sellerScore) * 0.3 + 
                   (recencyWeight) * 0.2;

    weightedPrice += signal.price * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(weightedPrice / totalWeight) : signals[0].price;
}

/**
 * Validates if a new price signal is a "Statistical Outlier" (Anomaly Detection).
 */
export function isPriceAnomaly(newPrice: number, historicalMean: number, volatility: number): boolean {
  if (historicalMean === 0) return false;
  
  const deviation = Math.abs(newPrice - historicalMean) / historicalMean;
  
  // If deviation is > 50% and volatility is low, it's likely an anomaly/error
  return deviation > 0.5 && volatility < 10;
}
