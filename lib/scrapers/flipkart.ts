import { createStealthPage } from './engine';
import { CanonicalProduct } from '../normalization';

/**
 * Flipkart High-Fidelity Scraper
 * Logic: JSON-LD > Embedded Scripts > Meta Tags > DOM
 */

export async function scrapeFlipkart(url: string): Promise<Partial<CanonicalProduct>> {
  const { page, cleanup } = await createStealthPage(url);
  
  try {
    // 1. Extract Structured Data (JSON-LD)
    const jsonLd = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      return scripts.map(s => JSON.parse(s.textContent || '{}'));
    });

    const productLd = jsonLd.find(item => item['@type'] === 'Product' || item['@type'] === 'http://schema.org/Product');

    // 2. Extract Embedded Page Data (for variants and LID)
    const pageData = await page.evaluate(() => {
      // Flipkart often stores state in a global object
      return (window as any).__INITIAL_STATE__ || {};
    });

    // 3. Extract High-Res Images from the Carousel
    const images = await page.evaluate(() => {
      const imgElements = Array.from(document.querySelectorAll('img[src*="image/"]'));
      return imgElements
        .map(img => (img as HTMLImageElement).src.replace(/q=\d+/, 'q=90')) // Boost quality
        .filter(src => src.includes('rukminim2.flixcart.com'))
        .slice(0, 5);
    });

    // 4. Map to Internal Schema
    return {
      title: productLd?.name || await page.title(),
      brand: productLd?.brand?.name || 'Flipkart',
      price: parseInt(productLd?.offers?.price || '0'),
      currency: productLd?.offers?.priceCurrency || 'INR',
      availability: productLd?.offers?.availability?.includes('InStock') ? 'IN_STOCK' : 'OUT_OF_STOCK',
      images: images.length > 0 ? images : [productLd?.image],
      description: productLd?.description || '',
      seller: productLd?.offers?.seller?.name || 'Flipkart Seller',
      rating: parseFloat(productLd?.aggregateRating?.ratingValue || '0'),
      reviewCount: parseInt(productLd?.aggregateRating?.reviewCount || '0'),
      metadata: {
        pid: new URL(url).searchParams.get('pid') ?? undefined,
        lid: new URL(url).searchParams.get('lid') ?? undefined,
        category: productLd?.category
      }
    };
  } finally {
    await cleanup();
  }
}
