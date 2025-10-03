import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // <--- RESTORED: This line must be present.

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error('The root element with id="root" was not found in index.html.');
}

createRoot(rootEl).render(
  <React.StrictMode> // <--- RESTORED: This should be present.
    <App />
  </React.StrictMode>
);
    
