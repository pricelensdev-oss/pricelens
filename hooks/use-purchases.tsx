"use client"

import { useState, useEffect, createContext, useContext } from "react"
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

interface PurchasesContextType {
  purchasedItems: PurchasedItem[]
  addPurchase: (item: PurchasedItem) => void
  removePurchase: (id: string) => void
  isPurchased: (id: string) => boolean
  getPurchase: (id: string) => PurchasedItem | undefined
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined)

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([])

  useEffect(() => {
    const fetchPurchases = async () => {
      const saved = localStorage.getItem("pricelens-purchases")
      if (saved) {
        try {
          setPurchasedItems(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to load purchases", e)
        }
      }

      // Simulated Cloud Sync
      try {
        const res = await fetch("/api/purchases")
        if (res.ok) {
          const cloudData = await res.json()
          if (cloudData.length > 0) {
            setPurchasedItems(cloudData)
            localStorage.setItem("pricelens-purchases", JSON.stringify(cloudData))
          }
        }
      } catch (err) {
        console.log("Cloud sync unavailable, using local data")
      }
    }
    fetchPurchases()
  }, [])

  const savePurchases = async (items: PurchasedItem[], apiAction?: { action: string, item?: PurchasedItem, id?: string }) => {
    setPurchasedItems(items)
    localStorage.setItem("pricelens-purchases", JSON.stringify(items))

    if (apiAction) {
      try {
        await fetch("/api/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiAction)
        })
      } catch (err) {
        console.error("Failed to sync with cloud", err)
      }
    }
  }

  const addPurchase = (item: PurchasedItem) => {
    const existing = purchasedItems.find((p) => p.id === item.id)
    if (existing) {
      toast.info("Updating existing purchase record.")
      savePurchases(
        purchasedItems.map((p) => (p.id === item.id ? item : p)),
        { action: "add", item }
      )
    } else {
      savePurchases(
        [...purchasedItems, item],
        { action: "add", item }
      )
      toast.success(`Shield Activated for ${item.name}`)
    }
  }

  const removePurchase = (id: string) => {
    savePurchases(
      purchasedItems.filter((p) => p.id !== id),
      { action: "remove", id }
    )
    toast.success("Purchase record removed.")
  }

  const isPurchased = (id: string) => purchasedItems.some((p) => p.id === id)
  const getPurchase = (id: string) => purchasedItems.find((p) => p.id === id)

  return (
    <PurchasesContext.Provider value={{
      purchasedItems,
      addPurchase,
      removePurchase,
      isPurchased,
      getPurchase,
    }}>
      {children}
    </PurchasesContext.Provider>
  )
}

export function usePurchases() {
  const context = useContext(PurchasesContext)
  if (context === undefined) {
    throw new Error("usePurchases must be used within a PurchasesProvider")
  }
  return context
}
