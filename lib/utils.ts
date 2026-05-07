import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a normalized ID for a product to prevent duplicates.
 * Example: "Apple iPhone 15 (128GB) - Blue" -> "apple-iphone-15-128gb"
 */
export function generateCanonicalId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*\)/g, "") // Remove everything in brackets
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .split("-")
    .filter((word, index, self) => {
      // Remove generic stop words to improve matching
      const stopWords = ["new", "latest", "original", "pro", "max", "plus", "ultra"]
      // Keep "pro", "max" etc for now as they define models, but normalize others
      return !["official", "sealed"].includes(word)
    })
    .join("-")
}

/**
 * Format a number as Indian Rupees (e.g. ₹1,59,900)
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Calculate discount percentage between original and current price
 */
export function calcDiscount(original: number, current: number): number {
  if (original <= 0) return 0
  return Math.round(((original - current) / original) * 100)
}
