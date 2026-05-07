"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

const STORAGE_KEY = "pricelens-comparison-v1"
const MAX_COMPARE = 4

export function useComparison() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setComparisonIds(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse comparison storage", e)
      }
    }
  }, [])

  const saveIds = useCallback((ids: string[]) => {
    setComparisonIds(ids)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [])

  const toggleComparison = useCallback((productId: string) => {
    const isAlreadyAdded = comparisonIds.includes(productId)
    
    if (isAlreadyAdded) {
      const newIds = comparisonIds.filter(id => id !== productId)
      saveIds(newIds)
      toast.success("Removed from comparison")
    } else {
      if (comparisonIds.length >= MAX_COMPARE) {
        toast.error(`You can compare up to ${MAX_COMPARE} products at once`)
        return
      }
      const newIds = [...comparisonIds, productId]
      saveIds(newIds)
      toast.success("Added to comparison", {
        action: {
          label: "View Comparison",
          onClick: () => window.location.href = "/compare"
        }
      })
    }
  }, [comparisonIds, saveIds])

  const clearComparison = useCallback(() => {
    saveIds([])
  }, [saveIds])

  return {
    comparisonIds,
    toggleComparison,
    isInComparison: (productId: string) => comparisonIds.includes(productId),
    clearComparison,
    count: comparisonIds.length,
    maxCount: MAX_COMPARE
  }
}
