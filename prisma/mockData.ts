import type { Product } from '../lib/types';

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    description: "The latest iPhone with titanium design and A17 Pro chip.",
    specifications: { Display: "6.7-inch Super Retina XDR", Processor: "A17 Pro", Storage: "256GB" },
    platforms: [
      { id: "p1a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 159900, originalPrice: 159900, effectivePrice: 154900, url: "https://amazon.in", inStock: true, bankOffers: ["5000 off on HDFC"] },
      { id: "p1b", platformId: "flipkart", name: "Flipkart", logo: "/platforms/flipkart.svg", price: 158900, originalPrice: 159900, effectivePrice: 153900, url: "https://flipkart.com", inStock: true, bankOffers: ["5000 off on ICICI"] }
    ],
    priceHistory: [
      { date: "2024-04-01", price: 159900, platform: "Amazon" },
      { date: "2024-05-01", price: 154900, platform: "Amazon" }
    ],
    decision: { 
      decision: "WAIT", 
      confidence: 85, 
      score: 45,
      verdict: "WAIT FOR DROP",
      reasoning: "Price drop expected next month based on historical data.", 
      expectedMovement: "Drop by ₹5,000", 
      timeWindow: "30 days",
      percentile: 82,
      volatility: 5,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 152000,
      overpriceAmount: 2900
    },
    trend: "down",
    lowestPrice: 154900, highestPrice: 159900, averagePrice: 157400, currentBestPrice: 154900, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "2",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    description: "Industry leading noise canceling headphones.",
    specifications: { Type: "Over-ear", Battery: "30 Hours", Connectivity: "Bluetooth 5.2" },
    platforms: [
      { id: "p2a", platformId: "flipkart", name: "Flipkart", logo: "/platforms/flipkart.svg", price: 26990, originalPrice: 34990, effectivePrice: 24990, url: "https://flipkart.com", inStock: true, bankOffers: ["2000 off on ICICI"] }
    ],
    priceHistory: [
      { date: "2024-03-01", price: 29990, platform: "Flipkart" },
      { date: "2024-05-01", price: 26990, platform: "Flipkart" }
    ],
    decision: { 
      decision: "BUY", 
      confidence: 95, 
      score: 94,
      verdict: "STRONG BUY",
      reasoning: "Lowest price of the year.", 
      expectedMovement: "Rise by ₹3,000", 
      timeWindow: "7 days",
      percentile: 5,
      volatility: 8,
      isShieldProtected: true,
      isFakeSale: false,
      fairValue: 27500,
      overpriceAmount: 0
    },
    trend: "up",
    lowestPrice: 24990, highestPrice: 34990, averagePrice: 29990, currentBestPrice: 24990, currentBestPlatform: "Flipkart", isShieldProtected: true,
    verificationState: "VERIFIED"
  },
  {
    id: "3",
    name: "MacBook Air M3 13-inch",
    brand: "Apple",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    description: "Supercharged by M3. Super thin and light.",
    specifications: { Display: "13.6-inch Liquid Retina", Processor: "M3", RAM: "8GB" },
    platforms: [
      { id: "p3a", platformId: "croma", name: "Croma", logo: "/platforms/croma.svg", price: 114900, originalPrice: 114900, effectivePrice: 104900, url: "https://croma.com", inStock: true, bankOffers: ["10000 instant discount on SBI"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 114900, platform: "Croma" }],
    decision: { 
      decision: "HOLD", 
      confidence: 60, 
      score: 55,
      verdict: "STABLE MARKET",
      reasoning: "Price is stable, no immediate drops expected.", 
      expectedMovement: "Stable", 
      timeWindow: "60 days",
      percentile: 45,
      volatility: 3,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 112000,
      overpriceAmount: 2900
    },
    trend: "stable",
    lowestPrice: 104900, highestPrice: 114900, averagePrice: 109900, currentBestPrice: 104900, currentBestPlatform: "Croma", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "4",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1707243785311-66779435a266?w=800&q=80",
    description: "The ultimate AI phone from Samsung.",
    specifications: { Display: "6.8-inch Dynamic AMOLED 2X", Processor: "Snapdragon 8 Gen 3", Storage: "512GB" },
    platforms: [
      { id: "p4a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 129999, originalPrice: 139999, effectivePrice: 119999, url: "https://amazon.in", inStock: true, bankOffers: ["10000 off on HDFC"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 129999, platform: "Amazon" }],
    decision: { 
      decision: "BUY", 
      confidence: 90, 
      score: 88,
      verdict: "STRONG BUY",
      reasoning: "Solid discount on a relatively new flagship.", 
      expectedMovement: "Stable", 
      timeWindow: "15 days",
      percentile: 15,
      volatility: 6,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 125000,
      overpriceAmount: 0
    },
    trend: "down",
    lowestPrice: 119999, highestPrice: 139999, averagePrice: 129999, currentBestPrice: 119999, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "5",
    name: "Sony Bravia XR A80L OLED",
    brand: "Sony",
    category: "TVs",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
    description: "Stunning OLED picture quality with Cognitive Processor XR.",
    specifications: { Size: "65-inch", Resolution: "4K UHD", RefreshRate: "120Hz" },
    platforms: [
      { id: "p5a", platformId: "reliance", name: "Reliance Digital", logo: "/platforms/reliance.svg", price: 219900, originalPrice: 349900, effectivePrice: 209900, url: "https://reliancedigital.in", inStock: true, bankOffers: ["10000 off on Kotak"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 219900, platform: "Reliance Digital" }],
    decision: { 
      decision: "BUY", 
      confidence: 92, 
      score: 91,
      verdict: "STRONG BUY",
      reasoning: "Deepest discount since launch.", 
      expectedMovement: "Stable", 
      timeWindow: "30 days",
      percentile: 8,
      volatility: 12,
      isShieldProtected: true,
      isFakeSale: false,
      fairValue: 215000,
      overpriceAmount: 0
    },
    trend: "down",
    lowestPrice: 209900, highestPrice: 349900, averagePrice: 229900, currentBestPrice: 209900, currentBestPlatform: "Reliance Digital", isShieldProtected: true,
    verificationState: "VERIFIED"
  },
  {
    id: "6",
    name: "PlayStation 5 Slim",
    brand: "Sony",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    description: "The new slimmer PS5 with 1TB storage.",
    specifications: { Storage: "1TB SSD", Resolution: "4K", Connectivity: "HDMI 2.1" },
    platforms: [
      { id: "p6a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 54990, originalPrice: 54990, effectivePrice: 49990, url: "https://amazon.in", inStock: true, bankOffers: ["5000 off on select cards"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 54990, platform: "Amazon" }],
    decision: { 
      decision: "WAIT", 
      confidence: 75, 
      score: 42,
      verdict: "WAIT FOR DROP",
      reasoning: "Upcoming Summer Sale expected to bring prices down.", 
      expectedMovement: "Drop by ₹5,000", 
      timeWindow: "14 days",
      percentile: 75,
      volatility: 4,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 51000,
      overpriceAmount: 3990
    },
    trend: "stable",
    lowestPrice: 49990, highestPrice: 54990, averagePrice: 52490, currentBestPrice: 49990, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "7",
    name: "LG C3 55-inch OLED",
    brand: "LG",
    category: "TVs",
    image: "https://images.unsplash.com/photo-1552284146-24e548545892?w=800&q=80",
    description: "The gold standard for gaming and movie OLED TVs.",
    specifications: { Size: "55-inch", Resolution: "4K OLED", Features: "G-Sync, FreeSync" },
    platforms: [
      { id: "p7a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 139990, originalPrice: 199990, effectivePrice: 129990, url: "https://amazon.in", inStock: true, bankOffers: ["10000 off on SBI"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 139990, platform: "Amazon" }],
    decision: { 
      decision: "BUY", 
      confidence: 88, 
      score: 85,
      verdict: "STRONG BUY",
      reasoning: "Clearance pricing before C4 arrives.", 
      expectedMovement: "Stable", 
      timeWindow: "21 days",
      percentile: 12,
      volatility: 9,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 135000,
      overpriceAmount: 0
    },
    trend: "down",
    lowestPrice: 129990, highestPrice: 199990, averagePrice: 149990, currentBestPrice: 129990, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "8",
    name: "Asus Vivobook 16X",
    brand: "Asus",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    description: "Performance meets portability with RTX 4050.",
    specifications: { Processor: "Ryzen 7 5800H", GPU: "RTX 4050", RAM: "16GB" },
    platforms: [
      { id: "p8a", platformId: "flipkart", name: "Flipkart", logo: "/platforms/flipkart.svg", price: 74990, originalPrice: 89990, effectivePrice: 69990, url: "https://flipkart.com", inStock: true, bankOffers: ["5000 off on Axis"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 74990, platform: "Flipkart" }],
    decision: { 
      decision: "BUY", 
      confidence: 94, 
      score: 93,
      verdict: "STRONG BUY",
      reasoning: "Lowest price for an RTX 4050 laptop.", 
      expectedMovement: "Rise", 
      timeWindow: "5 days",
      percentile: 3,
      volatility: 11,
      isShieldProtected: true,
      isFakeSale: false,
      fairValue: 78000,
      overpriceAmount: 0
    },
    trend: "up",
    lowestPrice: 69990, highestPrice: 89990, averagePrice: 79990, currentBestPrice: 69990, currentBestPlatform: "Flipkart", isShieldProtected: true,
    verificationState: "VERIFIED"
  },
  {
    id: "9",
    name: "AirPods Pro (2nd Gen) USB-C",
    brand: "Apple",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1588423770574-010425810c9c?w=800&q=80",
    description: "The best in-ear noise canceling for Apple users.",
    specifications: { Chip: "H2", Connectivity: "USB-C", Battery: "6 hours ANC" },
    platforms: [
      { id: "p9a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 19900, originalPrice: 24900, effectivePrice: 18900, url: "https://amazon.in", inStock: true, bankOffers: ["1000 off on HDFC"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 19900, platform: "Amazon" }],
    decision: { 
      decision: "BUY", 
      confidence: 91, 
      score: 89,
      verdict: "STRONG BUY",
      reasoning: "Consistently hovering at its lowest point.", 
      expectedMovement: "Stable", 
      timeWindow: "15 days",
      percentile: 10,
      volatility: 4,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 19500,
      overpriceAmount: 0
    },
    trend: "stable",
    lowestPrice: 18900, highestPrice: 24900, averagePrice: 20900, currentBestPrice: 18900, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "10",
    name: "Sony A7 IV Mirrorless Camera",
    brand: "Sony",
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    description: "The hybrid powerhouse for stills and video.",
    specifications: { Resolution: "33MP", Video: "4K 60p", AF: "Real-time Tracking" },
    platforms: [
      { id: "p10a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 204990, originalPrice: 214990, effectivePrice: 194990, url: "https://amazon.in", inStock: true, bankOffers: ["10000 off on HDFC"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 204990, platform: "Amazon" }],
    decision: { 
      decision: "HOLD", 
      confidence: 55, 
      score: 52,
      verdict: "STABLE MARKET",
      reasoning: "Price is standard. No big sales expected soon.", 
      expectedMovement: "Stable", 
      timeWindow: "90 days",
      percentile: 50,
      volatility: 2,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 200000,
      overpriceAmount: 4990
    },
    trend: "stable",
    lowestPrice: 194990, highestPrice: 214990, averagePrice: 204990, currentBestPrice: 194990, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "11",
    name: "Xbox Series X",
    brand: "Microsoft",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1621259182978-f09e5e24d584?w=800&q=80",
    description: "The most powerful Xbox ever.",
    specifications: { Power: "12 Teraflops", Storage: "1TB SSD", Features: "Quick Resume" },
    platforms: [
      { id: "p11a", platformId: "flipkart", name: "Flipkart", logo: "/platforms/flipkart.svg", price: 51990, originalPrice: 54990, effectivePrice: 47990, url: "https://flipkart.com", inStock: true, bankOffers: ["4000 off on HDFC"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 51990, platform: "Flipkart" }],
    decision: { 
      decision: "BUY", 
      confidence: 82, 
      score: 78,
      verdict: "BUY NOW",
      reasoning: "Better value than PS5 right now.", 
      expectedMovement: "Stable", 
      timeWindow: "14 days",
      percentile: 25,
      volatility: 7,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 50000,
      overpriceAmount: 1990
    },
    trend: "down",
    lowestPrice: 47990, highestPrice: 54990, averagePrice: 51990, currentBestPrice: 47990, currentBestPlatform: "Flipkart", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "12",
    name: "Pixel 8 Pro 128GB",
    brand: "Google",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1696426915152-6d27ecf539e6?w=800&q=80",
    description: "The best of Google AI in a phone.",
    specifications: { Display: "6.7-inch Actua Display", Chip: "Tensor G3", RAM: "12GB" },
    platforms: [
      { id: "p12a", platformId: "flipkart", name: "Flipkart", logo: "/platforms/flipkart.svg", price: 106999, originalPrice: 113999, effectivePrice: 96999, url: "https://flipkart.com", inStock: true, bankOffers: ["10000 off on ICICI"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 106999, platform: "Flipkart" }],
    decision: { 
      decision: "WAIT", 
      confidence: 80, 
      score: 38,
      verdict: "WAIT FOR DROP",
      reasoning: "Pixel 8a launch usually triggers a drop for Pro.", 
      expectedMovement: "Drop", 
      timeWindow: "30 days",
      percentile: 70,
      volatility: 9,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 102000,
      overpriceAmount: 4999
    },
    trend: "down",
    lowestPrice: 96999, highestPrice: 113999, averagePrice: 106999, currentBestPrice: 96999, currentBestPlatform: "Flipkart", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "13",
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "Smartwatches",
    image: "https://images.unsplash.com/photo-1544117518-30df57809b11?w=800&q=80",
    description: "Advanced health tracking on your wrist.",
    specifications: { Size: "44mm", Screen: "Sapphire Crystal", OS: "Wear OS" },
    platforms: [
      { id: "p13a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 24999, originalPrice: 29999, effectivePrice: 21999, url: "https://amazon.in", inStock: true, bankOffers: ["3000 off on HDFC"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 24999, platform: "Amazon" }],
    decision: { 
      decision: "BUY", 
      confidence: 87, 
      score: 84,
      verdict: "BUY NOW",
      reasoning: "Great value for a premium smartwatch.", 
      expectedMovement: "Stable", 
      timeWindow: "15 days",
      percentile: 20,
      volatility: 5,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 24000,
      overpriceAmount: 999
    },
    trend: "stable",
    lowestPrice: 21999, highestPrice: 29999, averagePrice: 25999, currentBestPrice: 21999, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "14",
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    description: "The gold standard of noise cancellation.",
    specifications: { Type: "Over-ear", Features: "Immersive Audio", Battery: "24 hours" },
    platforms: [
      { id: "p14a", platformId: "amazon", name: "Amazon", logo: "/platforms/amazon.svg", price: 33900, originalPrice: 35900, effectivePrice: 31900, url: "https://amazon.in", inStock: true, bankOffers: ["2000 off on SBI"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 33900, platform: "Amazon" }],
    decision: { 
      decision: "HOLD", 
      confidence: 65, 
      score: 62,
      verdict: "STABLE MARKET",
      reasoning: "Recent launch, prices aren't moving much yet.", 
      expectedMovement: "Stable", 
      timeWindow: "45 days",
      percentile: 40,
      volatility: 3,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 33000,
      overpriceAmount: 900
    },
    trend: "stable",
    lowestPrice: 31900, highestPrice: 35900, averagePrice: 33900, currentBestPrice: 31900, currentBestPlatform: "Amazon", isShieldProtected: false,
    verificationState: "VERIFIED"
  },
  {
    id: "15",
    name: "HP Spectre x360 2-in-1",
    brand: "HP",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=800&q=80",
    description: "The most beautiful 2-in-1 laptop with OLED.",
    specifications: { Screen: "14-inch OLED Touch", Processor: "Core Ultra 7", RAM: "16GB" },
    platforms: [
      { id: "p15a", platformId: "hp", name: "HP Store", logo: "/platforms/hp.svg", price: 164999, originalPrice: 174999, effectivePrice: 154999, url: "https://hp.com", inStock: true, bankOffers: ["10000 off on major cards"] }
    ],
    priceHistory: [{ date: "2024-05-01", price: 164999, platform: "HP Store" }],
    decision: { 
      decision: "WAIT", 
      confidence: 70, 
      score: 48,
      verdict: "WAIT FOR DROP",
      reasoning: "Back-to-school offers coming in July.", 
      expectedMovement: "Drop", 
      timeWindow: "60 days",
      percentile: 65,
      volatility: 6,
      isShieldProtected: false,
      isFakeSale: false,
      fairValue: 160000,
      overpriceAmount: 4999
    },
    trend: "stable",
    lowestPrice: 154999, highestPrice: 174999, averagePrice: 164999, currentBestPrice: 154999, currentBestPlatform: "HP Store", isShieldProtected: false,
    verificationState: "VERIFIED"
  }
];
