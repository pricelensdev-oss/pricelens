"use client"

import { CreditCard, Settings2, Zap, Building2, MapPin, ArrowLeftRight } from "lucide-react"
import { usePreferences } from "@/hooks/use-preferences"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const AVAILABLE_BANKS = [
  "HDFC",
  "ICICI",
  "SBI",
  "Axis",
  "Kotak",
  "HSBC",
  "Standard Chartered",
  "American Express",
]

export function PersonalizationHub() {
  const { preferences, toggleBank, toggleMembership, toggleBusiness, setPincode, setExchangeValue } = usePreferences()
  const { selectedBanks, isBusinessUser } = preferences

  const activeCount = selectedBanks.length + preferences.memberships.length + (isBusinessUser ? 1 : 0) + (preferences.pincode ? 1 : 0) + (preferences.exchangeValue > 0 ? 1 : 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-xl border border-white/5 bg-white/5 transition-all hover:bg-white/10"
        >
          <Settings2 className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 glass border-white/10 p-3 shadow-2xl">
        <div className="space-y-4">
          {/* Location & Pincode */}
          <div>
            <DropdownMenuLabel className="flex items-center gap-2 px-0 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Delivery Location
            </DropdownMenuLabel>
            <Input
              placeholder="Enter Pincode (e.g. 400001)"
              value={preferences.pincode || ''}
              onChange={(e) => setPincode(e.target.value)}
              className="mt-1 h-9 bg-white/5 border-white/10 text-xs focus:ring-primary/30"
              maxLength={6}
            />
          </div>

          <DropdownMenuSeparator className="bg-white/5" />

          {/* Exchange Value */}
          <div>
            <DropdownMenuLabel className="flex items-center gap-2 px-0 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <ArrowLeftRight className="h-3 w-3" />
              Estimated Exchange
            </DropdownMenuLabel>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="Value (e.g. 5000)"
                value={preferences.exchangeValue || ""}
                onChange={(e) => setExchangeValue(Number(e.target.value))}
                className="h-9 pl-6 bg-white/5 border-white/10 text-xs focus:ring-primary/30"
              />
            </div>
          </div>

          <DropdownMenuSeparator className="bg-white/5" />

          {/* Banks */}
          <div>
            <DropdownMenuLabel className="flex items-center gap-2 px-0 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <CreditCard className="h-3 w-3" />
              Preferred Cards
            </DropdownMenuLabel>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {AVAILABLE_BANKS.map((bank) => (
                <DropdownMenuCheckboxItem
                  key={bank}
                  checked={selectedBanks.includes(bank)}
                  onCheckedChange={() => toggleBank(bank)}
                  className="rounded-lg text-xs transition-colors focus:bg-primary/10 focus:text-primary"
                >
                  {bank}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-white/5" />
          
          {/* Memberships */}
          <div>
            <DropdownMenuLabel className="flex items-center gap-2 px-0 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Zap className="h-3 w-3" />
              Memberships
            </DropdownMenuLabel>
            <div className="mt-2 space-y-1">
              {["Amazon Prime", "Flipkart VIP", "AJIO Gold"].map((m) => (
                <DropdownMenuCheckboxItem
                  key={m}
                  checked={preferences.memberships.includes(m)}
                  onCheckedChange={() => toggleMembership(m)}
                  className="rounded-lg text-xs transition-colors focus:bg-primary/10 focus:text-primary"
                >
                  {m}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator className="bg-white/5" />

          {/* Business Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <div className="flex flex-col">
                <Label htmlFor="business-mode" className="text-xs font-bold uppercase tracking-tighter text-foreground">GST Invoice</Label>
                <span className="text-[8px] text-muted-foreground uppercase tracking-tight">Tax Input Credit</span>
              </div>
            </div>
            <Switch 
              id="business-mode" 
              checked={isBusinessUser} 
              onCheckedChange={toggleBusiness}
              className="scale-75 data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <DropdownMenuSeparator className="bg-white/5" />
        <div className="p-2">
          <div className="rounded-lg bg-primary/5 p-2 border border-primary/10">
            <p className="text-[10px] leading-tight text-primary/80">
              <span className="font-bold">Smart Tip:</span>{" "}
              {isBusinessUser 
                ? "GST Input Credit (18%) is being applied. You are seeing the real asset cost for your business."
                : selectedBanks.length === 0
                ? "Connect your preferred bank cards to unlock an average of ₹1,500 in instant marketplace discounts."
                : "You're optimizing for 4 saving opportunities. Adding a premium membership (e.g. Prime) can further reduce your effective price."}
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
