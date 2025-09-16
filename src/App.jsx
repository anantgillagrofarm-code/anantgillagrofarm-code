// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";
import { FaInstagram, FaFacebook } from "react-icons/fa";

import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/* ---------- product data ---------- */
const PRODUCTS = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    sizes: [{ key: "200g", label: "200g box", price: 40 }, { key: "kg", label: "per kg", price: 200 }],
    img: freshImg,
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    sizes: [{ key: "200g", label: "200g jar", price: 100 }, { key: "400g", label: "400g jar", price: 200 }],
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

/* ---------- AddToCartModal (simple inline) ---------- */
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
        <div className="modal-header">
          <img src={product.img} alt={product.name} className="sheet-thumb" />
          <div className="sheet-info">
            <h3>{product.name}</h3>
            <p className="muted">{product.desc}</p>
            <div className="muted small">Choose size & quantity</div>
          </div>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="section">
            <div className="section-title">Sizes</div>
            {product.sizes.map((s) => (
              <label key={s.key} className="variant-row">
                <input type="radio" name="size" checked={selected === s.key} onChange={() => setSelected(s.key)} />
                <div style={{ marginLeft: 10 }}>
                  <div className="variant-label">{s.label}</div>
                  <div className="muted small">{formatINR(s.price)}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="section qty-row">
            <div className="section-title">Quantity</div>
            <div className="qty-controls">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <div className="qty-value">{qty}</div>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <div className="total-text">Total: {formatINR(total)}</div>
          </div>

          <div className="sheet-actions">
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
    </div>
  );
}

/* ---------- Cart drawer ---------- */
function CartDrawer({ open, onClose, items, onUpdateQty, onRemove }) {
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);

  return (
    <div className={`cart-drawer ${open ? "open" : ""}`} onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>Cart</h3>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div className="cart-body">
          {items.length === 0 && <div className="muted">Your cart is empty</div>}
          {items.map((it, idx) => (
            <div className="cart-item" key={idx}>
              <img src={it.img} alt={it.name} />
              <div className="cart-item-body">
                <div className="cart-item-title">{it.name}</div>
                <div className="muted small">{it.sizeLabel}</div>
                <div className="cart-item-controls">
                  <div className="qty-controls small">
                    <button onClick={() => onUpdateQty(idx, Math.max(1, it.qty - 1))}>−</button>
                    <div className="qty-value">{it.qty}</div>
                    <button onClick={() => onUpdateQty(idx, it.qty + 1)}>+</button>
                  </div>
                  <div className="cart-item-price">{formatINR(it.unitPrice * it.qty)}</div>
                </div>
              </div>
              <button className="remove-link" onClick={() => onRemove(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-sub">
            <div>Subtotal</div>
            <div>{formatINR(subtotal)}</div>
          </div>
          <button className="btn btn-primary full">Checkout (placeholder)</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [modalProduct, setModalProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

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
          <div className="title-wrap">
            <img src="/anant_gill_logo.png" alt="logo" className="logo" />
            <div>
              <h1 className="brand">Anant Gill Agro Farm</h1>
              <div className="subtitle">Best quality fresh organic mushrooms & delicious pickles</div>
            </div>
          </div>

          <div className="header-actions">
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

              <div className="card-body">
                <h3 className="product-title">{p.name}</h3>
                <p className="muted">{p.desc}</p>

                <div className="price-row">
                  <div>
                    <div className="price">{formatINR(p.sizes[0].price)}</div>
                    <div className="price-meta muted">{p.sizes[0].label} • multiple sizes</div>
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={() => setModalProduct(p)}>
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
          <div className="cart-summary-card">
            <h4>Cart</h4>
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
          <div className="footer-left">
            <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" />
            <div className="footer-brand">Anant Gill Agro Farm</div>
            <div className="muted small">Best quality fresh organic mushrooms & delicious pickles</div>
          </div>

          <div className="footer-mid">
            <div className="footer-title">Contact</div>
            <div>Phone: <a href="tel:+918837554747">+91 88375 54747</a></div>
            <div>Email: <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
            <div className="muted small">VPO Bhore Saidan, Pehowa Road, Kurukshetra-136118, Haryana, INDIA</div>
          </div>

          <div className="footer-right">
            <div className="footer-title">Follow</div>
            <div className="social-icons">
              <a href="https://www.instagram.com/anant.gill.agro.farm" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        <div className="copyright">© 2025 Anant Gill Agro Farm · Contact: +91 88375 54747</div>
      </footer>

      <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} onConfirm={addToCartConfirmed} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQty={updateQty} onRemove={removeItem} />
    </div>
  );
}
