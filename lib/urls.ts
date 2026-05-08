/**
 * PriceLens URL Intelligence Layer
 * Deterministic extraction of marketplace identifiers.
 */

export interface MarketplaceIdentity {
  platform: 'amazon' | 'flipkart' | 'unknown';
  externalId: string; // PID or ASIN
  listingId?: string; // Flipkart LID
  slug?: string;
}

export function parseMarketplaceUrl(url: string): MarketplaceIdentity {
  const urlObj = new URL(url);
  const host = urlObj.hostname.toLowerCase();

  if (host.includes('amazon.in') || host.includes('amazon.com')) {
    return parseAmazonUrl(urlObj);
  } else if (host.includes('flipkart.com')) {
    return parseFlipkartUrl(urlObj);
  }

  return { platform: 'unknown', externalId: '' };
}

function parseFlipkartUrl(url: URL): MarketplaceIdentity {
  // Pattern: flipkart.com/slug/p/itmd...pid=PID&lid=LID
  const pid = url.searchParams.get('pid') || '';
  const lid = url.searchParams.get('lid') || '';
  const pathParts = url.pathname.split('/');
  const slug = pathParts[1] || '';

  return {
    platform: 'flipkart',
    externalId: pid,
    listingId: lid,
    slug
  };
}

function parseAmazonUrl(url: URL): MarketplaceIdentity {
  // Pattern: amazon.in/slug/dp/ASIN
  const pathParts = url.pathname.split('/');
  const dpIndex = pathParts.indexOf('dp');
  let asin = '';

  if (dpIndex !== -1 && pathParts[dpIndex + 1]) {
    asin = pathParts[dpIndex + 1];
  } else {
    // Check for /gp/product/ASIN
    const gpIndex = pathParts.indexOf('product');
    if (gpIndex !== -1 && pathParts[gpIndex + 1]) {
      asin = pathParts[gpIndex + 1];
    }
  }

  return {
    platform: 'amazon',
    externalId: asin,
  };
}
