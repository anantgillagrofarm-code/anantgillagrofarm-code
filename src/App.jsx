// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/* Product image imports (ensure these files exist in src/assets/) */
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/* logo placed in public/anant_gill_agro.png (or anant_gill_logo.png) */
const LOGO = "/anant_gill_logo.png";

const PRODUCTS = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    img: freshImg,
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    sizes: [
      { id: "p1-200", label: "200 g box", price: 40 },
      { id: "p1-1kg", label: "1 kg", price: 200 },
    ],
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    img: pickleImg,
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    sizes: [
      { id: "p2-200", label: "200 g jar", price: 100 },
      { id: "p2-400", label: "400 g jar", price: 200 },
    ],
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    img: dryImg,
    desc: "Premium sun-dried mushrooms — great for soups & long storage.",
    sizes: [{ id: "p3-kg", label: "per kg", price: 800 }],
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    img: powderImg,
    desc: "Fine mushroom powder — ideal for gravies & soups.",
    sizes: [{ id: "p4-100", label: "100 g pack", price: 450 }],
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    img: wariyanImg,
    desc: "Traditional mushroom wariyan — ready-to-cook pieces.",
    sizes: [{ id: "p5-100", label: "100 g pack", price: 120 }],
  },
];

const toINR = (v) =>
  v.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/* Bottom-sheet variant picker (ensures small thumbnail only) */
function VariantSheet({ product, open, onClose, onAdd }) {
  const [selectedId, setSelectedId] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedId(product.sizes[0].id);
      setQty(1);
    }
  }, [product]);

  if (!open || !product) return null;

  const variant = product.sizes.find((s) => s.id === selectedId) || product.sizes[0];
  const total = (variant.price || 0) * qty;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-top">
          {/* Small thumbnail: constrained by CSS .sheet-thumb */}
          <img className="sheet-thumb" src={product.img} alt={product.name} />
          <div className="sheet-info">
            <h3>{product.name}</h3>
            <p className="muted">{product.desc}</p>
          </div>
        </div>

        <div className="sheet-section">
          <div className="sheet-section-title">Choose size</div>
          <div className="variants">
            {product.sizes.map((s) => (
              <label key={s.id} className={`variant-option ${s.id === selectedId ? "active" : ""}`}>
                <input
                  type="radio"
                  name="variant"
                  checked={s.id === selectedId}
                  onChange={() => setSelectedId(s.id)}
                />
                <div className="variant-text">
                  <div className="variant-price">{toINR(s.price)}</div>
                  <div className="variant-label muted">{s.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="sheet-section">
          <div className="sheet-section-title">Quantity</div>
          <div className="qty-controls">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <div className="qty-value">{qty}</div>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            <div className="qty-total muted">Total: <strong>{toINR(total)}</strong></div>
          </div>
        </div>

        <div className="sheet-footer">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onAdd({ product, variant, qty, total })}>
            Add • {toINR(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openSheet = (p) => { setSheetProduct(p); setSheetOpen(true); };
  const closeSheet = () => setSheetOpen(false);

  const addToCart = ({ product, variant, qty, total }) => {
    const key = `${product.id}::${variant.id}`;
    setCart((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) {
        return prev.map((it) => it.key === key ? { ...it, qty: it.qty + qty, lineTotal: it.lineTotal + total } : it);
      }
      return [...prev, { key, name: product.name, variantLabel: variant.label, price: variant.price, qty, lineTotal: total, img: product.img }];
    });
    setSheetOpen(false);
    setDrawerOpen(true);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((it) => it.key === key ? { ...it, qty: Math.max(1, it.qty + delta), lineTotal: (Math.max(1, it.qty + delta)) * it.price } : it)
        .filter(Boolean)
    );
  };

  const removeItem = (key) => setCart((prev) => prev.filter((it) => it.key !== key));

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  return (
    <div className="app-root">
      <header className="header">
        <div className="brand">
          <img src={LOGO} alt="logo" className="logo" />
          <div>
            <h1 className="brand-title">Anant Gill Agro Farm</h1>
            <p className="muted">Fresh organic mushrooms & homemade pickles</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="cart-fab" onClick={() => setDrawerOpen(true)}>
            🛒 <span className="cart-badge">{itemCount}</span>
            <div className="cart-sub">{toINR(subtotal)}</div>
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-left">
            <h2>Organic mushrooms, naturally grown.</h2>
            <p className="muted">Hand-harvested, minimally processed — flavors you can trust.</p>
          </div>
          <div className="hero-right">
            <img src={freshImg} alt="fresh" className="hero-img" />
          </div>
        </section>

        <section className="products">
          <h3 className="section-title">Our Products</h3>
          <div className="grid">
            {PRODUCTS.map((p) => (
              <article className="card" key={p.id}>
                <div className="image-wrap"><img src={p.img} alt={p.name} className="product-img" /></div>
                <div className="card-body">
                  <h4>{p.name}</h4>
                  <p className="muted small">{p.desc}</p>
                  <div className="card-foot">
                    <div>
                      <div className="price">{toINR(p.sizes[0].price)}</div>
                      <div className="muted small">{p.sizes[0].label}{p.sizes.length > 1 ? " • multiple sizes" : ""}</div>
                    </div>
                    <button className="btn primary" onClick={() => openSheet(p)}>Add</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* drawer */}
      <aside className={`cart-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h4>Your Cart</h4>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? <div className="empty">Your cart is empty.</div> : (
            <ul className="drawer-list">
              {cart.map((it) => (
                <li className="drawer-item" key={it.key}>
                  <div className="left">
                    <img src={it.img} alt={it.name} className="thumb" />
                    <div>
                      <div className="fw">{it.name}</div>
                      <div className="muted small">{it.variantLabel}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="qty-row">
                      <button onClick={() => updateQty(it.key, -1)}>-</button>
                      <div>{it.qty}</div>
                      <button onClick={() => updateQty(it.key, +1)}>+</button>
                    </div>
                    <div className="fw">{toINR(it.price * it.qty)}</div>
                    <button className="remove" onClick={() => removeItem(it.key)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="drawer-footer">
          <div className="drawer-total"><div>Subtotal</div><div className="fw">{toINR(subtotal)}</div></div>
          <div className="drawer-actions">
            <button className="btn ghost" onClick={() => setDrawerOpen(false)}>Continue</button>
            <button className="btn primary" onClick={() => alert("Checkout placeholder")}>Checkout • {toINR(subtotal)}</button>
          </div>
        </div>
      </aside>

      <VariantSheet product={sheetProduct} open={sheetOpen} onClose={closeSheet} onAdd={addToCart} />

      {/* Footer */}
      <footer className="site-footer footer-rich">
