"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  size?: "default" | "large"
  placeholder?: string
  className?: string
  defaultValue?: string
}

export function SearchBar({
  size = "default",
  placeholder = "Paste Amazon/Flipkart link here...",
  className,
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Smart Detection: Check if it's a marketplace URL
    const isUrl = query.startsWith('http')
    const isMarketplace = query.includes('amazon') || query.includes('flipkart')

    if (isUrl && isMarketplace) {
      // Take them directly to a dedicated analysis flow
      router.push(`/search?analyze=${encodeURIComponent(query.trim())}`)
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "group relative flex w-full flex-col sm:flex-row sm:items-center transition-all duration-700",
        size === "large" ? "max-w-4xl" : "max-w-lg",
        className
      )}
    >
      <div className={cn(
        "relative flex-1 search-spotlight rounded-[2rem] border border-white/5 bg-white/[0.03] transition-all duration-700",
        size === "large" ? "h-20" : "h-14"
      )}>
        <Zap
          className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary",
            size === "large" ? "h-6 w-6" : "h-4 w-4"
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          suppressHydrationWarning
          className={cn(
            "w-full h-full bg-transparent pl-16 pr-6 text-white placeholder:text-white/20 focus:outline-none font-display",
            size === "large" ? "text-xl tracking-tight" : "text-sm"
          )}
        />
      </div>
      <Button
        type="submit"
        className={cn(
          "bg-primary text-black font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95 sm:ml-4",
          size === "large" ? "h-20 px-10 text-xs rounded-[1.5rem]" : "h-14 px-6 text-[10px] rounded-2xl",
        )}
      >
        Check Price
      </Button>
    </form>
  )
}
