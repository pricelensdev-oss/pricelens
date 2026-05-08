import { chromium, Browser, Page } from 'playwright';

/**
 * PriceLens Stealth Browser Engine
 * Foundation for high-fidelity Stage 2 extraction.
 */

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (browserInstance) return browserInstance;

  browserInstance = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  return browserInstance;
}

export async function createStealthPage(url: string): Promise<{ page: Page, cleanup: () => Promise<void> }> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  
  // Stealth: Mask automation signatures
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  const cleanup = async () => {
    await page.close();
    await context.close();
  };

  return { page, cleanup };
}

/**
 * Graceful shutdown for the browser instance.
 */
export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
