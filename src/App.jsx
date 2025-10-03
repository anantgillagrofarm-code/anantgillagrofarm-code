// src/App.jsx - FINAL FIX: Correctly separating public vs. imported assets

import React, { useEffect, useState } from "react";
// 🛑 IMPORTANT: Only importing product images that are in src/assets
import freshMushroomsImg from "./assets/fresh_mushrooms.jpg"; 
import dryMushroomsImg from "./assets/dry_mushrooms.jpg"; 
import mushroomPickleImg from "./assets/mushroom_pickle.jpg"; 
import mushroomPowderImg from "./assets/mushroom_powder.jpg"; 
import "./index.css"; 


// 🛑 Path to the logo, since it's in the /public folder
const PUBLIC_LOGO_PATH = "/anant_gill_logo.png";
// 🛑 Path to the footer background, since it's in the /public folder
const FOOTER_BG_PATH = "/footer-mushrooms-v2.jpg";


const sampleProducts = [
  {
    id: "m1",
    title: "Fresh Mushrooms (500g)",
    desc: "Cleaned and packed fresh mushrooms — perfect for cooking.",
    unit: "500g",
    price: 120,
    img: freshMushroomsImg, 
  },
  {
    id: "m2",
    title: "Dried Mushrooms (100g)",
    desc: "Rich flavour dried mushrooms for long shelf life.",
    unit: "100g",
    price: 220,
    img: dryMushroomsImg, 
  },
  {
    id: "m3",
    title: "Mushroom Pickle (Jar)",
    desc: "Tangy mushroom pickle made in-house.",
    unit: "300g",
    price: 180,
    img: mushroomPickleImg, 
  },
  {
    id: "m4",
    title: "Mushroom Powder (200g)",
    desc: "Powdered mushrooms for soups, sauces and seasoning.",
    unit: "200g",
    price: 350,
    img: mushroomPowderImg, 
  },
];

/* Small helper to format currency */
const fmt = (n) => `₹${n.toFixed(0)}`;

