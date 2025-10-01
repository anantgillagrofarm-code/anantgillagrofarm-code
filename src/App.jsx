// src/pages/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

const PRODUCTS = [
  { id: "fresh", title: "Fresh Mushrooms", price: 50, unit: "per 200g box", short: "Hand-picked fresh button mushrooms — ideal for cooking & salads.", image: "/fresh_mushrooms.jpg", variants: [{ id: "box200", label: "1 box (200 g)", price: 50 }, { id: "kg", label: "1 kg", price: 200 }] },
  { id: "pickle", title: "Mushroom Pickle", price: 100, unit: "per 200g jar", short: "Tangy & spicy mushroom pickle.", image: "/mushroom_pickle.jpg", variants: [{ id: "jar200", label: "200 g jar", price: 100 }, { id: "jar400", label: "400 g jar", price: 200 }] },
  { id: "dry", title: "Dry Mushrooms", price: 300, unit: "per 100g", short: "Dehydrated mushrooms.", image: "/dry_mushrooms.jpg", variants: null },
  { id: "powder", title: "Mushroom Powder", price: 450, unit: "per 100g", short: "Finely ground mushroom powder.", image: "/mushroom_powder.jpg", variants: null },
  { id: "wariyan", title: "Mushroom Wariyan", price: 120, unit: "per 100g packet", short: "Traditional mushroom wadiyan.", image: "/mushroom_wariyan.jpg", variants: null },
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const shouldLock = !!sheetProduct || checkoutOpen;
    if (shouldLock) document.body.classList.add("no-scroll"); else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, checkoutOpen]);

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

  function closeSheet() { setSheetProduct(null); setSheetVariant(null); }
  function changeQty(key, delta) { setCart(prev => prev.map(it => it.key === key ? { ...it, qty: Math.max(0, it.qty + delta) } : it).filter(it => it.qty > 0)); }
  function removeItem(key) { setCart(prev => prev.filter(it => it.key !== key)); }
  function confirmAddFromSheet() { if (!sheetProduct) return; handleAdd(sheetProduct, sheetVariant, 1); closeSheet(); }
  function openCheckout() { if (cart.length === 0) { alert("Cart is empty"); return; } setSubmitError(null); setSubmitSuccess(false); setCheckoutOpen(true); }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  function validateCustomer() {
    if (!customer.name.trim()) return "Please enter your name";
    if (!customer.phone.trim()) return "Please enter your phone number";
    return null;
  }

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
      const body = await resp.json().catch(() => null);
      if (!resp.ok) throw new Error((body && (body.error || body.details)) || "Order failed");
      setSubmitSuccess(true); setCart([]);
      setTimeout(() => { setCheckoutOpen(false); setSubmitSuccess(false); setCustomer({ name: "", phone: "", email: "", address: "", note: "" }); }, 2000);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Order failed");
    } finally { setSubmitting(false); }
  }

  async function placeOrderWithPayment() {
    alert("Payment integration not set. Use 'Place Order (COD)' for now.");
  }

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
          <button className="cart-button" onClick={openCheckout}>Cart ({itemCount})</button>
        </div>
      </header>

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
                    <button className="add-btn" onClick={() => { if (p.variants) { setSheetProduct(p); setSheetVariant(p.variants[0].id); } else handleAdd(p, null, 1); }}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="cart-box">
          <h3>Cart</h3>
          {cart.length === 0 ? (<div className="cart-empty">Your cart is empty</div>) : (
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

      <footer className="site-footer">
        <div style={{ padding: 16 }}>
          <div>Phone: <a href="tel:+918837554747">+91 88375 54747</a></div>
          <div>Email: <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
        </div>
      </footer>

      {sheetProduct && (
        <div className="sheet-overlay" onClick={() => setSheetProduct(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSheetProduct(null)}>✕</button>
            </div>
            <h3>{sheetProduct.title}</h3>
            <div>
              {sheetProduct.variants.map(v => (
                <label key={v.id} style={{ display: "block", marginBottom: 8 }}>
                  <input type="radio" name="variant" value={v.id} checked={sheetVariant === v.id} onChange={() => setSheetVariant(v.id)} />
                  {v.label} — {formatINR(v.price)}
                </label>
              ))}
            </div>
            <div style={{ textAlign: "right" }}>
              <button onClick={confirmAddFromSheet}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="sheet-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Place Order</h3>
              <button onClick={() => setCheckoutOpen(false)}>✕</button>
            </div>

            <div style={{ paddingTop: 8 }}>
              <label>Name *<input value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} /></label>
              <label>Phone *<input value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} /></label>
              <label>Email<input value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} /></label>
              <label>Address<textarea value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} /></label>
              <label>Note<input value={customer.note} onChange={e => setCustomer({...customer, note: e.target.value})} /></label>

              {submitError && <div style={{ color: "crimson" }}>{submitError}</div>}
              {submitSuccess && <div style={{ color: "green" }}>Order received — we will contact you shortly.</div>}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={() => setCheckoutOpen(false)} disabled={submitting}>Cancel</button>
                <button onClick={placeOrderWithPayment} disabled={submitting}>{submitting ? "Processing..." : "Pay & Place Order"}</button>
                <button onClick={placeOrderCOD} disabled={submitting}>{submitting ? "Processing..." : "Place Order (COD)"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
