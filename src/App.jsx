// src/App.jsx
import React, { useState } from "react";
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";
import "./index.css"; // keep your existing CSS

/* Simple INR formatter */
const formatINR = (value) =>
  value.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    price: 200,
    img: freshImg,
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads."
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    price: 250,
    img: pickleImg,
    desc: "Tangy & spicy mushroom pickle made with traditional spices."
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    price: 600,
    img: dryImg,
    desc: "Premium sun-dried mushrooms — great for long-term storage & soups."
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    price: 450,
    img: powderImg,
    desc: "Finely ground mushroom powder — perfect for seasoning and gravies."
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    price: 120,
    img: wariyanImg,
    desc: "Traditional mushroom wadiyan — packed with flavor and nutrition."
  }
];

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <div style={{ fontFamily: "system-ui, Arial, sans-serif", padding: 12 }}>
      {/* Header with logo from public/ (no import) */}
      <header style={{ textAlign: "center", marginBottom: 18 }}>
        <img
          src="/anant_gill_logo.png"
          alt="Anant Gill Logo"
          style={{ maxWidth: 140, display: "block", margin: "0 auto 8px" }}
        />
        <h1 style={{ margin: "6px 0", color: "#127a3d" }}>
          Welcome to Anant Gill Agro Farm
        </h1>
        <p style={{ margin: 0, color: "#444" }}>
          Best quality fresh organic mushrooms & delicious pickles
        </p>
      </header>

      <main>
        <h2 style={{ marginTop: 18 }}>Our Products</h2>

        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            marginTop: 12
          }}
        >
          {productsList.map((p) => (
            <article
              key={p.id}
              style={{
                borderRadius: 10,
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                background: "#fff",
                padding: 16,
                minHeight: 320,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 160,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12
                }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                />
              </div>

              <h3 style={{ margin: "6px 0 8px", textAlign: "center" }}>{p.name}</h3>
              <p style={{ color: "#333", textAlign: "center", flex: 1 }}>{p.desc}</p>

              <div style={{ width: "100%", textAlign: "center", marginTop: 8 }}>
                <div style={{ fontWeight: 700, color: "#127a3d", marginBottom: 8 }}>
                  {formatINR(p.price)}
                </div>
                <button
                  onClick={() => addToCart(p)}
                  style={{
                    background: "#15803d",
                    color: "#fff",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: 8,
                    cursor: "pointer"
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Cart summary */}
        <aside style={{ marginTop: 28, borderTop: "1px solid #eee", paddingTop: 18 }}>
          <h2>Cart ({cart.length})</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {cart.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px dashed #eee"
                    }}
                  >
                    <span>
                      {c.name} — {formatINR(c.price)}
                    </span>
                    <div>
                      <button
                        onClick={() => removeFromCart(i)}
                        style={{
                          background: "transparent",
                          border: "1px solid #e11d48",
                          color: "#e11d48",
                          padding: "6px 10px",
                          borderRadius: 6,
                          cursor: "pointer"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>Total:</strong>
                <strong style={{ color: "#127a3d" }}>{formatINR(total)}</strong>
              </div>
            </div>
          )}
        </aside>
      </main>

      <footer style={{ marginTop: 30, textAlign: "center", color: "#666" }}>
        <small>© {new Date().getFullYear()} Anant Gill Agro Farm</small>
      </footer>
    </div>
  );
}
