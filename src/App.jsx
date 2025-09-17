// src/App.jsx
import React, { useEffect, useState } from "react";
import "./index.css";

/* ---------- product data (uses public/ image paths) ---------- */
const PRODUCTS = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    sizes: [
      { key: "200g", label: "200g box", price: 40 },
      { key: "kg", label: "per kg", price: 200 },
    ],
    img: "/fresh_mushrooms.jpg",
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    sizes: [
      { key: "200g", label: "200g jar", price: 100 },
      { key: "400g", label: "400g jar", price: 200 },
    ],
    img: "/mushroom_pickle.jpg",
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    desc: "Premium sun-dried mushrooms — great for soups & long storage.",
    sizes: [{ key: "kg", label: "per kg", price: 800 }],
    img: "/dry_mushrooms.jpg",
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    desc: "Finely ground mushroom powder for seasoning and soups.",
    sizes: [{ key: "100g", label: "per 100g", price: 450 }],
    img: "/mushroom_powder.jpg",
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    desc: "Traditional mushroom wadiyan — tasty & nutritious.",
    sizes: [{ key: "100g", label: "per 100g packet", price: 120 }],
    img: "/mushroom_wariyan.jpg",
  },
];

function formatINR(v) {
  return v.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

/* ---------- AddToCartModal (bottom sheet) ---------- */
function AddToCartModal({ product, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelected(product.sizes?.[0]?.key || null);
      setQty(1);
    }
  }, [product]);

  if (!product) return null;
  const sizeObj = product.sizes.find((s) => s.key === selected) || product.sizes[0];
  const total = (sizeObj?.price || 0) * qty;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <div className="sheet-thumb-wrap">
            <img src={product.img} alt={product.name} className="sheet-thumb" />
          </div>
          <div>
            <h3>{product.name}</h3>
            <div className="muted">{product.desc}</div>
          </div>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div className="sheet-body">
          <div className="section">
            <div className="section-title">Sizes</div>
            {product.sizes.map((s) => (
              <label className="variant-row" key={s.key}>
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

/* ---------- Cart Drawer ---------- */
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
  const [sheetProduct, setSheetProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  // lock body scrolling whenever sheet OR cart drawer open
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCartConfirmed(item) {
    setCart((prev) => {
      const copy = [...prev];
      const existing = copy.find((x) => x.productId === item.productId && x.sizeKey === item.sizeKey);
      if (existing) existing.qty += item.qty;
      else copy.push(item);
      return copy;
    });
    setCartOpen(true);
  }

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
            <div>Phone: +91 88375 54747</div>
            <div>Email: <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
            <div className="muted small">Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</div>
          </div>

          <div className="footer-right">
            <div className="footer-title">Follow</div>
            <div className="social-row">
              <a target="_blank" rel="noreferrer" href="https://www.instagram.com/anant.gill.agro.farm" aria-label="Instagram" title="Instagram" dangerouslySetInnerHTML={{__html: instagramSVG}} />
              <a target="_blank" rel="noreferrer" href="https://www.facebook.com" aria-label="Facebook" title="Facebook" dangerouslySetInnerHTML={{__html: facebookSVG}} />
            </div>
          </div>
        </div>

        <div className="copyright">© 2025 Anant Gill Agro Farm · Contact: +91 88375 54747</div>
      </footer>

      <AddToCartModal product={sheetProduct} onClose={() => setSheetProduct(null)} onConfirm={addToCartConfirmed} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQty={updateQty} onRemove={removeItem} />
    </div>
  );
}

/* ---------- small inline SVGs for social icons ---------- */
const instagramSVG = `
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle">
  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="#fff" stroke-width="1.2" fill="none"/>
  <circle cx="12" cy="12" r="3" stroke="#fff" stroke-width="1.2" fill="none"/>
  <circle cx="18.2" cy="5.8" r=".6" fill="#fff"/>
</svg>`;

const facebookSVG = `
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle">
  <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 2 6.48 2 12.07 2 17.09 5.66 21.09 10.5 21.98v-6.99H8.2v-2.92h2.3V9.5c0-2.28 1.35-3.53 3.42-3.53.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.46.7-1.46 1.42v1.69h2.5l-.4 2.92h-2.1v6.99C18.34 21.09 22 17.09 22 12.07z" fill="#fff"/>
</svg>`;
