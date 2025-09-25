// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import "./index.css";

import imgFresh from "./assets/fresh_mushrooms.jpg";
import imgPickle from "./assets/mushroom_pickle.jpg";
import imgDry from "./assets/dry_mushrooms.jpg";
import imgPowder from "./assets/mushroom_powder.jpg";
import imgWariyan from "./assets/mushroom_wariyan.jpg";

import Health from "./Health";

const PRODUCTS = [
  { id: "fresh", title: "Fresh Mushrooms", price: 50, unit: "per 200g box", short: "Hand-picked fresh button mushrooms — ideal for cooking & salads.", image: imgFresh, variants: [{ id: "box200", label: "1 box (200 g)", price: 50 }, { id: "kg", label: "1 kg", price: 200 }] },
  { id: "pickle", title: "Mushroom Pickle", price: 100, unit: "per 200g jar", short: "Tangy & spicy mushroom pickle made with traditional spices.", image: imgPickle, variants: [{ id: "jar200", label: "200 g jar", price: 100 }, { id: "jar400", label: "400 g jar", price: 200 }] },
  { id: "dry", title: "Dry Mushrooms", price: 300, unit: "per 100g", short: "Dehydrated mushrooms, perfect for long-term storage and soups.", image: imgDry, variants: null },
  { id: "powder", title: "Mushroom Powder", price: 450, unit: "per 100g", short: "Finely ground mushroom powder — perfect for seasoning.", image: imgPowder, variants: null },
  { id: "wariyan", title: "Mushroom Wariyan", price: 120, unit: "per 100g packet", short: "Traditional mushroom wadiyan — tasty & nutritious.", image: imgWariyan, variants: null },
];

