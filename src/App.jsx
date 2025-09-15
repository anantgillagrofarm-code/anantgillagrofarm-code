// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/* Images (place these files in src/assets/) */
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/* Logo served from public/ to avoid bundle path issues */
const LOGO = "/anant_gill_logo.png";

/* Helper to format INR */
const toINR = (v) =>
  v.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/* Product data */
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
    desc: "Fine mushroom powder — perfect for soups, gravies and marinades.",
    sizes: [{ id: "p4-100", label: "100 g pack", price: 450 }],
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    img: wariyanImg,
    desc: "Traditional mushroom wariyan — ready-to-cook flavor-packed pieces.",
    sizes: [{ id: "p5-100", label: "100 g pack", price: 120 }],
  },
];

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
  const total = variant.price * qty;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-top">
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
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <div className="qty-value">{qty}</div>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
            <div className="qty-total muted">Total: <strong>{toINR(total)}</strong></div>
          </div>
        </div>

        <div className="sheet-footer">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn primary"
            onClick={() => {
              onAdd({
                productId: product.id,
                name: product.name,
                variantId: variant.id,
                variantLabel: variant.label,
                price: variant.price,
                qty,
                img: product.img,
                lineTotal: total,
              });
            }}
          >
            Add Item • {toINR(total)}
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

  const addToCart = (item) => {
    setCart((prev) => {
      const key = `${item.productId}::${item.variantId}`;
      const found = prev.find((x) => x.key === key);
      if (found) {
        return prev.map((x) => x.key === key ? { ...x, qty: x.qty + item.qty, lineTotal: x.lineTotal + item.lineTotal } : x);
      }
      return [...prev, { key: `${item.productId}::${item.variantId}`, ...item }];
    });
    setSheetOpen(false);
    setDrawerOpen(true);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((it) => (it.key === key ? { ...it, qty: Math.max(1, it.qty + delta), lineTotal: (it.qty + delta <= 0 ? it.qty : (it.qty + delta)) * it.price } : it))
        .filter(Boolean)
    );
  };

  const removeItem = (key) => setCart((prev) => prev.filter((it) => it.key !== key));

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  return (
    <div>
      <header className="header">
        <div className="brand">
          <img src={LOGO} alt="Anant Gill Agro Farm" className="logo" />
          <div>
            <h1 className="brand-title">Anant Gill Agro Farm</h1>
            <p className="brand-sub">Fresh organic mushrooms & homemade pickles</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="cart-fab" onClick={() => setDrawerOpen(true)} aria-label="Open cart">
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
            <img src={freshImg} alt="Fresh mushrooms hero" className="hero-img" />
          </div>
        </section>

        <section className="products">
          <h3 className="section-title">Our Products</h3>
          <div className="grid">
            {PRODUCTS.map((p) => (
              <article className="card" key={p.id}>
                <div className="image-wrap">
                  <img src={p.img} alt={p.name} className="product-img" />
                </div>
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

      {/* Cart Drawer */}
      <aside className={`cart-drawer ${drawerOpen ? "open" : ""}`} aria-hidden
