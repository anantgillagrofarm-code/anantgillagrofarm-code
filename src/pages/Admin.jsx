// src/pages/Admin.jsx
import React from 'react';

export default function Admin() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel (placeholder)</h2>
      <p>
        When Firebase is connected and <code>VITE_FIREBASE_ENABLED</code> is set to <code>true</code>,
        this area will let you add/edit products, change prices and stock.
      </p>
      <p>
        To enable: add your Firebase values to Vercel as <code>VITE_FIREBASE_*</code> env vars and set
        <code> VITE_FIREBASE_ENABLED</code> to <code>true</code>.
      </p>
    </div>
  );
}
