export type DecisionType = "BUY" | "WAIT" | "HOLD" | "AVOID"
export type TrendType = "up" | "down" | "stable"
export type VerificationState = "VERIFIED" | "PARTIALLY_VERIFIED" | "LOW_CONFIDENCE" | "FAILED"

export interface DecisionSignal {
  decision: DecisionType
  confidence: number
  score: number 
  verdict: string 
  reasoning: string
  expectedMovement: string
  timeWindow: string
  percentile: number
  volatility: number
  isShieldProtected: boolean
  isFakeSale: boolean
  fairValue: number
  overpriceAmount: number
}

export interface Platform {
  id: string
  platformId: string
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
  oracleSnapshots?: any[] 
  verificationState: VerificationState
  confidenceScore?: number
  driftAlert?: boolean
  decision: DecisionSignal
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

export interface SearchResult extends DecisionSignal {
  id: string
  name: string
  brand: string
  category: string
  image: string
  currentBestPrice: number 
  originalPrice: number
  trend: TrendType
  platforms: SearchPlatform[]
  dealScore: number
  verificationState: VerificationState
  driftAlert: boolean
}

export interface UserPreferences {
  selectedBanks: string[]
  memberships: string[]
  isBusinessUser?: boolean
  pincode?: string
  exchangeValue?: number
}

export interface PriceBreakdown {
  label: string
  amount: number
  type: "discount" | "fee" | "credit"
}

export interface PersonalizedPriceResult {
  personalizedPrice: number
  breakdown: PriceBreakdown[]
  gstCredit: number
  deliveryEstimate: string
}
