import { Platform, UserPreferences, PriceBreakdown, PersonalizedPriceResult } from "./types";

/**
 * Smart Price Engine (PPE) logic.
 * Calculates the best possible price for a user based on their specific profile.
 */
export function calculatePersonalizedPrice(
  platform: Platform,
  preferencesOrBanks: UserPreferences | string[],
  isBusinessUserArg?: boolean
): PersonalizedPriceResult {
  let bestPrice = platform.price;
  const breakdown: PriceBreakdown[] = [];
  let gstCredit = 0;
  let deliveryEstimate = "Free Delivery";

  // Handle both signatures for backward compatibility
  let selectedBanks: string[] = [];
  let memberships: string[] = [];
  let isBusinessUser = false;
  let pincode = "";
  let exchangeValue = 0;

  if (Array.isArray(preferencesOrBanks)) {
    selectedBanks = preferencesOrBanks;
    isBusinessUser = !!isBusinessUserArg;
    memberships = [];
  } else if (preferencesOrBanks) {
    selectedBanks = preferencesOrBanks.selectedBanks || [];
    memberships = preferencesOrBanks.memberships || [];
    isBusinessUser = !!preferencesOrBanks.isBusinessUser;
    pincode = preferencesOrBanks.pincode || "";
    exchangeValue = preferencesOrBanks.exchangeValue || 0;
  }

  // 1. Bank Offers logic
  if (platform.bankOffers && selectedBanks.length > 0) {
    platform.bankOffers.forEach((offer: string) => {
      const upperOffer = offer.toUpperCase();
      const bankMatch = selectedBanks.find(bank => upperOffer.includes(bank.toUpperCase()));
      
      if (bankMatch) {
        const amountMatch = offer.match(/(\d+)/);
        if (amountMatch) {
          const value = parseInt(amountMatch[1]);
          let discount = 0;
          
          if (offer.includes("%")) {
            discount = (platform.price * value) / 100;
            const capMatch = offer.match(/UP TO (\d+)/i) || offer.match(/MAX (\d+)/i);
            if (capMatch) {
              const cap = parseInt(capMatch[1]);
              discount = Math.min(discount, cap);
            }
          } else {
            discount = value;
          }

          if (discount > 0) {
            bestPrice -= discount;
            breakdown.push({ label: `${bankMatch} Offer`, amount: discount, type: "discount" });
          }
        }
      }
    });
  }

  // 2. Membership benefits
  if (memberships.length > 0) {
    if (platform.platformId === "amazon" && memberships.includes("Amazon Prime")) {
      // Prime often means no delivery fee, handled in delivery section
      breakdown.push({ label: "Prime Priority Access", amount: 0, type: "discount" });
    }
    if (platform.platformId === "flipkart" && memberships.includes("Flipkart VIP")) {
      const vipSavings = bestPrice * 0.01;
      bestPrice -= vipSavings;
      breakdown.push({ label: "Flipkart VIP Extra 1%", amount: vipSavings, type: "discount" });
    }
  }

  // 3. Location & Delivery logic
  if (pincode) {
    // Simulate location-based delivery charges
    const isRemote = pincode.startsWith("7") || pincode.startsWith("19"); // Northeast or J&K
    const deliveryFee = isRemote ? 150 : 0;
    
    // Memberships often waive delivery
    const hasFreeDelivery = memberships.includes("Amazon Prime") || memberships.includes("Flipkart VIP");
    
    if (deliveryFee > 0 && !hasFreeDelivery) {
      bestPrice += deliveryFee;
      breakdown.push({ label: "Remote Delivery Fee", amount: deliveryFee, type: "fee" });
      deliveryEstimate = "4-6 Days (Standard)";
    } else {
      deliveryEstimate = hasFreeDelivery ? "Tomorrow (Express)" : "2-3 Days (Free)";
    }
  }

  // 4. Exchange Value
  if (exchangeValue > 0) {
    bestPrice -= exchangeValue;
    breakdown.push({ label: "Estimated Exchange", amount: exchangeValue, type: "discount" });
  }

  // 5. GST / Business Price toggle
  if (isBusinessUser) {
    // 18% GST Input Credit
    gstCredit = bestPrice - (bestPrice / 1.18);
    bestPrice = bestPrice / 1.18;
    breakdown.push({ label: "GST Input Credit", amount: gstCredit, type: "credit" });
  }

  return {
    personalizedPrice: Math.max(0, bestPrice),
    breakdown,
    gstCredit,
    deliveryEstimate
  };
}

/**
 * Calculates the best personalized price across all available platforms for a product.
 */
export function getBestPersonalizedPrice(
  platforms: Platform[],
  preferences: UserPreferences
): { price: number; platform: string; delivery: string } {
  if (!platforms || platforms.length === 0) return { price: 0, platform: "Unknown", delivery: "Unknown" };

  let best = { price: Infinity, platform: platforms[0].name, delivery: "Standard" };

  platforms.forEach(p => {
    const result = calculatePersonalizedPrice(p, preferences);
    if (result.personalizedPrice < best.price) {
      best = { price: result.personalizedPrice, platform: p.name, delivery: result.deliveryEstimate };
    }
  });

  return best;
}
