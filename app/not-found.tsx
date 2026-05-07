import Link from "next/link"
import { TrendingUp, Search, Zap, Home, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 neural-mesh overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 hero-gradient opacity-40" />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Logo */}
        <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary glow-primary animate-pulse">
          <TrendingUp className="h-10 w-10 text-primary-foreground" />
        </div>

        {/* 404 */}
        <div className="mb-4 font-display text-[120px] font-black leading-none tracking-tighter text-primary/10 text-glow">
          404
        </div>

        <h1 className="mb-4 text-3xl font-black tracking-tight text-white uppercase">Intelligence Gap</h1>
        <p className="mb-10 text-base leading-relaxed text-muted-foreground/60 max-w-sm mx-auto italic">
          Our neural engine couldn't map this coordinate. The page may have been decommissioned or moved to a different market sector.
        </p>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Button asChild className="h-14 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] shadow-glow-primary">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Base
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-14 rounded-2xl glass border-white/5 font-bold uppercase tracking-widest text-[10px]">
            <Link href="/deals">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Analyze Live Deals
            </Link>
          </Button>
        </div>
        
        <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/20">
          PriceLens Sentinel Protocol 404
        </p>
      </div>
    </div>
  )
}
