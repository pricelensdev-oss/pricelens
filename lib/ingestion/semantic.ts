/**
 * PriceLens Semantic Validation Layer
 * Cross-checks metadata integrity using semantic rules.
 */

export interface SemanticPayload {
  title: string;
  brand: string;
  variant?: Record<string, any>;
  category?: string;
}

export function validateProductSemantics(payload: SemanticPayload): { 
  isValid: boolean; 
  reason?: string;
  confidenceAdjustment: number;
} {
  const { title, brand, variant, category } = payload;
  const lowerTitle = title.toLowerCase();
  const lowerBrand = brand.toLowerCase();

  // 1. Brand Consistency Check
  if (lowerBrand !== 'flipkart' && lowerBrand !== 'market' && !lowerTitle.includes(lowerBrand)) {
    return { 
      isValid: false, 
      reason: `Brand mismatch: ${brand} not found in title.`,
      confidenceAdjustment: -30 
    };
  }

  // 2. Variant Conflict Detection (e.g. Title says 256GB, Variant says 128GB)
  if (variant?.storage) {
    const storageVal = String(variant.storage).toLowerCase();
    if (!lowerTitle.includes(storageVal)) {
       return { 
        isValid: true, // Allow, but reduce confidence
        reason: `Potential variant mismatch: Storage ${storageVal} not mentioned in title.`,
        confidenceAdjustment: -15 
      };
    }
  }

  // 3. Category Intelligence (Check if title matches category keywords)
  if (category === 'Electronics' && !isElectronic(lowerTitle)) {
    return {
      isValid: true,
      reason: 'Category-Title low correlation.',
      confidenceAdjustment: -10
    };
  }

  return { isValid: true, confidenceAdjustment: 0 };
}

function isElectronic(title: string): boolean {
  const keywords = ['phone', 'laptop', 'camera', 'tv', 'watch', 'buds', 'pro', 'max'];
  return keywords.some(k => title.includes(k));
}

/**
 * Placeholder for future Image Hashing / Similarity check.
 * This will detect if a hero image has been swapped.
 */
export function validateImageContinuity(currentHash: string, historicalHash: string): boolean {
  if (!historicalHash) return true;
  return currentHash === historicalHash;
}
