import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Restores your global stylesheet import

const rootEl = document.getElementById("root");

// Safety check for root element
if (!rootEl) {
  // This error should not happen since we fixed index.html, but keep the check.
  throw new Error('The root element with id="root" was not found in index.html.');
}

createRoot(rootEl).render(
  // Restores React StrictMode
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  
