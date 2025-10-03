// src/main.jsx - FINAL, FINAL TEST

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import "./index.css"; // KEEP COMMENTED OUT
// (The rest of your file is below)

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('No root element found. Make sure index.html has a root element.');
}

createRoot(rootEl).render(
  // <React.StrictMode> <--- COMMENT THIS OUT
    <App />
  // </React.StrictMode> <--- COMMENT THIS OUT
);
