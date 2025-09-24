// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/*
  Single-file app component.
  Images should be in src/assets/ with the names used below.
*/

import imgFresh from "./assets/fresh_mushrooms.jpg";
import imgPickle from "./assets/mushroom_pickle.jpg";
import imgDry from "./assets/dry_mushrooms.jpg";
import imgPowder from "./assets/mushroom_powder.jpg";
import imgWariyan from "./assets/mushroom_wariyan.jpg";

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    price: 50,
    unit: "per 200g box",
    short: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    image: imgFresh,
    variants: [
      { id: "box200", label: "1 box (200 g)", price: 50 },
      { id: "kg", label: "1 kg", price: 200 },
    ],
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    price: 100,
    unit: "per 200g jar",
    short: "Tangy & spicy mushroom pickle made with traditional spices.",
    image: imgPickle,
    variants: [
      { id: "jar200", label: "200 g jar", price: 100 },
      { id: "jar400", label: "400 g jar", price: 200 },
    ],
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    price: 300,
    unit: "per 100g",
    short: "Dehydrated mushrooms, perfect for long-term storage and soups.",
    image: imgDry,
    variants: null,
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    price: 450,
    unit: "per 100g",
    short: "Finely ground mushroom powder — perfect for seasoning.",
    image: imgPowder,
    variants: null,
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    price: 120,
    unit: "per 100g packet",
    short: "Traditional mushroom wadiyan — tasty & nutritious.",
    image: imgWariyan,
    variants: null,
  },
];

function formatINR(n) {
  return `₹${n.toFixed ? n.toFixed(0) : n}`;
}

