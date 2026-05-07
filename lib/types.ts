export type DecisionType = "BUY" | "WAIT" | "HOLD"
export type Decision = DecisionType
export type TrendType = "up" | "down" | "stable"
export type Trend = TrendType

export interface Platform {
  id: string
  platformId: string // amazon, flipkart, etc.
  name: string
  logo: string
  price: number
  originalPrice: number
  effectivePrice: number // After bank offers/discounts
  url: string
  inStock: boolean
  bankOffers?: string[]
}

export interface PricePoint {
  date: string
  price: number
  platform: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  image: string
  description: string
  specifications: Record<string, string>
  platforms: Platform[]
  priceHistory: PricePoint[]
  decision: {
    type: DecisionType
    confidence: number // 0-100
    reasoning: string
    expectedMovement: string
    timeWindow: string
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
  trend: TrendType
  platforms: SearchPlatform[]
  dealScore: number
  reasoning: string
  expectedMovement: string
  timeWindow: string
  isShieldProtected: boolean
}
