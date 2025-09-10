import React from 'react';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f3b1d', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header with Logo */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src="/anant_gill_logo.png"
          alt="Anant Gill Agro Farm"
          style={{ width: 80, height: 'auto', objectFit: 'contain' }}
        />
        <h1 style={{ color: '#e6c79a', margin: 0 }}>ANANT GILL AGRO FARM</h1>
      </header>

      {/* Main Content */}
      <main style={{ marginTop: 30 }}>
        <h2 style={{ color: 'white' }}>Fresh Organic Mushrooms & Products</h2>
        <p style={{ color: 'white' }}>
          Welcome to Anant Gill Agro Farm. We sell fresh mushrooms, pickles, dry mushrooms, and mushroom powder.
        </p>

        {/* WhatsApp Order Button */}
        <a
          href="https://wa.me/918837554747?text=Hi%20Anant%20Gill%20Agro%20Farm,%20I%20want%20to%20place%20an%20order."
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
            marginTop: '12px',
          }}
        >
          📱 Order on WhatsApp
        </a>

        {/* Product List */}
        <section
          style={{
            marginTop: 30,
            background: 'rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          <h3>Sample Products</h3>
          <ul>
            <li>Fresh Mushrooms — ₹200 / kg</li>
            <li>Mushroom Pickle — ₹500 / kg</li>
            <li>Dry Mushrooms — ₹600 / 250g</li>
            <li>Mushroom Powder — ₹400 / 100g</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 40, color: 'white', fontSize: '14px' }}>
        © 2025 Anant Gill Agro Farm
      </footer>
    </div>
  );
}
