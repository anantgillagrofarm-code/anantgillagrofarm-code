// src/App.jsx
import React, { useState } from "react";
import "./index.css";

// Import product images from src/assets (bundled)
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/*
  NOTE: logo is loaded from public folder to avoid build-time path issues:
  public/anant_gill_logo.png
  Use: <img src="/anant_gill_logo.png" ... />
*/

const formatINR = (value) =>
  value.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const products = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    priceBox: 40, // 40 per box (200g)
    priceKg: 200, // 200 per kg
    sizes: [
      { key: "box", label: "200g box", price: 40 },
      { key: "kg", label: "per kg", price: 200 },
    ],
    img: freshImg,
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    // available jars
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
    sizes: [{ key: "100g", label: "100g pack", price: 450 }],
    img: powderImg,
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    desc: "Traditional mushroom wadiyan (sun-dried and savory).",
    sizes: [{ key: "100g", label: "100g pack", price: 120 }],
    img: wariyanImg,
  },
];

function AddToCartModal({ product, onClose, onConfirm }) {
  const [selected, setSelected] = useState(
    product?.sizes?.[0]?.key ?? null
  );
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const sizeObj = product.sizes.find((s) => s.key === selected) || {};
  const total = (sizeObj.price || 0) * qty;

  return (
    <div className="modal-overlay">
      <div className="modal card">
        <div className="modal-header">
          <div className="modal-title">
            <img src={product.img} alt={product.name} className="modal-thumb" />
            <div>
              <h3>{product.name}</h3>
              <p className="muted">{product.desc}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="section">
            <strong>Choose size</strong>
            <div className="options">
              {product.sizes.map((s) => (
                <label key={s.key} className="option">
                  <input
                    type="radio"
                    name="size"
                    checked={selected === s.key}
                    onChange={() => setSelected(s.key)}
                  />
                  <div>
                    <div className="option-label">{s.label}</div>
                    <div className="option-price">{formatINR(s.price)}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="section qty-row">
            <strong>Quantity</strong>
            <div className="qty-controls">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <div className="qty">{qty}</div>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <div className="total">Total: {formatINR(total)}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onConfirm({
                productId: product.id,
                size: selected,
                qty,
                pricePerUnit: sizeObj.price,
                total,
              })
            }
          >
            Add to cart • {formatINR(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);

  const openModal = (product) => setActiveProduct(product);
  const closeModal = () => setActiveProduct(null);

  const handleAddToCart = (item) => {
    setCart((c) => [...c, item]);
    closeModal();
    // very small toast could be added here
  };

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="header-inner">
          <img src="/anant_gill_logo.png" alt="Anant Gill Agro" className="logo" />
          <div className="title-wrap">
            <h1>Welcome to Anant Gill Agro Farm</h1>
            <p className="subtitle">Best quality fresh organic mushrooms & delicious pickles</p>
          </div>
          <div className="cart-indicator">
            <span className="cart-count">{cart.length}</span>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">Our Products</h2>
        <div className="grid">
          {products.map((p) => {
            // show base price (first size) in card
            const base = p.sizes?.[0];
            return (
              <article key={p.id} className="product-card card">
                <div className="image-wrap">
                  <img src={p.img} alt={p.name} className="product-img" />
                </div>

                <div className="card-body">
                  <h3 className="product-title">{p.name}</h3>
                  <p className="muted">{p.desc}</p>

                  <div className="card-footer">
                    <div className="price">
                      {base ? formatINR(base.price) : ""}
                    </div>
                    <div className="meta muted">{base ? base.label : ""} • multiple sizes</div>
                    <button className="btn btn-primary" onClick={() => openModal(p)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {activeProduct && (
        <AddToCartModal
          product={activeProduct}
          onClose={closeModal}
          onConfirm={handleAddToCart}
        />
      )}

      <footer className="site-footer">
        <div className="container">
          <small>© {new Date().getFullYear()} Anant Gill Agro Farm</small>
        </div>
      </footer>
    </div>
  );
}
