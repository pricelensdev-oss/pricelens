"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Sparkles, MessageSquareQuote, CalendarCheck } from "lucide-react"
import { getUpcomingSale } from "@/lib/events"

interface SentimentPoint {
  text: string
  sourceCount: number
}

interface AiSentimentProps {
  productName: string
}

export function AiSentiment({ productName }: AiSentimentProps) {
  const upcomingSale = getUpcomingSale()
  const isSaleNear = upcomingSale.daysRemaining <= 30 && upcomingSale.impact === "high"

  // In a real app, this would be fetched based on the product
  const pros: SentimentPoint[] = [
    { text: "Exceptional build quality and premium feel", sourceCount: 1240 },
    { text: "High performance relative to previous generation", sourceCount: 890 },
    { text: "Highly rated for its sleek, modern aesthetic", sourceCount: 650 },
  ]

  const cons: SentimentPoint[] = [
    { text: "Price premium compared to direct competitors", sourceCount: 430 },
    { text: "Limited availability of certain color variants", sourceCount: 210 },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Review Intelligence
          </CardTitle>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">
            Analyzed 2,500+ Reviews
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Pros */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-success flex items-center gap-2">
            <ThumbsUp className="h-3 w-3" />
            Why Users Love It
          </h4>
          <div className="grid gap-2">
            {pros.map((p, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-success/5 p-3 border border-success/10">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{p.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">Mentioned by {p.sourceCount} verified buyers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-danger flex items-center gap-2">
            <ThumbsDown className="h-3 w-3" />
            Common Complaints
          </h4>
          <div className="grid gap-2">
            {isSaleNear && (
              <div className="flex items-start gap-3 rounded-lg bg-warning/5 p-3 border border-warning/10">
                <CalendarCheck className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-bold italic">Strategic Wait Recommended</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {upcomingSale.name} starts in ~{upcomingSale.daysRemaining} days. Historical data shows {productName} often drops by an additional 10-15% during this event.
                  </p>
                </div>
              </div>
            )}
            {cons.map((c, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-danger/5 p-3 border border-danger/10">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{c.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">Noted in {c.sourceCount} critical reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border flex gap-3">
          <MessageSquareQuote className="h-6 w-6 text-primary shrink-0 opacity-50" />
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">The Agent's Verdict</p>
            <p className="text-sm text-foreground italic leading-relaxed">
              "The {productName} remains a top-tier choice in its category. While it commands a premium, the engineering excellence and user satisfaction scores justify the investment for most enthusiasts."
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

