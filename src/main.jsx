// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App.jsx"; // <- explicit extension, avoids resolve issues
import "./index.css";

const rootElId = "root";
let mount = document.getElementById(rootElId);
if (!mount) {
  mount = document.createElement("div");
  mount.id = rootElId;
  document.body.appendChild(mount);
}
createRoot(document.getElementById(rootElId)).render(<App />);
