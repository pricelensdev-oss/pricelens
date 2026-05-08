import { createHash } from 'crypto';

/**
 * PriceLens Elite Fingerprinting Engine (V5)
 * Noise-cancelled canonical identity for marketplace products.
 */

const STOP_WORDS = new Set([
  'buy', 'online', 'best', 'price', 'india', 'flipkart', 'amazon', 
  'guaranteed', 'free', 'shipping', 'deal', 'offer', 'low', 'at', 'with'
]);

export interface FingerprintSource {
  brand: string;
  name: string;
  variant?: Record<string, any>;
  specs?: Record<string, any>;
}

export function generateProductFingerprint(source: FingerprintSource): string {
  // 1. Normalize Brand
  const brand = source.brand.toLowerCase().trim();

  // 2. Canonical Title Normalization (The Noise-Cancellation Layer)
  const normalizedName = normalizeTitle(source.name);
  
  // 3. Normalized Variant String
  const variantStr = source.variant 
    ? Object.entries(source.variant)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k.toLowerCase()}:${normalizeValue(String(v))}`)
        .join('|')
    : '';

  // 4. Combined Identity String
  const canonicalString = `v2|${brand}|${normalizedName}|${variantStr}`;

  // 5. SHA-256 Hash
  return createHash('sha256').update(canonicalString).digest('hex');
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Replace punctuation with space
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word))
    .map(word => normalizeValue(word))
    .sort() // Sort words alphabetically to handle title permutations
    .join(' ')
    .trim();
}

function normalizeValue(val: string): string {
  return val
    .toLowerCase()
    .replace(/\s+/g, '') // Remove all whitespace in technical values
    .replace(/gb$/i, 'gb')
    .replace(/tb$/i, 'tb')
    .replace(/ram$/i, 'ram')
    .trim();
}
