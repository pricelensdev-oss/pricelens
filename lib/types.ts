export type DecisionType = "BUY" | "WAIT" | "HOLD" | "AVOID"
export type Decision = DecisionType
export type TrendType = "up" | "down" | "stable"
export type Trend = TrendType

  externalId?: string
  listingId?: string
  name: string
  logo: string
  price: number
  originalPrice: number
  effectivePrice: number
  url: string
  inStock: boolean
  sellerName?: string
  variantInfo?: Record<string, any>
  bankOffers?: string[]
}

export interface PricePoint {
  date: string
  price: number
  platform: string
  sellerName?: string
  stockStatus?: string
  imageHash?: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  image: string
  description: string
  specifications: Record<string, any>
  platforms: Platform[]
  priceHistory: PricePoint[]
  verificationState: "VERIFIED" | "PARTIALLY_VERIFIED" | "LOW_CONFIDENCE" | "FAILED"
  confidenceScore?: number
  decision: {
    type: DecisionType
    confidence: number // 0-100
    score: number // 0-100 unified score
    verdict: string // "STRONG BUY", etc.
    reasoning: string
    expectedMovement: string
    timeWindow: string
    isFakeSale: boolean
    fairValue: number
    overpriceAmount: number
  }
  isShieldProtected: boolean
  shieldReasoning?: string
  trend: TrendType
  lowestPrice: number
  highestPrice: number
  averagePrice: number
  currentBestPrice: number
  currentBestPlatform: string
}

export interface SearchPlatform {
  platformId: string
  name: string
  price: number
  originalPrice: number
  bankOffers?: string[]
}

export interface SearchResult {
  id: string
  name: string
  brand: string
  category: string
  image: string
  currentBestPrice: number // Default best price
  originalPrice: number
  decision: DecisionType
  confidence: number
  score: number
  verdict: string
  trend: TrendType
  platforms: SearchPlatform[]
  dealScore: number
  reasoning: string
  expectedMovement: string
  timeWindow: string
  isShieldProtected: boolean
  isFakeSale: boolean
  fairValue: number
  overpriceAmount: number
  verificationState: "VERIFIED" | "PARTIALLY_VERIFIED" | "LOW_CONFIDENCE" | "FAILED"
  driftAlert: boolean
}