export default function App() {
  const [cart, setCart] = useState([]); // { productId, variantId?, qty }
  const [sheetProduct, setSheetProduct] = useState(null); // product being chosen (for variants)
  const [sheetVariant, setSheetVariant] = useState(null); // selected variant id in sheet
  const [miniVisible, setMiniVisible] = useState(false);

  // when the sheet OR the cart drawer is open, prevent body scrolling
  useEffect(() => {
    const shouldLock = !!sheetProduct;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct]);

  // Add to cart (public call)
  function handleAdd(product, variantId = null, qty = 1) {
    // if product has variants but no variantId supplied -> open sheet
    if (product.variants && !variantId) {
      setSheetProduct(product);
      setSheetVariant(product.variants[0].id);
      return;
    }

    // find price & label
    const variant = product.variants ? product.variants.find((v) => v.id === variantId) : null;
    const key = `${product.id}:${variant ? variant.id : "default"}`;

    setCart((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) {
        return prev.map((it) => (it.key === key ? { ...it, qty: it.qty + qty } : it));
      } else {
        return [
          ...prev,
          {
            key,
            productId: product.id,
            productTitle: product.title,
            variantId: variant ? variant.id : null,
            variantLabel: variant ? variant.label : null,
            price: variant ? variant.price : product.price,
            qty,
          },
        ];
      }
    });

    // show mini cart for a short moment
    setMiniVisible(true);
    setTimeout(() => setMiniVisible(true), 50);
  }

  function openSheetForProduct(product) {
    if (!product.variants) return;
    setSheetProduct(product);
    setSheetVariant(product.variants[0].id);
  }

  function closeSheet() {
    setSheetProduct(null);
    setSheetVariant(null);
  }

  function changeQty(key, delta) {
    setCart((prev) =>
      prev
        .map((it) => (it.key === key ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((it) => it.key !== key));
  }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  // when user confirms Add to Cart from sheet
  function confirmAddFromSheet() {
    if (!sheetProduct) return;
    handleAdd(sheetProduct, sheetVariant, 1);
    closeSheet();
  }

  // social links
  const fbUrl = "https://www.facebook.com/share/177NfwxRKr/"; // your facebook link
  const igUrl = "https://www.instagram.com/"; // replace if you have real IG link

  return (
    <div className="app">
      {/* Topbar */}
      <header className="topbar">
        <div className="brand">
          <img className="logo" src="/anant_gill_logo.png" alt="logo" />
          <div>
            <h1 className="title">Anant Gill Agro Farm</h1>
            <div className="subtitle">Best quality fresh organic mushrooms & delicious pickles</div>
          </div>
        </div>
        <button className="cart-button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
          Cart ({itemCount})
        </button>
      </header>

      {/* Content */}
      <main className="content">
        <h2 className="section-title">Our Products</h2>

        <div className="product-list">
          {PRODUCTS.map((p) => (
            <article key={p.id} className="product-card">
              <div className="product-media">
                <img src={p.image} alt={p.title} />
              </div>

              <div className="product-body">
                <h3>{p.title}</h3>
                <div className="unit">{p.unit}</div>
                <div className="short">{p.short}</div>

                <div className="price-row">
                  <div>
                    <div className="price">{formatINR(p.price)}</div>
                  </div>

                  <div className="actions">
                    <button
                      className="add-btn"
                      onClick={() => {
                        // if product has variants -> open sheet; else add immediately
                        if (p.variants) openSheetForProduct(p);
                        else handleAdd(p, null, 1);
                      }}
                    >
                      Add to Cart
                    </button>
                    {/* We removed the previous Details button — the short description is shown already */}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Inline Cart Box (below product list) */}
        <div className="cart-box">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            <>
              {cart.map((it) => (
                <div key={it.key} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>
                    {it.productTitle}
                    {it.variantLabel ? ` × ${it.variantLabel}` : it.variantLabel}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <button onClick={() => changeQty(it.key, -1)}>-</button>
                    <span style={{ margin: "0 8px" }}>{formatINR(it.price * it.qty)}</span>
                    <button onClick={() => changeQty(it.key, +1)}>+</button>
                    <button style={{ marginLeft: 10 }} onClick={() => removeItem(it.key)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <div>Subtotal</div>
                <div style={{ fontWeight: 700 }}>{formatINR(subtotal)}</div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-left">
            <img className="footer-logo" src="/anant_gill_logo.png" alt="logo" />
            <h4>Anant Gill Agro Farm</h4>
            <div className="contact-line">Phone: <a href="tel:+918837554747">+91 88375 54747</a></div>
            <div className="contact-line">Email: <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
            <div className="contact-line address">Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</div>
          </div>

          <div className="footer-right">
            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>Follow</div>
            <div className="socials">
              <a className="social-btn" href={fbUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                {/* FB icon (simple) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H12C9.79 3 8 4.79 8 7V10H5V13H8V21H11V13H14L15 10H11V7C11 6.45 11.45 6 12 6H15V3Z" fill="white"/>
                </svg>
              </a>
              <a className="social-btn" href={igUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                {/* IG icon (simple) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2H17C20 2 22 4 22 7V17C22 20 20 22 17 22H7C4 22 2 20 2 17V7C2 4 4 2 7 2Z" stroke="white" strokeWidth="1.2" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.2" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="white" />
                </svg>
              </a>
            </div>

            <div style={{ color: "rgba(255,255,255,0.95)", marginTop: 12 }}>© 2025 Anant Gill Agro Farm</div>
          </div>
        </div>
      </footer>

      {/* Mini-cart sticky bottom */}
      {itemCount > 0 && (
        <div className="mini-cart" style={{ display: miniVisible ? "flex" : "flex" }}>
          <div className="mini-left">
            <div style={{ fontWeight: 700 }}>{itemCount} item{itemCount>1?"s":""}</div>
            <div className="mini-sub">Subtotal {formatINR(subtotal)}</div>
          </div>
          <div>
            <button className="view-cart" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Sheet overlay for product variants */}
      {sheetProduct && (
        <div className="sheet-overlay" onClick={closeSheet}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <button style={{ borderRadius: 8 }} onClick={closeSheet}>✕</button>
            </div>

            <div style={{ padding: "8px 4px 24px" }}>
              <div className="sheet-image" style={{ marginBottom: 12 }}>
                <img src={sheetProduct.image} alt={sheetProduct.title} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 10 }} />
              </div>

              <h3 style={{ marginTop: 0 }}>{sheetProduct.title}</h3>
              <p style={{ color: "#556e64" }}>{sheetProduct.short}</p>

              <div style={{ marginTop: 12, fontWeight: 600 }}>Choose size / variant</div>

              <div style={{ marginTop: 8 }}>
                {sheetProduct.variants.map((v) => (
                  <label
                    key={v.id}
                    style={{
                      display: "block",
                      border: sheetVariant === v.id ? "2px solid #14502b" : "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 8,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={v.id}
                      checked={sheetVariant === v.id}
                      onChange={() => setSheetVariant(v.id)}
                      style={{ marginRight: 10 }}
                    />
                    <span style={{ fontWeight: 600 }}>{v.label}</span>
                    <div style={{ color: "#556e64" }}>{formatINR(v.price)}</div>
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button className="add-btn" style={{ padding: "10px 16px" }} onClick={confirmAddFromSheet}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
