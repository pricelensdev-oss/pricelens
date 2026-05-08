/**
 * PriceLens Alpha Node: Silent Scanner
 * High-performance product identification for Amazon & Flipkart.
 */

const PRODUCT_SELECTORS = {
  amazon: {
    price: '#corePriceDisplay_desktop_feature_div .a-price-whole, #corePrice_desktop .a-price-whole',
    title: '#productTitle',
    id: '#ASIN'
  },
  flipkart: {
    price: '.Nx9bqj.C_PkhZ',
    title: '.B_NuCI',
    id: 'input[name="pid"]'
  }
};

class AlphaNode {
  constructor() {
    this.site = window.location.hostname.includes('amazon') ? 'amazon' : 'flipkart';
    this.container = null;
    this.shadow = null;
    this.init();
  }

  init() {
    console.log('🚀 PriceLens: Alpha Node Engaged.');
    this.scan();
    
    // Re-scan on navigation (for SPAs like Flipkart)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.scan();
      }
    }).observe(document, {subtree: true, childList: true});
  }

  async scan() {
    const productData = this.extractData();
    if (productData) {
      console.log('🎯 PriceLens: Product Identified.', productData.id);
      this.injectNode(productData);
      this.fetchVerdict(productData);
    }
  }

  extractData() {
    const selectors = PRODUCT_SELECTORS[this.site];
    const priceEl = document.querySelector(selectors.price);
    const titleEl = document.querySelector(selectors.title);
    
    if (!priceEl || !titleEl) return null;

    return {
      id: document.querySelector(selectors.id)?.value || location.pathname.split('/')[3],
      price: parseInt(priceEl.innerText.replace(/[^0-9]/g, '')),
      title: titleEl.innerText.trim(),
      url: window.location.href
    };
  }

  injectNode(data) {
    if (this.container) this.container.remove();

    this.container = document.createElement('div');
    this.container.id = 'pricelens-alpha-root';
    this.shadow = this.container.attachShadow({mode: 'closed'});

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .node {
        width: 14px;
        height: 14px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        backdrop-filter: blur(20px);
        cursor: pointer;
        transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        padding: 0 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .node:hover {
        width: 280px;
        height: 54px;
        border-radius: 16px;
        background: #0E0F11;
        border-color: rgba(255, 255, 255, 0.2);
        padding: 0 20px;
      }
      .pulse {
        min-width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.5s;
        margin-right: 0;
      }
      .node:hover .pulse {
        margin-right: 15px;
      }
      .content-wrapper {
        display: none;
        flex-direction: column;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s 0.2s;
      }
      .node:hover .content-wrapper {
        display: flex;
        opacity: 1;
      }
      .verdict {
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: white;
        margin-bottom: 2px;
      }
      .brief {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        font-style: italic;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }
      
      .status-buy { box-shadow: 0 0 25px rgba(5, 255, 204, 0.3); border-color: rgba(5, 255, 204, 0.3); }
      .status-buy .pulse { background: #05FFCC; box-shadow: 0 0 10px #05FFCC; }
      .status-buy .verdict { color: #05FFCC; }
      
      .status-avoid { box-shadow: 0 0 25px rgba(255, 60, 100, 0.3); border-color: rgba(255, 60, 100, 0.3); }
      .status-avoid .pulse { background: #FF3C64; box-shadow: 0 0 10px #FF3C64; }
      .status-avoid .verdict { color: #FF3C64; }
    `;

    const node = document.createElement('div');
    node.className = 'node';
    
    const pulse = document.createElement('div');
    pulse.className = 'pulse';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';
    
    const verdict = document.createElement('div');
    verdict.className = 'verdict';
    verdict.innerText = 'Checking...';
    
    const brief = document.createElement('div');
    brief.className = 'brief';
    brief.innerText = 'Analyzing price history';

    wrapper.appendChild(verdict);
    wrapper.appendChild(brief);
    node.appendChild(pulse);
    node.appendChild(wrapper);
    
    this.shadow.appendChild(style);
    this.shadow.appendChild(node);
    document.body.appendChild(this.container);
    
    this.node = node;
    this.verdictText = verdict;
    this.briefText = brief;
  }

  async fetchVerdict(data) {
    try {
      const response = await fetch('https://pricelens.in/api/extension/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.type === 'AVOID' || result.score < 40) {
        this.node.classList.add('status-avoid');
      } else if (result.type === 'BUY') {
        this.node.classList.add('status-buy');
      }
      
      this.verdictText.innerText = result.type === 'AVOID' ? 'DONT BUY' : result.type;
      this.briefText.innerText = result.brief || 'Analysis complete.';
    } catch (e) {
      console.error('PriceLens: Fetch Failed.', e);
      this.verdictText.innerText = 'Offline';
      this.briefText.innerText = 'Unable to check price.';
    }
  }
}

new AlphaNode();
