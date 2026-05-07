"use client"

import { useState, useEffect, createContext, useContext } from "react"

interface Preferences {
  selectedBanks: string[]
  memberships: string[]
  isBusinessUser: boolean
  pincode: string
  exchangeValue: number
}

interface PreferencesContextType {
  preferences: Preferences
  toggleBank: (bank: string) => void
  toggleMembership: (membership: string) => void
  toggleBusiness: () => void
  setPincode: (pincode: string) => void
  setExchangeValue: (value: number) => void
  setBanks: (banks: string[]) => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>({
    selectedBanks: [],
    memberships: [],
    isBusinessUser: false,
    pincode: "",
    exchangeValue: 0,
  })

  // Load from localStorage & Cloud on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      const saved = localStorage.getItem("pricelens-preferences")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setPreferences({
            selectedBanks: parsed.selectedBanks || [],
            memberships: parsed.memberships || [],
            isBusinessUser: !!parsed.isBusinessUser,
            pincode: parsed.pincode || "",
            exchangeValue: Number(parsed.exchangeValue) || 0,
          })
        } catch (e) {
          console.error("Failed to parse preferences", e)
        }
      }

      // Simulated Cloud Sync
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const cloudData = await res.json()
          setPreferences(prev => ({
            ...prev,
            ...cloudData
          }))
        }
      } catch (err) {
        console.log("Profile cloud sync unavailable")
      }
    }
    fetchPreferences()
  }, [])

  // Save to localStorage & Cloud on change
  useEffect(() => {
    localStorage.setItem("pricelens-preferences", JSON.stringify(preferences))
    
    const syncCloud = async () => {
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences)
        })
      } catch (err) {
        // Silently fail, we have local storage
      }
    }
    syncCloud()
  }, [preferences])

  const toggleBank = (bank: string) => {
    setPreferences((prev) => ({
      ...prev,
      selectedBanks: prev.selectedBanks.includes(bank)
        ? prev.selectedBanks.filter((b) => b !== bank)
        : [...prev.selectedBanks, bank],
    }))
  }

  const toggleMembership = (membership: string) => {
    setPreferences((prev) => ({
      ...prev,
      memberships: prev.memberships.includes(membership)
        ? prev.memberships.filter((m) => m !== membership)
        : [...prev.memberships, membership],
    }))
  }

  const toggleBusiness = () => {
    setPreferences((prev) => ({
      ...prev,
      isBusinessUser: !prev.isBusinessUser,
    }))
  }

  const setPincode = (pincode: string) => {
    setPreferences((prev) => ({ ...prev, pincode }))
  }

  const setExchangeValue = (value: number) => {
    setPreferences((prev) => ({ ...prev, exchangeValue: value }))
  }

  const setBanks = (banks: string[]) => {
    setPreferences((prev) => ({ ...prev, selectedBanks: banks }))
  }

  return (
    <PreferencesContext.Provider value={{ 
      preferences, 
      toggleBank, 
      toggleMembership, 
      toggleBusiness, 
      setPincode, 
      setExchangeValue,
      setBanks 
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}
