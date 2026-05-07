"use client"

import { Check, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AVAILABLE_BANKS = [
  "HDFC",
  "ICICI",
  "SBI",
  "Axis",
  "Kotak",
  "RBL",
  "HSBC"
]

interface BankOfferFilterProps {
  selectedBanks: string[]
  onToggleBank: (bank: string) => void
}

export function BankOfferFilter({ selectedBanks, onToggleBank }: BankOfferFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10">
          <CreditCard className="h-4 w-4 text-primary" />
          <span>{selectedBanks.length > 0 ? `${selectedBanks.length} Cards Selected` : "My Cards"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <DropdownMenuLabel>Select Your Cards</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AVAILABLE_BANKS.map((bank) => (
          <DropdownMenuCheckboxItem
            key={bank}
            checked={selectedBanks.includes(bank)}
            onCheckedChange={() => onToggleBank(bank)}
            className="cursor-pointer"
          >
            {bank} Bank
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
