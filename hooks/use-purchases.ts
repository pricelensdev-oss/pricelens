"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

export interface PurchasedItem {
  id: string
  name: string
  image: string
  purchasePrice: number
  purchaseDate: string
  protectionWindowDays: number
  platform: string
}

export function usePurchases() {
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("pricelens-purchases")
    if (saved) {
      try {
        setPurchasedItems(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load purchases", e)
      }
    }
  }, [])

  const savePurchases = (items: PurchasedItem[]) => {
    setPurchasedItems(items)
    localStorage.setItem("pricelens-purchases", JSON.stringify(items))
  }

  const addPurchase = (item: PurchasedItem) => {
    const existing = purchasedItems.find((p) => p.id === item.id)
    if (existing) {
      toast.info("Updating existing purchase record.")
      savePurchases(purchasedItems.map((p) => (p.id === item.id ? item : p)))
    } else {
      savePurchases([...purchasedItems, item])
      toast.success(`Shield Activated for ${item.name}`)
    }
  }

  const removePurchase = (id: string) => {
    savePurchases(purchasedItems.filter((p) => p.id !== id))
    toast.success("Purchase record removed.")
  }

  const isPurchased = (id: string) => purchasedItems.some((p) => p.id === id)
  const getPurchase = (id: string) => purchasedItems.find((p) => p.id === id)

  return {
    purchasedItems,
    addPurchase,
    removePurchase,
    isPurchased,
    getPurchase,
  }
}
