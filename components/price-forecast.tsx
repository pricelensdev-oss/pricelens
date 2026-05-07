"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, AlertCircle, Info, Minus, CalendarClock } from "lucide-react"
import type { TrendType } from "@/lib/types"
import { getUpcomingSale } from "@/lib/events"
import { cn } from "@/lib/utils"

interface ForecastData {
  days: number
  probability: number
  expectedPrice: number
  sentiment: "bullish" | "bearish" | "stable"
}

interface PriceForecastProps {
  currentPrice: number
  trend: TrendType
}

export function PriceForecast({ currentPrice, trend }: PriceForecastProps) {
  // Logic to generate forecasts based on trend
  const getForecasts = (): ForecastData[] => {
    if (trend === "down") {
      return [
        { days: 7, probability: 85, expectedPrice: currentPrice * 0.98, sentiment: "bearish" },
        { days: 14, probability: 70, expectedPrice: currentPrice * 0.95, sentiment: "bearish" },
        { days: 30, probability: 55, expectedPrice: currentPrice * 0.92, sentiment: "bearish" },
      ]
    } else if (trend === "up") {
      return [
        { days: 7, probability: 75, expectedPrice: currentPrice * 1.02, sentiment: "bullish" },
        { days: 14, probability: 60, expectedPrice: currentPrice * 1.05, sentiment: "bullish" },
        { days: 30, probability: 45, expectedPrice: currentPrice * 1.10, sentiment: "bullish" },
      ]
    } else {
      return [
        { days: 7, probability: 90, expectedPrice: currentPrice, sentiment: "stable" },
        { days: 14, probability: 80, expectedPrice: currentPrice * 0.99, sentiment: "stable" },
        { days: 30, probability: 70, expectedPrice: currentPrice * 1.01, sentiment: "stable" },
      ]
    }
  }

  const forecasts = getForecasts()
  const upcomingSale = getUpcomingSale()
  const isSaleNear = upcomingSale.daysRemaining <= 30 && upcomingSale.impact === "high"
  
  const Icon = trend === "down" ? TrendingDown : trend === "up" ? TrendingUp : Minus

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-2 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Icon className={`h-4 w-4 ${trend === "down" ? "text-success" : trend === "up" ? "text-danger" : "text-muted-foreground"}`} />
            AI Price Forecast (Next 30 Days)
          </CardTitle>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
            <Info className="h-3 w-3" />
            Beta
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          {forecasts.map((f) => (
            <div key={f.days} className="p-4 space-y-2 text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                In {f.days} Days
              </p>
              <div className="flex flex-col items-center">
                <p className="text-lg font-black text-foreground">
                  ₹{f.expectedPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${f.sentiment === "bearish" ? "bg-success" : f.sentiment === "bullish" ? "bg-danger" : "bg-primary"}`} />
                  <p className={`text-[10px] font-bold uppercase ${f.sentiment === "bearish" ? "text-success" : f.sentiment === "bullish" ? "text-danger" : "text-primary"}`}>
                    {f.probability}% Prob.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={cn(
          "p-3 border-t border-border/50",
          isSaleNear ? "bg-warning/10" : "bg-primary/5"
        )}>
          <div className="flex items-start gap-2">
            {isSaleNear ? (
              <CalendarClock className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            )}
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {isSaleNear 
                ? `MAJOR EVENT: ${upcomingSale.name} is expected in ~${upcomingSale.daysRemaining} days. Our AI suggests waiting as historical drops for this category exceed 15% during this period.`
                : trend === "down" 
                ? "Our agents predict a price drop within 14 days due to upcoming seasonal trends. Waiting could save you significantly."
                : trend === "up"
                ? "Prices are trending upward. Our agents suggest buying soon before further increases."
                : "Prices are expected to remain stable. Current pricing is fair based on 90-day history."}
              {" "}<span className="text-foreground font-medium underline cursor-help">Learn more.</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

