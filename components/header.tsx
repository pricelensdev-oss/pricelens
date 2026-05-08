"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, TrendingUp, Sun, Moon, Tag } from "lucide-react"
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PersonalizationHub } from "@/components/personalization-hub"
import { NotificationBell } from "@/components/notification-bell"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Browse" },
  { href: "/deals", label: "Deals" },
  { href: "/watchlist", label: "Watchlist" },
]
export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const { isSignedIn, isLoaded } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-3xl border-b border-white/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 shrink-0 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-2xl shadow-primary/30 transition-transform duration-500 group-hover:rotate-12">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
            PriceLens<span className="text-primary">.</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/search"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-primary"
          >
            Search
          </Link>
          <Link
            href="/watchlist"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-primary"
          >
            My List
          </Link>
          <Link
            href="/deals"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary transition-all hover:scale-105"
          >
            <Tag className="h-3.5 w-3.5" />
            Best Deals
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-white/10 pr-6 mr-2">
            <NotificationBell />
            <PersonalizationHub />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!isLoaded ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
            ) : isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-11 w-11 border-2 border-primary/20 hover:border-primary transition-all duration-500",
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <Button className="h-11 px-8 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
