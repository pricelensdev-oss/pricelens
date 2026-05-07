import * as React from 'react';

interface PriceAlertEmailProps {
  productName: string;
  currentPrice: number;
  targetPrice: number;
  productImage: string;
  productUrl: string;
}

export const PriceAlertEmail: React.FC<Readonly<PriceAlertEmailProps>> = ({
  productName,
  currentPrice,
  targetPrice,
  productImage,
  productUrl,
}) => (
  <div style={{
    fontFamily: 'sans-serif',
    backgroundColor: '#08080c',
    color: '#f8fafc',
    padding: '40px 20px',
    borderRadius: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  }}>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <div style={{ 
        display: 'inline-block',
        backgroundColor: 'oklch(0.82 0.18 195)',
        color: '#08080c',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.2em'
      }}>
        PriceLens Intelligence
      </div>
    </div>

    <h1 style={{ 
      fontSize: '24px', 
      textAlign: 'center', 
      marginBottom: '10px',
      letterSpacing: '-0.02em'
    }}>
      Target Price Reached!
    </h1>
    
    <p style={{ 
      color: 'rgba(248, 250, 252, 0.6)', 
      textAlign: 'center', 
      fontSize: '14px',
      marginBottom: '30px'
    }}>
      The market has reached your configured target for {productName}.
    </p>

    <div style={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '30px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img 
          src={productImage} 
          alt={productName} 
          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} 
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '10px', color: 'rgba(248, 250, 252, 0.4)', textTransform: 'uppercase', marginBottom: '4px' }}>Target</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{targetPrice.toLocaleString()}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', color: 'oklch(0.82 0.18 195)', textTransform: 'uppercase', marginBottom: '4px' }}>Current Price</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'oklch(0.82 0.18 195)' }}>₹{currentPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>

    <div style={{ textAlign: 'center' }}>
      <a href={productUrl} style={{
        display: 'inline-block',
        backgroundColor: 'oklch(0.82 0.18 195)',
        color: '#08080c',
        padding: '16px 32px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Buy Now
      </a>
    </div>

    <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', textAlign: 'center' }}>
      <p style={{ fontSize: '10px', color: 'rgba(248, 250, 252, 0.3)' }}>
        © {new Date().getFullYear()} PriceLens. All rights reserved. <br />
        You received this email because you set a price monitor for this product.
      </p>
    </div>
  </div>
);