function formatINR(n) {
  try {
    const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
    return `₹${nf.format(Number(n) || 0)}`;
  } catch {
    return `₹${Math.round(n || 0)}`;
  }
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [sheetProduct, setSheetProduct] = useState(null);
  const [sheetVariant, setSheetVariant] = useState(null);
  const [miniVisible, setMiniVisible] = useState(false);

  // Health page hash nav
  const [showHealth, setShowHealth] = useState(() => window.location.hash === "#health");
  useEffect(() => {
    function onHashChange() { setShowHealth(window.location.hash === "#health"); }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Checkout sheet / customer details
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // prevent body scroll when sheet open
  useEffect(() => {
    const shouldLock = !!sheetProduct || checkoutOpen;
    if (shouldLock) document.body.classList.add("no-scroll"); else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, checkoutOpen]);

  // cart helpers
  function handleAdd(product, variantId = null, qty = 1) {
    if (product.variants && !variantId) {
      setSheetProduct(product);
      setSheetVariant(product.variants[0].id);
      return;
    }
    const variant = product.variants ? product.variants.find(v => v.id === variantId) : null;
    const key = `${product.id}:${variant ? variant.id : "default"}`;
    setCart(prev => {
      const found = prev.find(it => it.key === key);
      if (found) return prev.map(it => it.key === key ? { ...it, qty: it.qty + qty } : it);
      return [...prev, { key, productId: product.id, productTitle: product.title, variantId: variant ? variant.id : null, variantLabel: variant ? variant.label : null, price: variant ? variant.price : product.price, qty }];
    });
    setMiniVisible(true);
    setTimeout(() => setMiniVisible(false), 3000);
  }
  function openSheetForProduct(product) { if (!product.variants) return; setSheetProduct(product); setSheetVariant(product.variants[0].id); }
  function closeSheet() { setSheetProduct(null); setSheetVariant(null); }
  function changeQty(key, delta) {
    setCart(prev => prev.map(it => it.key === key ? { ...it, qty: Math.max(0, it.qty + delta) } : it).filter(it => it.qty > 0));
  }
  function removeItem(key) { setCart(prev => prev.filter(it => it.key !== key)); }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  function confirmAddFromSheet() {
    if (!sheetProduct) return;
    handleAdd(sheetProduct, sheetVariant, 1);
    closeSheet();
  }

  function openCheckout() {
    if (cart.length === 0) { alert("Cart is empty"); return; }
    setSubmitError(null); setSubmitSuccess(false);
    setCheckoutOpen(true);
  }

  function validateCustomer() {
    if (!customer.name.trim()) return "Please enter your name";
    if (!customer.phone.trim()) return "Please enter your phone number";
    return null;
  }

  // Place COD order (simple)
  async function placeOrderCOD() {
    const val = validateCustomer();
    if (val) { setSubmitError(val); return; }
    const payload = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      note: customer.note,
      items: cart.map(it => ({ title: it.productTitle, variant: it.variantLabel, qty: it.qty, price: it.price })),
      total: subtotal,
    };
    setSubmitting(true); setSubmitError(null);
    try {
      const resp = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body.error || "Order failed");
      setSubmitSuccess(true); setCart([]); // clear cart
      setTimeout(() => { setCheckoutOpen(false); setSubmitSuccess(false); setCustomer({ name: "", phone: "", email: "", address: "", note: "" }); }, 2000);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Order failed");
    } finally { setSubmitting(false); }
  }

  // Placeholder for future payment flow (e.g. Razorpay integration)
  async function placeOrderWithPayment() {
    // If you add payments later, call create-order endpoint and open payment modal,
    // then POST same payload + payment info to /api/order for verification.
    alert("Payment integration not set. Use 'Place Order (COD)' for now.");
  }

  // social links
  const fbUrl = "https://www.facebook.com/share/177NfwxRKr/";
  const igUrl = "https://www.instagram.com/anant.gill.agro.farm?igsh=MWVuNzUwbDc2bjl0aA==";

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img className="logo" src="/anant_gill_logo.png" alt="logo" />
          <div>
            <h1 className="title">Anant Gill Agro Farm</h1>
            <div className="subtitle">Best quality fresh organic mushrooms & delicious pickles</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href="#health" className="cart-button" style={{ textDecoration: "none" }}>Health</a>
          <button className="cart-button" onClick={openCheckout}>Cart ({itemCount})</button>
        </div>
      </header>

      {showHealth ? (
        <div className="content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Health & Nutrition</h2>
            <a href="#" className="cart-button" onClick={(e) => { e.preventDefault(); window.location.hash = ""; }} style={{ textDecoration: "none" }}>Back to shop</a>
          </div>
          <Health />
        </div>
      ) : (
        <main className="content">
          <h2 className="section-title">Our Products</h2>
          <div className="product-list">
            {PRODUCTS.map(p => (
              <article key={p.id} className="product-card">
                <div className="product-media"><img src={p.image} alt={p.title} /></div>
                <div className="product-body">
                  <h3>{p.title}</h3>
                  <div className="unit">{p.unit}</div>
                  <div className="short">{p.short}</div>
                  <div className="price-row">
                    <div><div className="price">{formatINR(p.price)}</div></div>
                    <div className="actions">
                      <button className="add-btn" onClick={() => { if (p.variants) openSheetForProduct(p); else handleAdd(p, null, 1); }}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* inline cart box */}
          <div className="cart-box">
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <div className="cart-empty">Your cart is empty</div>
            ) : (
              <>
                {cart.map(it => (
                  <div key={it.key} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{it.productTitle}{it.variantLabel ? ` × ${it.variantLabel}` : ""}</div>
                    <div style={{ marginTop: 6 }}>
                      <button onClick={() => changeQty(it.key, -1)}>-</button>
                      <span style={{ margin: "0 8px" }}>{formatINR(it.price * it.qty)}</span>
                      <button onClick={() => changeQty(it.key, +1)}>+</button>
                      <button style={{ marginLeft: 10 }} onClick={() => removeItem(it.key)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 8 }}>
                  <div>Subtotal</div>
                  <div style={{ fontWeight: 700 }}>{formatINR(subtotal)}</div>
                </div>
              </>
            )}
            <div style={{ marginTop: 10 }}>
              <button className="add-btn" onClick={openCheckout} disabled={cart.length===0}>Place Order</button>
            </div>
          </div>
        </main>
      )}

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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H12C9.79 3 8 4.79 8 7V10H5V13H8V21H11V13H14L15 10H11V7C11 6.45 11.45 6 12 6H15V3Z" fill="white"/>
                </svg>
              </a>
              <a className="social-btn" href={igUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
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

      {/* mini-cart sticky bottom */}
      {itemCount > 0 && (
        <div className="mini-cart" style={{ display: miniVisible ? "flex" : "flex" }}>
          <div className="mini-left">
            <div style={{ fontWeight: 700 }}>{itemCount} item{itemCount>1?"s":""}</div>
            <div className="mini-sub">Subtotal {formatINR(subtotal)}</div>
          </div>
          <div>
            <button className="view-cart" onClick={openCheckout}>View Cart</button>
          </div>
        </div>
      )}

      {/* Variant sheet */}
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
                  <label key={v.id} style={{ display: "block", border: sheetVariant === v.id ? "2px solid #14502b" : "1px solid rgba(0,0,0,0.06)", borderRadius: 10, padding: 12, marginBottom: 8, cursor: "pointer" }}>
                    <input type="radio" name="variant" value={v.id} checked={sheetVariant === v.id} onChange={() => setSheetVariant(v.id)} style={{ marginRight: 10 }} />
                    <span style={{ fontWeight: 600 }}>{v.label}</span>
                    <div style={{ color: "#556e64" }}>{formatINR(v.price)}</div>
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button className="add-btn" style={{ padding: "10px 16px" }} onClick={confirmAddFromSheet}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout sheet (customer details) */}
      {checkoutOpen && (
        <div className="sheet-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Place Order</h3>
              <button style={{ borderRadius: 8 }} onClick={() => setCheckoutOpen(false)}>✕</button>
            </div>

            <div style={{ padding: "8px 4px 24px" }}>
              <p style={{ color: "#556e64" }}>Enter details so we can contact you to confirm the order.</p>

              <label style={{ display: "block", marginTop: 8 }}>
                Name *
                <input type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Phone *
                <input type="tel" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Email
                <input type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Address
                <textarea value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} style={{ width: "100%", padding: 8, marginTop: 6 }} rows={3} />
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Note (optional)
                <input type="text" value={customer.note} onChange={(e) => setCustomer({...customer, note: e.target.value})} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </label>

              {submitError && <div style={{ color: "crimson", marginTop: 10 }}>{submitError}</div>}
              {submitSuccess && <div style={{ color: "green", marginTop: 10 }}>Order received — we will contact you shortly.</div>}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button className="detail-btn" onClick={() => setCheckoutOpen(false)} disabled={submitting}>Cancel</button>
                <button className="add-btn" onClick={placeOrderWithPayment} disabled={submitting}>{submitting ? "Processing..." : "Pay & Place Order"}</button>
                <button className="add-btn" onClick={placeOrderCOD} disabled={submitting}>{submitting ? "Processing..." : "Place Order (COD)"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
