import { z } from 'zod';

/**
 * PriceLens Canonical Product Schema
 * The internal source of truth for all marketplace data.
 */

export const CanonicalProductSchema = z.object({
  title: z.string().min(1),
  brand: z.string(),
  category: z.string().optional(),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional(),
  currency: z.string().default('INR'),
  availability: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'UNKNOWN']).default('UNKNOWN'),
  images: z.array(z.string().url()),
  seller: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().nonnegative().optional(),
  variant: z.record(z.any()).optional(),
  specifications: z.record(z.any()).optional(),
  metadata: z.object({
    pid: z.string().optional(),
    lid: z.string().optional(),
    asin: z.string().optional(),
    category: z.string().optional()
  }).optional()
});

export type CanonicalProduct = z.infer<typeof CanonicalProductSchema>;

/**
 * Normalizes and validates raw scraped data.
 */
export function normalizeProduct(raw: any): CanonicalProduct {
  // Add normalization logic here (e.g. currency cleanup, image deduplication)
  const normalized = {
    ...raw,
    images: Array.from(new Set(raw.images)).filter(Boolean), // Deduplicate and clean
  };

  return CanonicalProductSchema.parse(normalized);
}
