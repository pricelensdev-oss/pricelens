"use client"

import { useState } from "react"
import { Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePurchases, PurchasedItem } from "@/hooks/use-purchases"

interface PurchaseDialogProps {
  product: {
    id: string
    name: string
    image: string
    currentBestPrice: number
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PurchaseDialog({ product, open, onOpenChange }: PurchaseDialogProps) {
  const { addPurchase } = usePurchases()
  const [price, setPrice] = useState(product.currentBestPrice.toString())
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [platform, setPlatform] = useState("Amazon")

  const handleConfirm = () => {
    const item: PurchasedItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      purchasePrice: parseFloat(price),
      purchaseDate: date,
      protectionWindowDays: 7, // Default
      platform: platform
    }
    addPurchase(item)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="luxury-card border-white/5 sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 glow-primary">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-xl">Start Price Protection</DialogTitle>
          <DialogDescription className="text-center">
            Confirm your purchase details to start 7-day active price tracking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="price" className="text-xs uppercase tracking-widest text-muted-foreground">Purchase Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-xs uppercase tracking-widest text-muted-foreground">Purchase Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="platform" className="text-xs uppercase tracking-widest text-muted-foreground">Marketplace</Label>
            <Input
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-white/5 border-white/10"
              placeholder="e.g. Amazon, Flipkart"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Check className="h-4 w-4" /> Protect Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
