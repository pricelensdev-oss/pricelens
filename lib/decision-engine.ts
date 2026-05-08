import { PricePoint, DecisionType, DecisionSignal } from "./types";


/**
 * PriceLens Decision Engine v2.0
 * The "Anti-Regret" logic core.
 */
export function analyzePriceSignals(
  history: PricePoint[],
  currentPrice: number,
  productName: string
): DecisionSignal {
  if (!history || history.length === 0) {
    return {
      type: "HOLD",
      confidence: 50,
      score: 50,
      verdict: "INSUFFICIENT DATA",
      reasoning: "Intelligence gathering in progress. Monitor for 24-48 hours for a high-conviction verdict.",
      expectedMovement: "Stable",
      timeWindow: "Indefinite",
      percentile: 50,
      volatility: 0,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: currentPrice,
      overpriceAmount: 0
    };
  }

  // 1. Core Analytics
  const prices = history.map(h => h.price);
  const low = Math.min(...prices, currentPrice);
  const high = Math.max(...prices, currentPrice);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  // Last 30 days average for Fake Sale detection
  const recentHistory = history.slice(-30);
  const recentAvg = recentHistory.reduce((a, b) => a + b.price, 0) / recentHistory.length;

  // 2. Intelligence Signals
  const range = high - low;
  const percentile = range === 0 ? 50 : ((currentPrice - low) / range) * 100;
  
  // Fake Sale: Price hiked > 10% above recent 30-day average
  const isFakeSale = currentPrice > recentAvg * 1.10;
  
  // Fair Value: Based on the historical mean, adjusted for the floor
  const fairValue = (avg + low) / 2;
  const overpriceAmount = Math.max(0, currentPrice - fairValue);
  
  const variance = prices.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / prices.length;
  const volatility = (Math.sqrt(variance) / avg) * 100;

  // 3. Conviction Engine
  let decision: DecisionType = "HOLD";
  let verdict = "HOLD POSITION";
  let confidence = 70;
  let score = 50;
  let reasoning = "";
  let expectedMovement = "";
  let timeWindow = "";

  if (isFakeSale) {
    decision = "AVOID";
    verdict = "AVOID: ARTIFICIAL HIKE";
    score = 15;
    confidence = 92;
    reasoning = `Our engine detected a pre-sale price inflation. The "discount" is deceptive; current price is ₹${(currentPrice - recentAvg).toFixed(0)} above the 30-day baseline.`;
    expectedMovement = "Sharp Drop";
    timeWindow = "Immediate (Post-Sale)";
  } else if (percentile <= 10) {
    decision = "BUY";
    verdict = "STRONG BUY";
    score = 90 + (10 - percentile);
    confidence = Math.min(98, 85 + (10 - percentile));
    reasoning = `${productName} is trading at its multi-month floor. Historical resistance indicates this is a high-value entry window.`;
    expectedMovement = "Stable / Rebound";
    timeWindow = "Buy Now";
  } else if (percentile >= 80) {
    decision = "WAIT";
    verdict = "WAIT FOR DROP";
    score = 30 - (percentile - 80);
    confidence = Math.min(95, 75 + (percentile - 80));
    reasoning = `Price is currently inflated (${percentile.toFixed(0)}th percentile). Statistical mean reversion predicts a drop toward ₹${fairValue.toFixed(0)} within our outlook window.`;
    expectedMovement = `Potential drop of ₹${overpriceAmount.toFixed(0)}`;
    timeWindow = "10-15 days";
  } else {
    decision = "HOLD";
    verdict = "STABLE MARKET";
    score = 50 + (50 - percentile) / 2;
    confidence = 65;
    reasoning = "Current pricing aligns with the stable market average. No aggressive buy or sell signals detected. Buy only if essential.";
    expectedMovement = "Range-bound";
    timeWindow = "Ongoing";
  }

  // Adjust for volatility
  if (volatility > 12) {
    confidence -= 8;
    reasoning += " Swings detected: High market volatility may impact short-term predictability.";
  }

  const isShieldProtected = decision === "BUY" && confidence >= 92;

  return {
    decision,
    confidence: Math.round(confidence),
    score: Math.round(score),
    verdict,
    reasoning,
    expectedMovement,
    timeWindow,
    percentile,
    volatility,
    isShieldProtected,
    isFakeSale,
    fairValue: Math.round(fairValue),
    overpriceAmount: Math.round(overpriceAmount)
  };
}
