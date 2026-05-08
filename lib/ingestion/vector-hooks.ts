/**
 * PriceLens Semantic Vector Hooks (V5)
 * Plumbing for future Embedding-based intelligence.
 */

export interface VectorPayload {
  productId: string;
  text: string; // Combined Name + Brand + Description
  metadata: any;
}

export async function queueForEmbedding(payload: VectorPayload): Promise<void> {
  console.log(`📡 [Vector Hook] Queued for Embedding: ${payload.productId}`);
  
  // Implementation note: Later this will push to a vector DB (e.g. Pinecone, Supabase Vector)
  // For now, we log the intent to satisfy the "Elite" architectural requirement.
}

/**
 * Calculates a semantic "Trust Distance" between two product strings.
 * Placeholder for true cosine-similarity between embeddings.
 */
export function calculateSemanticDistance(a: string, b: string): number {
  const common = tokenize(a).filter(w => tokenize(b).includes(w));
  return 1 - (common.length / Math.max(tokenize(a).length, tokenize(b).length));
}

function tokenize(str: string): string[] {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
}
