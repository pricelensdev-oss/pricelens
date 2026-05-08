/**
 * PriceLens Drift Detection Engine (V5)
 * Protects against listing hijacks and metadata shifts.
 */

export interface DriftReport {
  isHijacked: boolean;
  driftScore: number; // 0-100 (100 = total change)
  driftReason?: string;
}

export function detectListingDrift(currentTitle: string, baselineTitle: string): DriftReport {
  const currentWords = new Set(tokenize(currentTitle));
  const baselineWords = new Set(tokenize(baselineTitle));
  
  if (baselineWords.size === 0) return { isHijacked: false, driftScore: 0 };

  // Calculate intersection (common words)
  const intersection = new Set([...currentWords].filter(x => baselineWords.has(x)));
  
  // Jaccard-like similarity
  const similarity = (intersection.size / Math.max(currentWords.size, baselineWords.size)) * 100;
  const driftScore = 100 - similarity;

  // ELITE THRESHOLD: > 40% drift in a verified listing is a Hijack attempt
  const isHijacked = driftScore > 40;

  return {
    isHijacked,
    driftScore,
    driftReason: isHijacked 
      ? `Drastic Title Shift: ${Math.round(driftScore)}% divergence from historical baseline.`
      : undefined
  };
}

function tokenize(str: string): string[] {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
}

/**
 * Placeholder for future image similarity drift check.
 */
export function detectImageDrift(currentHash: string, baselineHash: string): boolean {
  if (!baselineHash) return false;
  return currentHash !== baselineHash;
}
