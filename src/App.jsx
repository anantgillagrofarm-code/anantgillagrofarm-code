// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/*
 Replace address and contact values directly here if needed.
 Images must be in public/ folder:
  - /bg-mushrooms.jpg (already referenced in index.css)
  - /footer-mushrooms.jpg (already referenced in index.css)
  - product images used below should be in src/assets or public and the paths matched.
*/

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    price: 40,
    unit: "per 200g box",
    image: "/fresh_mushrooms.jpg" // copy to public/ OR adjust to /src/assets/...
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    price: 100,
    unit: "200g jar",
    image: "/mushroom_pickle.jpg"
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    price: 450,
    unit: "per 100g",
    image: "/dry_mushrooms.jpg"
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    price: 450,
    unit: "per 100g",
    image: "/mushroom_powder.jpg"
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    price: 120,
    unit: "per 100g packet",
    image: "/mushroom_wariyan.jpg"
  }
];

export default function App() {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState(null);

  // body scroll lock when drawer or sheet open
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  function addToCart(productId, qty = 1) {
    setCart((c) => {
      const copy = { ...c };
      copy[productId] = (copy[productId] || 0) + qty;
      return copy;
    });
    setCartOpen(true);
  }

  function removeFromCart(productId) {
    setCart((c) => {
      const copy = { ...c };
      delete copy[productId];
      return copy;
    });
  }

  function subtotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);
  }

  return (
    <div className="app-root">
      <header className="header">
        <div className="logo">
          <img src="/anant_gill_logo.png" alt="logo" />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Anant Gill Agro Farm</div>
            <div style={{ color: "var(--muted)" }}>Best quality fresh organic mushrooms & delicious pickles</div>
          </div>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => setCartOpen(true)} className="btn">Cart</button>
        </div>
      </header>

      <main style={{ marginTop: 18 }}>
        <h3 style={{ margin: "12px 0" }}>Our Products</h3>
        <section className="products">
          {PRODUCTS.map((p) => (
            <article className="card" key={p.id}>
              <div
                className="img"
                onClick={() => setSheetProduct(p)}
                style={{ cursor: "pointer" }}
                aria-hidden
              >
                <img src={p.image} alt={p.title} />
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "6px 0" }}>{p.title}</h4>
                <div className="small-muted">{p.unit}</div>
                <div className="price">₹{p.price}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button className="btn" onClick={() => addToCart(p.id)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Cart Drawer */}
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        <h3>Cart</h3>
        <div style={{ marginTop: 12 }}>
          {Object.keys(cart).length === 0 && <div className="small-muted">Your cart is empty</div>}
          {Object.entries(cart).map(([id, qty]) => {
            const p = PRODUCTS.find((x) => x.id === id);
            if (!p) return null;
            return (
              <div key={id} style={{ marginBottom: 12, display: "flex", gap: 10, alignItems: "center" }}>
                <img src={p.image} alt={p.title} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div className="small-muted">Qty: {qty}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>₹{p.price * qty}</div>
                  <button style={{ marginTop: 6 }} onClick={() => removeFromCart(id)} className="btn">Remove</button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="small-muted">Subtotal</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>₹{subtotal().toFixed(2)}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <button className="btn">Checkout (placeholder)</button>
        </div>
      </aside>

      {/* Backdrop when either sheet or cart open */}
      {(sheetProduct || cartOpen) && <div className={`modal-backdrop ${sheetProduct || cartOpen ? "show" : ""}`} onClick={() => { setSheetProduct(null); setCartOpen(false); }}></div>}

      {/* Product Sheet (opened when clicking product image) */}
      <div className={`sheet ${sheetProduct ? "open" : ""}`} role="dialog" aria-hidden={!sheetProduct}>
        {sheetProduct && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setSheetProduct(null)} className="cart-close">✕</button>
              <h3 style={{ margin: 0 }}>{sheetProduct.title}</h3>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <div style={{ flexBasis: 200, flexShrink: 0 }}>
                <img src={sheetProduct.image} alt={sheetProduct.title} style={{ width: "100%", borderRadius: 10 }} />
              </div>
              <div>
                <p className="small-muted">{sheetProduct.unit}</p>
                <p style={{ fontWeight: 800, marginTop: 6 }}>₹{sheetProduct.price}</p>

                <div style={{ marginTop: 12 }}>
                  <button onClick={() => addToCart(sheetProduct.id)} className="btn">Add to cart</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="content">
          <div className="footer-contact">
            <h4 style={{ marginTop: 0 }}>Contact</h4>
            <p>Phone: <a href="tel:+918837554747">+91 88375 54747</a></p>
            <p>Email: <a href="mailto:anantgillagrofarm@gmail.com" style={{ color: "#fff" }}>anantgillagrofarm@gmail.com</a></p>
            <p>Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</p>
          </div>

          <div style={{ flex: "0 0 220px" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Follow</div>
            <div className="social-icons">
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Facebook">FB</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2025 Anant Gill Agro Farm</div>
          {/* removed duplicate phone as requested */}
        </div>
      </footer>
    </div>
  );
}
