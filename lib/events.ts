export interface SaleEvent {
  name: string
  platform: string
  month: number // 1-12
  approxDay: number
  description: string
  impact: "high" | "medium" | "low"
}

export const MAJOR_SALES: SaleEvent[] = [
  {
    name: "Amazon Prime Day",
    platform: "Amazon",
    month: 7, // July
    approxDay: 15,
    description: "Deep discounts for Prime members across electronics.",
    impact: "high"
  },
  {
    name: "Big Billion Days",
    platform: "Flipkart",
    month: 10, // October
    approxDay: 8,
    description: "The biggest annual sale with massive price drops on smartphones.",
    impact: "high"
  },
  {
    name: "Great Indian Festival",
    platform: "Amazon",
    month: 10,
    approxDay: 8,
    description: "Month-long festive sale with record-low pricing.",
    impact: "high"
  },
  {
    name: "Independence Day Sale",
    platform: "All",
    month: 8, // August
    approxDay: 10,
    description: "Mid-year clearance and tech offers.",
    impact: "medium"
  },
  {
    name: "Republic Day Sale",
    platform: "All",
    month: 1, // January
    approxDay: 20,
    description: "Early year electronics clearance.",
    impact: "medium"
  },
  {
    name: "Summer Sale",
    platform: "Amazon/Flipkart",
    month: 5, // May
    approxDay: 4,
    description: "Special discounts on appliances and tech.",
    impact: "medium"
  }
]

export function getUpcomingSale() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  // Find the next sale in the cycle
  const sortedSales = [...MAJOR_SALES].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month
    return a.approxDay - b.approxDay
  })

  // Look for sale this month or next
  const upcoming = sortedSales.find(sale => {
    if (sale.month === currentMonth) {
      return sale.approxDay > currentDay
    }
    return sale.month > currentMonth
  }) || sortedSales[0] // wrap around to first sale of next year

  // Calculate days remaining (rough estimate)
  const saleDate = new Date(now.getFullYear(), upcoming.month - 1, upcoming.approxDay)
  if (saleDate < now) saleDate.setFullYear(now.getFullYear() + 1)
  
  const diffTime = Math.abs(saleDate.getTime() - now.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    ...upcoming,
    daysRemaining: diffDays
  }
}
