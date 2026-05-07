export interface SeasonalEvent {
  name: string
  startDate: string // YYYY-MM-DD
  endDate: string
  platform: string[] // ["amazon", "flipkart", "croma"]
  avgDiscount: number // Percentage
}

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    name: "Amazon Prime Day",
    startDate: "2026-07-15",
    endDate: "2026-07-16",
    platform: ["amazon"],
    avgDiscount: 15
  },
  {
    name: "Flipkart Big Billion Days",
    startDate: "2026-10-08",
    endDate: "2026-10-15",
    platform: ["flipkart"],
    avgDiscount: 20
  },
  {
    name: "Diwali Festive Sale",
    startDate: "2026-10-25",
    endDate: "2026-11-02",
    platform: ["amazon", "flipkart", "croma", "reliance"],
    avgDiscount: 25
  },
  {
    name: "Great Indian Festival",
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    platform: ["amazon"],
    avgDiscount: 18
  },
  {
    name: "Independence Day Sale",
    startDate: "2026-08-10",
    endDate: "2026-08-15",
    platform: ["amazon", "flipkart", "croma", "reliance"],
    avgDiscount: 10
  }
]

export function getNextMajorEvent() {
  const now = new Date()
  return SEASONAL_EVENTS
    .filter(event => new Date(event.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
}
