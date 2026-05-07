"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, TrendingUp, Sparkles, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"

export function MobileNav() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  const links = [
    { href: "/", icon: TrendingUp, label: "Feed" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/deals", icon: Sparkles, label: "Deals" },
    { href: "/watchlist", icon: Heart, label: "Saved" },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[90%] -translate-x-1/2 sm:hidden">
      <nav className="glass flex items-center justify-around rounded-3xl p-3 shadow-2xl border-white/10 ring-1 ring-white/10">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 transition-all duration-300",
                active ? "text-primary" : "text-muted-foreground/60"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-500",
                active ? "bg-primary/10 glow-primary" : "group-hover:bg-white/5"
              )}>
                <Icon className={cn("h-5 w-5", active ? "animate-pulse" : "")} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest">{link.label}</span>
              {active && (
                <span className="absolute -top-1 h-1 w-1 rounded-full bg-primary glow-primary" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
