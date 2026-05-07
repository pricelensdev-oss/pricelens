"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { usePurchases } from "./use-purchases"

interface Notification {
  id: string
  title: string
  message: string
  type: "price_drop" | "info" | "shield_success"
  timestamp: Date
  read: boolean
  link?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { purchasedItems } = usePurchases()

  // Automated background check for price drops on purchased items
  useEffect(() => {
    const checkSavings = async () => {
      if (purchasedItems.length === 0) return

      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const products = await response.json()
          const newNotifications: Notification[] = []

          purchasedItems.forEach(item => {
            const livePrice = products.find((p: any) => p.id === item.id)?.currentBestPrice || 0
            const daysSincePurchase = Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
        
        // If price dropped and within 7-day shield window
        if (livePrice > 0 && livePrice < item.purchasePrice && daysSincePurchase <= 7) {
          const savings = item.purchasePrice - livePrice
          const notificationId = `drop-${item.id}-${livePrice}`
          
          // Only add if not already notified for this exact price drop
          if (!notifications.some(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              title: "Price Shield Alert!",
              message: `Price dropped by ₹${savings.toLocaleString()} on ${item.name}. Claim your match now!`,
              type: "price_drop",
              timestamp: new Date(),
              read: false,
              link: "/shield"
            })
          }
        }
      })

          if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev])
          }
        }
      } catch (err) {
        console.error("Failed to run background savings audit", err)
      }
    }

    // Check once on mount or when purchases change
    checkSavings()
    
    // Simulate periodic checks
    const interval = setInterval(checkSavings, 60000) // Every minute
    return () => clearInterval(interval)
  }, [purchasedItems])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      clearNotifications 
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
