"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import type { PricePoint } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface PriceChartProps {
  data: PricePoint[]
  targetPrice?: number
  className?: string
  onPointClick?: (price: number) => void
}

const platformColors: Record<string, string> = {
  Amazon: "oklch(0.82 0.18 195)", // Electric Cyan
  Flipkart: "oklch(0.78 0.15 85)", // Molten Amber
  Croma: "oklch(0.60 0.25 25)",   // Pulse Red
  "Reliance Digital": "oklch(0.96 0.01 250)", // Silver Mist
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0a0a0c]/90 p-4 shadow-2xl backdrop-blur-xl">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          {new Date(label || "").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="space-y-2">
          {payload.map(
            (entry: { name: string; value: number; color: string }) => (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-8"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs font-medium text-foreground/80">
                    {entry.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-foreground tabular-nums">
                  {formatPrice(entry.value)}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    )
  }
  return null
}

export function PriceChart({ data, targetPrice, className, onPointClick }: PriceChartProps) {
  // Transform data for recharts - group by date
  const chartData = data.reduce(
    (acc, point) => {
      const existing = acc.find((d) => d.date === point.date)
      if (existing) {
        existing[point.platform] = point.price
      } else {
        acc.push({
          date: point.date,
          [point.platform]: point.price,
        })
      }
      return acc
    },
    [] as Array<Record<string, string | number>>
  )

  // Sort by date to ensure correct line drawing
  chartData.sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime())

  // Sample every ~7th point to reduce chart density if many points
  const sampledData = chartData.length > 30 
    ? chartData.filter((_, i) => i % 3 === 0 || i === chartData.length - 1)
    : chartData

  const platforms = [...new Set(data.map((d) => d.platform))]

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={sampledData}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload.length > 0 && onPointClick) {
              const price = data.activePayload[0].value
              onPointClick(Number(price))
            }
          }}
          style={{ cursor: onPointClick ? 'crosshair' : 'default' }}
        >
          <defs>
            {platforms.map((platform) => (
              <linearGradient key={`grad-${platform}`} id={`grad-${platform}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={platformColors[platform] || "#888"} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={platformColors[platform] || "#888"} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.18 0.01 250)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "oklch(0.65 0 0)", fontWeight: 500 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })
            }
            axisLine={false}
            tickLine={false}
            dy={10}
            stroke="oklch(0.28 0.02 280)"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "oklch(0.65 0 0)", fontWeight: 500 }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
            dx={-10}
            stroke="oklch(0.28 0.02 280)"
            width={50}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'oklch(1 0 0 / 0.1)', strokeWidth: 1 }}
          />
          
          {targetPrice && (
            <ReferenceLine 
              y={targetPrice} 
              stroke="oklch(0.82 0.18 195)" 
              strokeDasharray="5 5" 
              label={{ 
                value: `Target: ${formatPrice(targetPrice)}`, 
                position: 'top', 
                fill: 'oklch(0.82 0.18 195)', 
                fontSize: 10,
                fontWeight: 'bold'
              }} 
            />
          )}

          {platforms.map((platform) => (
            <Area
              key={platform}
              type="monotone"
              dataKey={platform}
              stroke={platformColors[platform] || "#888"}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#grad-${platform})`}
              animationDuration={1500}
            />
          ))}
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: "24px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}
            iconType="circle"
            iconSize={6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
