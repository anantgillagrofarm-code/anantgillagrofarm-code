// src/App.jsx
import React, { useEffect, useState } from "react";
import "./index.css";

/*
  Simple product + cart demo.
  Images assumed to be in /public (so accessible at /fresh_mushrooms.jpg etc)
*/

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    price: 40,
    unit: "per 200g box",
    img: "/fresh_mushrooms.jpg",
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    price: 100,
    unit: "200g jar",
    img: "/mushroom_pickle.jpg",
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    desc: "Premium sun-dried mushrooms — great for soups & long storage.",
    price: 300,
    unit: "per 100g",
    img: "/dry_mushrooms.jpg",
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    desc: "Finely ground mushroom powder — perfect for seasoning.",
    price: 450,
    unit: "per 100g",
    img: "/mushroom_powder.jpg",
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    desc: "Traditional mushroom wadiyan — tasty & nutritious.",
    price: 120,
    unit: "per 100g packet",
    img: "/mushroom_wariyan.jpg",
  },
];

export default function App() {
  const [cart, setCart] = useState({}); // {productId: qty}
  const [cartOpen, setCartOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState(null); // product shown in sheet (quantity/options)
  const [showLargeGallery, setShowLargeGallery] = useState(false);

  // Lock body scroll when sheet or cart open
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  const addToCart = (id, qty = 1) => {
    setCart((prev) => {
      const cur = prev[id] || 0;
      return { ...prev, [id]: cur + qty };
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => ({ ...prev, [id]: qty }));
  };

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  return (
    <div className="app-root">
      {/* background is from CSS (uses public/bg-mushrooms.jpg) */}
      <header className="site-header">
        <div className="logo-row">
          <img src="/anant_gill_logo.png" alt="logo" className="site-logo" />
          <div className="site-title">
            <h1>Anant Gill Agro Farm</h1>
            <p className="tag">Best quality fresh organic mushrooms & delicious pickles</p>
          </div>
          <button
            className="cart-button"
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
          >
            Cart
          </button>
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">Our Products</h2>

        <div className="products-grid">
          {PRODUCTS.map((p) => (
            <article key={p.id} className="product-card">
              <div
                className="product-thumb"
                onClick={() => {
                  setSheetProduct(p);
                  // prevent opening the large gallery automatically
                  setShowLargeGallery(false);
                }}
                role="button"
                tabIndex={0}
              >
                <img src={p.img} alt={p.title} />
              </div>

              <div className="product-body">
                <h3>{p.title}</h3>
                <p className="muted">{p.desc}</p>
                <div className="product-footer">
                  <div>
                    <div className="price">₹{p.price}</div>
                    <div className="unit">{p.unit}</div>
                  </div>
                  <div>
                    <button
                      className="add-btn"
                      onClick={() => {
                        // open product sheet with options instead of instantly adding
                        setSheetProduct(p);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="cart-summary">
          <h3>Cart</h3>
          {Object.keys(cart).length === 0 ? (
            <div className="card empty">Your cart is empty</div>
          ) : (
            <div className="card">
              {Object.entries(cart).map(([id, qty]) => {
                const p = PRODUCTS.find((x) => x.id === id);
                return (
                  <div key={id} className="cart-line">
                    <div className="cart-line-left">
                      <strong>{p.title}</strong>
                      <div className="muted">Qty: {qty}</div>
                    </div>
                    <div className="cart-line-right">
                      <div>₹{p.price * qty}</div>
                      <button onClick={() => removeFromCart(id)} className="small-x">✕</button>
                    </div>
                  </div>
                );
              })}
              <div className="cart-subtotal">Subtotal: ₹{subtotal}</div>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Product sheet (bottom sheet/modal) */}
      {sheetProduct && (
        <div className="sheet-wrap" onClick={() => setSheetProduct(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setSheetProduct(null)}>
              ✕
            </button>
            <div className="sheet-body">
              <img src={sheetProduct.img} alt={sheetProduct.title} />
              <h3>{sheetProduct.title}</h3>
              <p className="muted">{sheetProduct.desc}</p>

              <div className="sheet-controls">
                <button
                  onClick={() => {
                    addToCart(sheetProduct.id, 1);
                    setSheetProduct(null);
                  }}
                  className="add-btn big"
                >
                  Add 1 to Cart
                </button>

                <button
                  className="text-btn"
                  onClick={() => {
                    // open a larger gallery view for images (if you want)
                    setShowLargeGallery(true);
                  }}
                >
                  View images
                </button>
              </div>

              {showLargeGallery && (
                <div className="gallery">
                  <img src={sheetProduct.img} alt="gallery" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cart-panel" role="dialog" aria-label="Cart">
          <button
            className="drawer-close"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>

          <h3>Cart</h3>
          <div className="muted">Your cart is {Object.keys(cart).length === 0 ? "empty" : ""}</div>

          {Object.keys(cart).length === 0 ? null : (
            <div className="cart-items">
              {Object.entries(cart).map(([id, qty]) => {
                const p = PRODUCTS.find((x) => x.id === id);
                return (
                  <div key={id} className="cart-item">
                    <img src={p.img} alt={p.title} />
                    <div className="cart-item-info">
                      <div>{p.title}</div>
                      <div className="muted">₹{p.price} • {qty} pcs</div>
                    </div>
                    <div className="cart-item-actions">
                      <button onClick={() => updateQty(id, Math.max(0, qty - 1))}>-</button>
                      <div>{qty}</div>
                      <button onClick={() => updateQty(id, qty + 1)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="cart-checkout">
            <div className="subtotal">Subtotal ₹{subtotal.toFixed(2)}</div>
            <button className="checkout-btn">Checkout (placeholder)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Footer component */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="contact-block">
          <h4>Contact</h4>
          <div className="muted">Phone: <a href="tel:+918837554747">+91 88375 54747</a></div>
          <div className="muted">Email: <a className="emph" href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
          <div className="muted address">Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</div>
        </div>

        <div className="follow-block">
          <h4>Follow</h4>
          <div className="social-icons">
            <a href="#" aria-label="Instagram" title="Instagram" className="social"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm6.2-3.3a1 1 0 1 0 1 1 1 1 0 0 0-1-1z"/></svg></a>
            <a href="#" aria-label="Facebook" title="Facebook" className="social"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.9v-2.9h1.6V9.7c0-1.6 1-2.5 2.4-2.5.7 0 1.4.1 1.4.1V9h-0.8c-0.8 0-1 0.5-1 1v1.3h1.8l-0.3 2.9h-1.5v7A10 10 0 0 0 22 12z"/></svg></a>
          </div>
        </div>

        <div className="copyright">
          © 2025 Anant Gill Agro Farm
          {/* single contact reference only — bottom phone removed as requested */}
        </div>
      </div>
    </footer>
  );
}
