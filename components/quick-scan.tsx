"use client"

import { useState } from "react"
import { Search, Link as LinkIcon, Zap, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function QuickScan() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.includes("amazon.in") && !url.includes("flipkart.com")) {
      toast.error("Please enter a valid Amazon or Flipkart URL")
      return
    }

    setIsLoading(true)
    try {
      // Agentic Ingestion API
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const { productId } = await response.json()
        toast.success("Intelligence Ingested! Redirecting...")
        router.push(`/product/${productId}`)
      } else {
        throw new Error("Ingestion failed")
      }
    } catch (error) {
      toast.error("Our neural engine could not parse this URL. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="luxury-card border-primary/20 bg-primary/5 p-8 backdrop-blur-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 glow-primary">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Agentic Quick Scan</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Paste any Amazon or Flipkart URL. Our AI will instantly scan the market, apply your bank offers, and give you a BUY/WAIT verdict.
        </p>
        
        <form onSubmit={handleScan} className="mt-8 w-full max-w-lg">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste marketplace URL here..."
              className="h-14 pl-12 pr-32 glass border-white/10 rounded-2xl focus:border-primary/50 transition-all"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              disabled={isLoading || !url}
              className="absolute right-2 top-2 h-10 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
           <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Real-time Price Mesh</div>
           <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Bank Offer Stack</div>
           <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Neural Forecasting</div>
        </div>
      </div>
    </Card>
  )
}
