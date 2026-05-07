"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, Shield, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/use-notifications"
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs"

export function BottomNav() {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()
  const { isSignedIn } = useAuth()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/watchlist", label: "Watch", icon: Heart },
    { href: "/shield", label: "Shield", icon: Shield },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block border-t border-white/5 bg-background/80 pb-safe backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <div key={item.href} className="flex flex-col items-center">
              {item.href === "/profile" ? (
                isSignedIn ? (
                  <div className="flex flex-col items-center gap-1 px-3 py-2">
                    <UserButton 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "h-5 w-5 border border-primary/20",
                        }
                      }}
                    />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      Profile
                    </span>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className={cn(
                      "relative flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}>
                      <Icon className="h-5 w-5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">
                        Sign In
                      </span>
                    </button>
                  </SignInButton>
                )
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-primary shadow-glow-primary" />
                  )}
                  
                  <div className="relative">
                    <Icon className={cn("h-5 w-5", isActive && "fill-primary/10")} />
                    {item.href === "/shield" && unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    {item.label}
                  </span>
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
