// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/* keep image imports as-is (ensure files are in src/assets) */
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/* logo from public/ */
const logoPublic = "/anant_gill_logo.png";

/* currency helper */
const toINR = (v) =>
  v.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/* products with variants */
const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    img: freshImg,
    desc: "Hand-picked fresh mushrooms — pick box (200g) or 1 kg.",
    variants: [
      { vid: "p1-box", label: "200g box", price: 40 },
      { vid: "p1-kg", label: "1 kg", price: 200 },
    ],
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    img: pickleImg,
    desc: "Tangy & spicy mushroom pickle — choose jar size.",
    variants: [
      { vid: "p2-200", label: "200g jar", price: 100 },
      { vid: "p2-400", label: "400g jar", price: 200 },
    ],
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    img: dryImg,
    desc: "Premium sun-dried mushrooms — great for soups & long storage.",
    variants: [{ vid: "p3-kg", label: "per kg", price: 800 }],
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    img: powderImg,
    desc: "Finely ground mushroom powder — perfect for seasoning.",
    variants: [{ vid: "p4-100", label: "per 100g", price: 450 }],
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    img: wariyanImg,
    desc: "Traditional mushroom wadiyan — tasty & nutritious.",
    variants: [{ vid: "p5-100", label: "per 100g packet", price: 120 }],
  },
];

function VariantModal({ product, onClose, onAdd }) {
  const [selectedVid, setSelectedVid] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVid(product.variants[0].vid);
      setQty(1);
    }
  }, [product]);

  if (!product) return null;
  const variant = product.variants.find((v) => v.vid === selectedVid) || product.variants[0];
  const total = variant.price * qty;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-top">
          <div className="modal-img">
            <img src={product.img} alt={product.name} />
          </div>
          <div className="modal-info">
            <h2>{product.name}</h2>
            <p className="muted">{product.desc}</p>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Choose size / variant</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.variants.map((v) => (
                  <button
                    key={v.vid}
                    className={`variant-btn ${v.vid === selectedVid ? "active" : ""}`}
                    onClick={() => setSelectedVid(v.vid)}
                  >
                    <div style={{ fontWeight: 700 }}>{toINR(v.price)}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{v.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Quantity</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <div style={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}>{qty}</div>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
                <div style={{ marginLeft: 12, color: "var(--muted)" }}>Total: <strong>{toINR(total)}</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={() => onAdd(product, variant, qty)}>
            Add Item • {toINR(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [modalProduct, setModalProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openModal = (product) => setModalProduct(product);
  const closeModal = () => setModalProduct(null);

  const addVariantToCart = (product, variant, qty) => {
    const itemId = `${product.id}#${variant.vid}`;
    setCart((prev) => {
      const found = prev.find((p) => p.itemId === itemId);
      if (found) {
        return prev.map((p) => p.itemId === itemId ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, {
        itemId,
        productId: product.id,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        qty,
        img: product.img
      }];
    });
    setDrawerOpen(true); // open drawer so user sees item added
    closeModal();
  };

  const updateQty = (itemId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.itemId !== itemId));
      return;
    }
    setCart((prev) => prev.map((p) => p.itemId === itemId ? { ...p, qty } : p));
  };

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  return (
    <div>
      <header className="header">
        <div className="brand">
          <img src={logoPublic} alt="Anant Gill Logo" className="logo" />
          <div>
            <h1>Anant Gill Agro Farm</h1>
            <p className="muted">Fresh organic mushrooms & homemade pickles</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="cart-fab" onClick={() => setDrawerOpen(true)} aria-label="Open cart">
            🛒
            <span className="cart-badge">{itemCount}</span>
            <div className="cart-sub">{toINR(subtotal)}</div>
          </button>
        </div>
      </header>

      <main className="container">
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="section-title">Our Products</h2>
            <div className="muted">Choose size → Add to cart</div>
          </div>

          <div className="grid">
            {productsList.map((p) => (
              <article key={p.id} className="card">
                <div className="img-wrap">
                  <img src={p.img} alt={p.name} style={{ objectFit: "cover" }} />
                </div>

                <div className="body">
                  <h3>{p.name}</h3>
                  <div className="desc">{p.desc}</div>

                  <div className="price-row">
                    <div>
                      <div className="price-main">{toINR(p.variants[0].price)}</div>
                      <div className="unit">{p.variants[0].label}{p.variants.length > 1 ? " • multiple sizes" : ""}</div>
                    </div>

                    <div>
                      <button className="btn" onClick={() => openModal(p)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Slide-out drawer */}
      <div className={`cart-drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-header">
          <h3>Your Cart</h3>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">Your cart is empty.</div>
          ) : (
            <ul className="drawer-list">
              {cart.map((it) => (
                <li key={it.itemId} className="drawer-item">
                  <div className="drawer-left">
                    <img src={it.img} alt={it.name} className="thumb" />
                    <div>
                      <div style={{ fontWeight: 700 }}>{it.name}</div>
                      <div className="muted" style={{ fontSize: 13 }}>{it.variantLabel}</div>
                      <div className="muted" style={{ fontSize: 13 }}>{toINR(it.price)} each</div>
                    </div>
                  </div>

                  <div className="drawer-right">
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => updateQty(it.itemId, it.qty - 1)}>-</button>
                      <div>{it.qty}</div>
                      <button className="qty-btn" onClick={() => updateQty(it.itemId, it.qty + 1)}>+</button>
                    </div>
                    <div style={{ fontWeight: 700 }}>{toINR(it.price * it.qty)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="drawer-footer">
          <div className="drawer-total">
            <div>Subtotal</div>
            <div style={{ fontWeight: 800 }}>{toINR(subtotal)}</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn ghost" onClick={() => setDrawerOpen(false)}>Continue shopping</button>
            <button className="btn" onClick={() => alert("Checkout placeholder — integrate Razorpay later")}>
              Checkout • {toINR(subtotal)}
            </button>
          </div>
        </div>
      </div>

      {/* Variant modal */}
      <VariantModal product={modalProduct} onClose={closeModal} onAdd={addVariantToCart} />
    </div>
  );
  }
