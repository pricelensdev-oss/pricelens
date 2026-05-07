"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
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
  placeholder = "Search for any product...",
  className,
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "group relative flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 transition-all duration-300",
        size === "large" ? "max-w-3xl" : "max-w-lg",
        className
      )}
    >
      <div className="relative flex-1">
        <Search
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary",
            size === "large" ? "h-6 w-6 left-5" : "h-4 w-4"
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          suppressHydrationWarning
          className={cn(
            "w-full glass rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:glow-primary transition-all duration-500 font-display",
            size === "large"
              ? "h-16 pl-14 pr-4 text-xl tracking-tight"
              : "h-12 pl-12 pr-4 text-sm"
          )}
        />
      </div>
      <Button
        type="submit"
        variant="default"
        className={cn(
          "rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 sm:ml-3",
          size === "large" ? "h-16 px-8 text-sm" : "h-12 px-6 text-[10px]",
          className?.includes("flex-row") ? "w-auto ml-2" : "w-full sm:w-auto"
        )}
      >
        AI Search
      </Button>
    </form>
  )
}
