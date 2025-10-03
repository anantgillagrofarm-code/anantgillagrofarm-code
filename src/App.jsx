import React, { useState } from "react";
import "./index.css"; // Ensure this file exists and is correct

// Assuming these files are in 'src/assets/' and their names are correct:
import imgFresh from "./assets/fresh_mushrooms.jpg";
import imgPickle from "./assets/mushroom_pickle.jpg";
import imgDry from "./assets/dry_mushrooms.jpg";
import imgPowder from "./assets/mushroom_powder.jpg";
import imgWariyan from "./assets/mushroom_wariyan.jpg";

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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  // Removed submitting, submitError, submitSuccess state for this test

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
  }

  function changeQty(key, delta) {
    setCart(prev => prev.map(it => it.key === key ? { ...it, qty: Math.max(0, it.qty + delta) } : it).filter(it => it.qty > 0));
  }
  function removeItem(key) { setCart(prev => prev.filter(it => it.key !== key)); }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  function confirmAddFromSheet() {
    if (!sheetProduct) return;
    handleAdd(sheetProduct, sheetVariant, 1);
    setSheetProduct(null);
    setSheetVariant(null);
  }

  function openCheckout() {
    if (cart.length === 0) { alert("Cart is empty"); return; }
    // Removed submit error/success reset for this test
    setCheckoutOpen(true);
  }

  // --- TEMPORARILY REMOVE API LOGIC FUNCTIONS ---
  function placeOrderCOD() {
    alert("ORDERING FUNCTIONALITY TEST: Order (COD) would be placed now. The app is likely running.");
    setCheckoutOpen(false); // Close the sheet to simulate success
    setCart([]); // Clear cart
  }

  function placeOrderWithPayment() {
    alert("ORDERING FUNCTIONALITY TEST: Payment button clicked. App is likely running.");
  }
  // --- END REMOVED API LOGIC ---

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          {/* NOTE: '/anant_gill_logo.png' assumes the file is in the 'public' folder */}
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

      {sheetProduct && (
        <div className="sheet-overlay" onClick={() => { setSheetProduct(null); setSheetVariant(null); }}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <button style={{ borderRadius: 8 }} onClick={() => { setSheetProduct(null); setSheetVariant(null); }}>✕</button>
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

              {/* Removed submitError and submitSuccess display here */}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button className="detail-btn" onClick={() => setCheckoutOpen(false)}>Cancel</button>
                <button className="add-btn" onClick={placeOrderWithPayment}>Pay & Place Order</button>
                <button className="add-btn" onClick={placeOrderCOD}>Place Order (COD)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer" role="contentinfo" style={{ marginTop: 40, padding: 20 }}>
        <div style={{ textAlign: "center" }}>© Anant Gill Agro Farm</div>
      </footer>
    </div>
  );
  }
                      
