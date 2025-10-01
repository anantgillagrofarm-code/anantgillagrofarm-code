// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";    // <-- important: points to src/pages/App.jsx
import "./index.css";

const mount = document.getElementById("root");
if (!mount) {
  // fallback: create a root element if missing (helps static test pages)
  const el = document.createElement("div");
  el.id = "root";
  document.body.appendChild(el);
}
createRoot(document.getElementById("root")).render(<App />);