export default function App() {
  const [products, setProducts] = useState(sampleProducts);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // If you later want to fetch products from Firebase or an API, do it here.
  }, []);

  function addToCart(productId) {
    setCart((prev) => {
      const prevQty = prev[productId]?.qty || 0;
      return {
        ...prev,
        [productId]: { ...(products.find((p) => p.id === productId) || {}), qty: prevQty + 1 },
      };
    });
    setShowCart(true);
  }

  function removeFromCart(productId) {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[productId]) return next;
      next[productId].qty -= 1;
      if (next[productId].qty <= 0) delete next[productId];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, it) => s + (it.qty || 0), 0);
  const cartTotal = cartItems.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);

  return (
    <div className="app-root" style={{ minHeight: "100vh", background: "var(--bg, #f2fbf7)" }}>
      {/* Topbar */}
      <header
        className="topbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "#ffffffeb",
          position: "sticky",
          top: 0,
          zIndex: 90,
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <img
            src={PUBLIC_LOGO_PATH} // FIXED: Using public path for logo
            alt="logo"
            style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover" }}
            onError={(e) => {
              // fallback small inline svg if logo missing
              e.currentTarget.src =
                "data:image/svg+xml;utf8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='100%' height='100%' rx='10' fill='#e6f6ee'/><text x='50%' y='54%' font-size='18' text-anchor='middle' fill='#15542e' font-family='Arial' font-weight='700'>AG</text></svg>`
                );
            }}
          />
          <div>
            <h1 style={{ margin: 0, color: "#14502b", fontSize: 18 }}>Anant Gill Agro Farm</h1>
            <div style={{ color: "#7c8c82", fontSize: 12 }}>Quality mushrooms & preserves</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setShowCart((s) => !s)}
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
            aria-label="Toggle cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#15542e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1.6" fill="#15542e" />
              <circle cx="18" cy="20" r="1.6" fill="#15542e" />
            </svg>
            <span style={{ fontWeight: 600, color: "#154b2b" }}>Cart</span>
            <span style={{ background: "#15542e", color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 13 }}>{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main style={{ maxWidth: 980, margin: "18px auto", padding: "0 16px 80px" }}>
        <section
          style={{
            padding: 18,
            borderRadius: 12,
            background: "#ffffffe0",
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
            marginBottom: 18,
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 920 }}>
            <h2 style={{ margin: "6px 0 8px", color: "#15502b", fontSize: 26 }}>Fresh Mushrooms, Farm to Table</h2>
            <p style={{ color: "#556e64", margin: "6px 0 12px" }}>
              We grow, process and pack premium mushrooms in small batches — straight from our farm to your kitchen.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="#products"
              style={{
                background: "#15542e",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Shop Fresh
            </a>
            <a
              href="#about"
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.06)",
                padding: "10px 14px",
                borderRadius: 12,
                textDecoration: "none",
                color: "#15542e",
                fontWeight: 600,
              }}
            >
              About us
            </a>
          </div>
        </section>

        {/* Product list */}
        <section id="products" style={{ marginBottom: 18 }}>
          <h3 style={{ margin: "6px 6px 12px", color: "#15502b", fontSize: 22 }}>Our Products</h3>

          <div
            className="product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {products.map((p) => (
              <article
                key={p.id}
                className="product-card"
                style={{
                  background: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <div style={{ width: 140, height: 120, borderRadius: 10, overflow: "hidden", background: "#f7faf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={p.img}
                    alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = PUBLIC_LOGO_PATH; // Using public path as fallback
                    }}
                  />
                </div>

                <div style={{ paddingTop: 6, width: "100%" }}>
                  <h4 style={{ margin: "6px 0", color: "#14502b", fontSize: 16 }}>{p.title}</h4>
                  <div style={{ color: "#7c8c82", fontSize: 13 }}>{p.unit}</div>
                  <div style={{ color: "#556e64", margin: "8px 0", fontSize: 13 }}>{p.desc}</div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ color: "#14502b", fontWeight: 700, fontSize: 16 }}>{fmt(p.price)}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="detail-btn"
                        style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.06)", padding: "8px 10px", borderRadius: 10, cursor: "pointer" }}
                        onClick={() => alert("Product details coming soon")}
                      >
                        Details
                      </button>

                      <button
                        className="add-btn"
                        style={{
                          background: "#15542e",
                          color: "#fff",
                          border: "none",
                          padding: "10px 12px",
                          borderRadius: 12,
                          cursor: "pointer",
                        }}
                        onClick={() => addToCart(p.id)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" style={{ marginTop: 18, padding: 14, background: "#ffffffe0", borderRadius: 12 }}>
          <h3 style={{ margin: "6px 0 8px", color: "#15502b" }}>About Anant Gill Agro Farm</h3>
          <p style={{ color: "#556e64" }}>
            We cultivate mushrooms using sustainable practices. Our team focuses on hygiene, quality and consistency so you receive the best product every time.
          </p>
        </section>
      </main>

      {/* Mini cart / sheet */}
      {showCart && (
        <div
          className="sheet-overlay"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "rgba(0,0,0,0.35)",
            zIndex: 1200,
          }}
          onClick={() => setShowCart(false)}
        >
          <div
            className="sheet"
            style={{
              width: "100%",
              maxWidth: 720,
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              padding: 12,
              maxHeight: "92vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h4 style={{ margin: 0 }}>Your Cart ({cartCount})</h4>
              <button onClick={() => setShowCart(false)} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {cartItems.length === 0 && <div style={{ color: "#666" }}>Cart is empty — add items to continue.</div>}

              {cartItems.map((it) => (
                <div key={it.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 8, borderRadius: 10, border: "1px solid #f0f0f0" }}>
                  <img src={it.img} alt={it.title} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} onError={(e) => (e.currentTarget.src = PUBLIC_LOGO_PATH)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#14502b" }}>{it.title}</div>
                    <div style={{ color: "#7c8c82", fontSize: 13 }}>{fmt(it.price)} × {it.qty}</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button onClick={() => addToCart(it.id)} style={{ padding: "6px 8px", borderRadius: 8, background: "#15542e", color: "#fff", border: "none" }}>
                      +
                    </button>
                    <button onClick={() => removeFromCart(it.id)} style={{ padding: "6px 8px", borderRadius: 8, background: "#eee", border: "none" }}>
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: "#14502b" }}>Total: {fmt(cartTotal)}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={clearCart} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", padding: "10px 12px", borderRadius: 10 }}>
                  Clear
                </button>
                <button
                  onClick={() => alert("Checkout flow will be added later")}
                  style={{ background: "#15542e", color: "#fff", padding: "10px 14px", borderRadius: 10, border: "none" }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="site-footer"
        style={{
          color: "#fff",
          background: `linear-gradient(#00000073,#00000073), url(${FOOTER_BG_PATH}) center / cover no-repeat`, // FIXED: Using public path
          padding: "26px 14px",
          marginTop: 28,
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", gap: 18, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <img src={PUBLIC_LOGO_PATH} alt="logo" style={{ width: 56, height: 56, borderRadius: 8, marginBottom: 10 }} />
            <h4 style={{ margin: 0, color: "#fff", fontSize: 18 }}>Anant Gill Agro Farm</h4>
            <div style={{ color: "#fffffff2", marginTop: 8 }}>
              Contact: <a href="tel:+91-9999999999" style={{ color: "#fff" }}>+91 99999 99999</a>
            </div>
            <div style={{ color: "#ffffffe6", marginTop: 8 }}>Address: Near XYZ, Your City, India</div>
          </div>

          <div style={{ flex: "0 0 170px", textAlign: "center", color: "#fff" }}>
            <div style={{ marginBottom: 8 }}>Follow us</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <a className="social-btn" href="#" style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.12)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>f</a>
              <a className="social-btn" href="#" style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.12)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>I</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
      }
          
