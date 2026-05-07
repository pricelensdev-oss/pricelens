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
    <header className="glass-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary transition-transform duration-500 group-hover:rotate-12">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col -space-y-1">
            <h1 className="text-2xl font-display font-black tracking-tighter text-foreground uppercase">
              Price<span className="text-primary">Lens</span>
            </h1>
            <span className="text-[9px] font-bold tracking-[0.3em] text-primary/40 uppercase">
              Smart Shopping
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/search"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Search
          </Link>
          <Link
            href="/deals"
            className="flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            <Tag className="h-3.5 w-3.5 animate-pulse glow-primary" />
            Live Deals
          </Link>
          <Link
            href="/watchlist"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Watchlist
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationBell />

          {/* Personalization Hub */}
          <PersonalizationHub />

          {/* Search Button */}
          <Link href="/search" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 border-l border-white/5 pl-6 ml-3 lg:flex">
            {!isLoaded ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-white/5" />
            ) : isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors",
                  }
                }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button size="sm" className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    Get Started
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
