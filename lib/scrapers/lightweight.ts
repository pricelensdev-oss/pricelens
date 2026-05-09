import { CanonicalProduct } from '../normalization';

/**
 * PriceLens Stage 1 Lightweight Scraper
 * Uses fetch + regex to extract data without a browser.
 * Perfect for Vercel Serverless environment.
 */

export async function scrapeLightweight(url: string): Promise<Partial<CanonicalProduct>> {
  const isFlipkart = url.includes('flipkart.com');
  const isAmazon = url.includes('amazon.in') || url.includes('amazon.com');

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  const html = await response.text();

  if (isFlipkart) {
    return scrapeFlipkartLight(html, url);
  } else if (isAmazon) {
    return scrapeAmazonLight(html, url);
  }

  throw new Error('Platform not supported for lightweight scraping');
}

function scrapeFlipkartLight(html: string, url: string): Partial<CanonicalProduct> {
  // Extract JSON-LD
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let productLd: any = {};
  
  if (jsonLdMatch) {
    try {
      const allLd = JSON.parse(jsonLdMatch[1]);
      productLd = Array.isArray(allLd) ? allLd.find(item => item['@type'] === 'Product') : allLd;
    } catch (e) {
      console.error("Failed to parse Flipkart JSON-LD");
    }
  }

  // Fallback for Title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = productLd?.name || (titleMatch ? titleMatch[1].split('|')[0].trim() : 'Unknown Product');

  // Extract Price
  let price = 0;
  if (productLd?.offers?.price) {
    price = parseInt(productLd.offers.price);
  } else {
    const priceMatch = html.match(/"price":"(\d+)"/);
    if (priceMatch) price = parseInt(priceMatch[1]);
  }

  // Extract Images
  const images: string[] = [];
  if (productLd?.image) {
    images.push(productLd.image);
  }
  
  // Extract PID/LID from URL
  const pid = new URL(url).searchParams.get('pid') ?? undefined;

  return {
    title,
    brand: productLd?.brand?.name || 'Flipkart',
    price,
    currency: 'INR',
    availability: html.includes('OUT_OF_STOCK') ? 'OUT_OF_STOCK' : 'IN_STOCK',
    images: images.length > 0 ? images : [],
    description: productLd?.description || '',
    metadata: {
      pid,
      category: productLd?.category
    }
  };
}

function scrapeAmazonLight(html: string, url: string): Partial<CanonicalProduct> {
  // Amazon is harder without a browser due to anti-bot
  // But we can try to extract basic info from meta tags
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace('Amazon.in: ', '').replace('Amazon.com: ', '').trim() : 'Amazon Product';

  const priceMatch = html.match(/<span class="a-price-whole">(\d+)(?:<\/span>|<span)/);
  const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;

  return {
    title,
    brand: 'Amazon',
    price,
    currency: 'INR',
    availability: html.includes('out of stock') ? 'OUT_OF_STOCK' : 'IN_STOCK',
    images: [],
    description: '',
    metadata: {
      asin: url.match(/\/dp\/([A-Z0-9]{10})/)?.[1]
    }
  };
}
