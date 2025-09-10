import React from 'react';
import logo from './assets/anant_gill_logo.png';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f3b1d', padding: '20px' }}>
      
      {/* Header with Logo */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src={logo} 
          alt="Anant Gill Agro Farm" 
          style={{ height: '60px' }} 
        />
        <h1 style={{ color: '#e6c79a', margin: 0 }}>ANANT GILL AGRO FARM</h1>
      </header>

      {/* Main Content */}
      <main style={{ marginTop: 30 }}>
        <h2 style={{ color: 'white' }}>Fresh Organic Mushrooms & Products</h2>
        <p style={{ color: 'white' }}>
          Welcome to Anant Gill Agro Farm. We sell fresh mushrooms, pickles, dry mushrooms, 
          and mushroom powder.
        </p>

        {/* WhatsApp Order Button */}
        <a
          href="https://wa.me/918837554747?text=Hi%20Anant%20Gill%20Agro%20Farm,%20I%20would%20like%20to%20place%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#25D366',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            marginTop: '12px'
          }}
        >
          📲 Order on WhatsApp
        </a>

        {/* Product List */}
        <section style={{ marginTop: 30, background: '#124d28', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: 'white' }}>Sample Products</h3>
          <ul style={{ color: 'white' }}>
            <li>Fresh Mushrooms — ₹200 / kg</li>
            <li>Mushroom Pickle — ₹500 / kg</li>
            <li>Dry Mushrooms — ₹600 / 250g</li>
            <li>Mushroom Powder — ₹400 / 100g</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 30, color: 'white' }}>
        © 2025 Anant Gill Agro Farm
      </footer>
    </div>
  );
}
