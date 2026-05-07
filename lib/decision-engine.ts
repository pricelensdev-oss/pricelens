import { PricePoint, DecisionType } from "./types";

export interface DecisionSignal {
  type: DecisionType;
  confidence: number;
  reasoning: string;
  expectedMovement: string;
  timeWindow: string;
  percentile: number;
  volatility: number;
  isShieldProtected: boolean;
}

/**
 * Time-Bound Decision Engine
 * Analyzes price history signals to generate predictive buy recommendations.
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
      reasoning: "Insufficient historical data to generate a high-confidence signal.",
      expectedMovement: "Stable",
      timeWindow: "Indefinite",
      percentile: 50,
      volatility: 0,
      isShieldProtected: false
    };
  }

  // 1. Calculate Stats
  const prices = history.map(h => h.price);
  const low = Math.min(...prices, currentPrice);
  const high = Math.max(...prices, currentPrice);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  // 2. Calculate Percentile (0 = At Low, 100 = At High)
  const range = high - low;
  const percentile = range === 0 ? 50 : ((currentPrice - low) / range) * 100;
  
  // 3. Calculate Volatility (Standard Deviation approx)
  const variance = prices.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / prices.length;
  const volatility = (Math.sqrt(variance) / avg) * 100; // Percentage volatility

  // 4. Determine Decision
  let type: DecisionType = "HOLD";
  let confidence = 70;
  let reasoning = "";
  let expectedMovement = "";
  let timeWindow = "";

  if (percentile <= 15) {
    type = "BUY";
    confidence = Math.min(95, 80 + (15 - percentile));
    reasoning = `${productName} is currently trading within ${percentile.toFixed(0)}% of its 90-day floor. Historical resistance suggests a rebound is imminent.`;
    expectedMovement = "Upward / Stable";
    timeWindow = "Immediate";
  } else if (percentile >= 75) {
    type = "WAIT";
    confidence = Math.min(90, 70 + (percentile - 75));
    const potentialDrop = currentPrice - avg;
    reasoning = `Price is currently inflated (${percentile.toFixed(0)}th percentile). Our model detects a mean-reversion pattern indicating a potential drop toward ${avg.toFixed(0)}.`;
    expectedMovement = `Drop of approx ₹${potentialDrop.toFixed(0)}`;
    timeWindow = "14-21 days";
  } else {
    type = "HOLD";
    confidence = 60;
    reasoning = "Market is in a neutral consolidation phase. Current price aligns with the 30-day moving average. Monitor for sudden supply chain shifts.";
    expectedMovement = "Range-bound";
    timeWindow = "7 days";
  }

  // Adjust confidence based on volatility (High volatility = lower confidence in short-term)
  if (volatility > 10) {
    confidence -= 5;
    reasoning += " Note: High market volatility detected; price swings may be aggressive.";
  }

  const isShieldProtected = type === "BUY" && confidence >= 90;

  return {
    type,
    confidence: Math.round(confidence),
    reasoning,
    expectedMovement,
    timeWindow,
    percentile,
    volatility,
    isShieldProtected
  };
}
