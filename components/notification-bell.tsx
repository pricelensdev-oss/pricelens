"use client"

import { Bell, Shield, Zap, CheckCircle2, Clock } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-primary shadow-glow-primary">
              <span className="absolute inset-0 h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 glass border-white/10 p-0 shadow-2xl overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between p-4 bg-white/5">
          <DropdownMenuLabel className="p-0 text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            Smart Alerts
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0 bg-white/5" />
        
        <div className="max-h-[400px] overflow-y-auto py-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
              <Shield className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">No Active Alerts</p>
              <p className="text-[10px] text-muted-foreground/40 mt-2 leading-relaxed">
                Protect your purchases with PriceLens Shield to get real-time price drop alerts.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                className={cn(
                  "p-4 transition-colors hover:bg-white/5 cursor-pointer relative group border-b border-white/5 last:border-0",
                  !n.read && "bg-primary/5"
                )}
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    n.type === 'price_drop' ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
                  )}>
                    {n.type === 'price_drop' ? <TrendingDown className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        {n.title}
                      </p>
                      <span className="text-[8px] font-bold text-muted-foreground/40 flex items-center gap-1">
                        <Clock className="h-2 w-2" />
                        Just now
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link 
                        href={n.link}
                        className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-primary uppercase hover:underline"
                      >
                        Claim Match <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
                {!n.read && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
            ))
          )}
        </div>
        
        <DropdownMenuSeparator className="m-0 bg-white/5" />
        <Link href="/shield">
          <div className="p-3 text-center transition-colors hover:bg-white/5">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary">
              View Price Protection Dashboard
            </span>
          </div>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TrendingDown({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
