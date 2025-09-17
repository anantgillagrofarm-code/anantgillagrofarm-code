// src/App.jsx
import React, { useState, useEffect } from "react";
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";
import "./index.css";

/* ---------- data ---------- */
const PRODUCTS = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    sizes: [
      { key: "200g", label: "200g box", price: 40 },
      { key: "kg", label: "per kg", price: 200 },
    ],
    img: freshImg,
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    sizes: [
      { key: "200g", label: "200g jar", price: 100 },
      { key: "400g", label: "400g jar", price: 200 },
    ],
    img: pickleImg,
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    desc: "Premium sun-dried mushrooms — great for soups & long storage.",
    sizes: [{ key: "kg", label: "per kg", price: 800 }],
    img: dryImg,
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    desc: "Finely ground mushroom powder for seasoning and soups.",
    sizes: [{ key: "100g", label: "per 100g", price: 450 }],
    img: powderImg,
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    desc: "Traditional mushroom wadiyan — tasty & nutritious.",
    sizes: [{ key: "100g", label: "per 100g packet", price: 120 }],
    img: wariyanImg,
  },
];

function formatINR(v) {
  return v.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

/* ---------- AddToCart modal (bottom sheet) ---------- */
function AddToCartModal({ product, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelected(product.sizes[0]?.key || null);
      setQty(1);
    }
  }, [product]);

  if (!product) return null;
  const sizeObj = product.sizes.find((s) => s.key === selected) || product.sizes[0];
  const total = (sizeObj?.price || 0) * qty;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <img src={product.img} alt={product.name} style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8 }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{product.name}</h3>
            <div className="muted" style={{ marginTop: 4 }}>{product.desc}</div>
            <div className="muted small" style={{ marginTop: 8 }}>Choose size & quantity</div>
          </div>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="section-title">Sizes</div>
          {product.sizes.map((s) => (
            <label key={s.key} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <input
                type="radio"
                name="size"
                checked={selected === s.key}
                onChange={() => setSelected(s.key)}
              />
              <div style={{ marginLeft: 10 }}>
                <div style={{ fontWeight: 600 }}>{s.label}</div>
                <div className="muted small">{formatINR(s.price)}</div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="section-title">Quantity</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="btn">−</button>
              <div style={{ minWidth: 28, textAlign: "center" }}>{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="btn">+</button>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div className="muted small">Total</div>
            <div style={{ fontWeight: 700 }}>{formatINR(total)}</div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button
            className="btn btn-primary full"
            onClick={() => {
              onConfirm({
                productId: product.id,
                name: product.name,
                sizeKey: sizeObj.key,
                sizeLabel: sizeObj.label,
                unitPrice: sizeObj.price,
                qty,
                img: product.img,
              });
              onClose();
            }}
          >
            Add • {formatINR(total)}
          </button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Cart drawer ---------- */
function CartDrawer({ open, onClose, items, onUpdateQty, onRemove }) {
  if (!open) return null;
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);

  return (
    <div className="cart-drawer" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Cart</h3>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div style={{ marginBottom: 18 }}>
          {items.length === 0 && <div className="muted">Your cart is empty</div>}
          {items.map((it, idx) => (
            <div className="cart-item" key={idx}>
              <img src={it.img} alt={it.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{it.name}</div>
                <div className="muted small">{it.sizeLabel}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button onClick={() => onUpdateQty(idx, Math.max(1, it.qty - 1))} className="btn">−</button>
                    <div style={{ minWidth: 26, textAlign: "center" }}>{it.qty}</div>
                    <button onClick={() => onUpdateQty(idx, it.qty + 1)} className="btn">+</button>
                  </div>
                  <div style={{ fontWeight: 700 }}>{formatINR(it.unitPrice * it.qty)}</div>
                </div>
              </div>
              <button className="btn" style={{ color: "#b00" }} onClick={() => onRemove(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>Subtotal</div>
            <div style={{ fontWeight: 700 }}>{formatINR(subtotal)}</div>
          </div>
          <button className="btn btn-primary full">Checkout (placeholder)</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [sheetProduct, setSheetProduct] = useState(null); // bottom-sheet product
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  /* ----- LOCK BODY SCROLL WHEN SHEET OR CART OPEN ----- */
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCartConfirmed = (item) => {
    setCart((prev) => {
      const copy = [...prev];
      const existing = copy.find((x) => x.productId === item.productId && x.sizeKey === item.sizeKey);
      if (existing) existing.qty += item.qty;
      else copy.push(item);
      return copy;
    });
    setCartOpen(true);
  };

  function updateQty(idx, qty) {
    setCart((c) => {
      const copy = [...c];
      copy[idx].qty = qty;
      return copy;
    });
  }

  function removeItem(idx) {
    setCart((c) => {
      const copy = [...c];
      copy.splice(idx, 1);
      return copy;
    });
  }

  const itemCount = cart.reduce((s, it) => s + it.qty, 0);
  const subtotal = cart.reduce((s, it) => s + it.unitPrice * it.qty, 0);

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="header-inner">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img src="/anant_gill_logo.png" alt="logo" className="logo" />
            <div>
              <h1 className="brand">Anant Gill Agro Farm</h1>
              <div className="subtitle">Best quality fresh organic mushrooms & delicious pickles</div>
            </div>
          </div>

          <div>
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              Cart {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">Our Products</h2>

        <div className="grid">
          {PRODUCTS.map((p) => (
            <div className="card" key={p.id}>
              <div className="image-wrap">
                <img src={p.img} alt={p.name} className="product-img" />
              </div>

              <div style={{ marginTop: 10 }}>
                <h3 style={{ margin: 0 }}>{p.name}</h3>
                <p className="muted">{p.desc}</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{formatINR(p.sizes[0].price)}</div>
                    <div className="muted small">{p.sizes[0].label} • multiple sizes</div>
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={() => setSheetProduct(p)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 18 }} />

        <div className="bottom-area">
          <div className="card" style={{ padding: 14 }}>
            <h4 style={{ margin: 0 }}>Cart</h4>
            {cart.length === 0 ? (
              <p className="muted">Your cart is empty</p>
            ) : (
              <>
                <div className="muted small">Items: {itemCount}</div>
                <div style={{ marginTop: 8 }}>{formatINR(subtotal)}</div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" />
            <div>
              <div style={{ fontWeight: 800 }}>Anant Gill Agro Farm</div>
              <div className="muted small">Best quality fresh organic mushrooms & delicious pickles</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="footer-title">Contact</div>
            <div>Phone: +91 88375 54747</div>
            <div>Email: <a style={{ color: "#f2f6f0" }} href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
            <div className="muted small" style={{ marginTop: 8 }}>
              Gali No. 1, Baba Deep Singh Avenue,<br/> Village Nangli Bhatha, Amritsar 143001
            </div>
          </div>

          <div>
            <div className="footer-title">Follow</div>
            <div className="social-icons">
              <a href="https://www.instagram.com/anant.gill.agro.farm" target="_blank" rel="noreferrer">Instagram</a>
              <span style={{ marginLeft: 8 }}>|</span>
              <a href="#" style={{ marginLeft: 8 }}>Facebook</a>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 12, color: "rgba(242,246,240,0.85)" }}>
          © 2025 Anant Gill Agro Farm · Contact: +91 88375 54747
        </div>
      </footer>

      <AddToCartModal product={sheetProduct} onClose={() => setSheetProduct(null)} onConfirm={addToCartConfirmed} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQty={updateQty} onRemove={removeItem} />
    </div>
  );
}
