// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/* ---------- product images ---------- */
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/* ---------- PRODUCTS data ---------- */
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

/* ---------- Quick Add bottom sheet ---------- */
function QuickAddSheet({ product, onClose, onAdd }) {
  const [qtyByKey, setQtyByKey] = useState({});

  useEffect(() => {
    if (!product) return;
    const initial = {};
    product.sizes.forEach((s) => (initial[s.key] = 1));
    setQtyByKey(initial);
  }, [product]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 760, borderRadius: 12, padding: 12 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={product.img}
            alt={product.name}
            style={{
              width: 68,
              height: 68,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <div>
            <div style={{ fontWeight: 700 }}>{product.name}</div>
            <div style={{ color: "#6b7a6b", fontSize: 13 }}>{product.desc}</div>
          </div>
          <button className="close-x" onClick={onClose}>
            ×
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {product.sizes.map((s) => {
            const qty = qtyByKey[s.key] || 1;
            const total = s.price * qty;
            return (
              <div
                key={s.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 8px",
                  marginBottom: 8,
                  background: "rgba(0,0,0,0.04)",
                  borderRadius: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {formatINR(s.price)} each
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() =>
                      setQtyByKey((p) => ({ ...p, [s.key]: Math.max(1, qty - 1) }))
                    }
                  >
                    −
                  </button>
                  <div>{qty}</div>
                  <button
                    onClick={() =>
                      setQtyByKey((p) => ({ ...p, [s.key]: qty + 1 }))
                    }
                  >
                    +
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onAdd({
                        productId: product.id,
                        name: product.name,
                        sizeKey: s.key,
                        sizeLabel: s.label,
                        unitPrice: s.price,
                        qty,
                        img: product.img,
                      });
                      onClose();
                    }}
                  >
                    ADD {formatINR(total)}
                  </button>
                </div>
              </div>
            );
          })}
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Cart</h3>
          <button className="close-x" onClick={onClose}>
            ×
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {items.length === 0 && <div>Your cart is empty</div>}
          {items.map((it, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <img
                src={it.img}
                alt={it.name}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div className="muted small">{it.sizeLabel}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <div>
                    <button
                      onClick={() => onUpdateQty(idx, Math.max(1, it.qty - 1))}
                    >
                      −
                    </button>
                    <span style={{ margin: "0 8px" }}>{it.qty}</span>
                    <button onClick={() => onUpdateQty(idx, it.qty + 1)}>
                      +
                    </button>
                  </div>
                  <div>{formatINR(it.unitPrice * it.qty)}</div>
                </div>
              </div>
              <button onClick={() => onRemove(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Subtotal</div>
            <div>{formatINR(subtotal)}</div>
          </div>
          <button className="btn btn-primary full" style={{ marginTop: 10 }}>
            Checkout (placeholder)
          </button>
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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    setCart((prev) => {
      const copy = [...prev];
      const existing = copy.find(
        (x) => x.productId === item.productId && x.sizeKey === item.sizeKey
      );
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

  return (
    <div className="app-root">
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="title-wrap">
            <img
              src="/anant_gill_logo.png"
              alt="logo"
              className="logo"
            />
            <div>
              <h1 className="brand">Anant Gill Agro Farm</h1>
              <div className="subtitle">
                Best quality fresh organic mushrooms & delicious pickles
              </div>
            </div>
          </div>

          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            Cart {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>
        </div>
      </header>

      {/* Product Grid */}
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
                    <div className="muted small">{p.sizes[0].label}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => setSheetProduct(p)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" />
            <div className="footer-brand">Anant Gill Agro Farm</div>
            <div className="muted small">
              Freshness you can trust, straight from the farm.
            </div>
          </div>

          <div className="footer-mid">
            <div className="footer-title">Contact</div>
            <div>Phone: +91 88375 54747</div>
            <div>
              Email:{" "}
              <a href="mailto:anantgillagrofarm@gmail.com">
                anantgillagrofarm@gmail.com
              </a>
            </div>
            <div className="muted small">
              Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha,
              Amritsar 143001
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-title">Follow</div>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: 10 }}
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          © 2025 Anant Gill Agro Farm · Contact: +91 88375 54747
        </div>
      </footer>

      {/* Quick Add + Cart Drawer */}
      <QuickAddSheet
        product={sheetProduct}
        onClose={() => setSheetProduct(null)}
        onAdd={addToCart}
      />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />
    </div>
  );
}
