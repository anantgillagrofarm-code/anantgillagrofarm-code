// src/App.jsx
import React, { useState } from "react";
import "./index.css";

// Import images
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    sizes: [
      { key: "box", label: "200g box", price: 40 },
      { key: "kg", label: "per kg", price: 200 },
    ],
    img: freshImg,
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    desc: "Tangy & spicy mushroom pickle — choose jar size.",
    sizes: [
      { key: "200gm", label: "200g jar", price: 100 },
      { key: "400gm", label: "400g jar", price: 200 },
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
    desc: "Finely ground mushroom powder for seasoning.",
    sizes: [{ key: "100g", label: "100g pack", price: 450 }],
    img: powderImg,
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    desc: "Traditional mushroom wariyan (sun-dried chunks).",
    sizes: [{ key: "100g", label: "100g pack", price: 120 }],
    img: wariyanImg,
  },
];

// Modal for selecting size + quantity
function AddToCartModal({ product, onClose, onConfirm }) {
  const [selected, setSelected] = useState(product.sizes[0].key);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const sizeObj = product.sizes.find((s) => s.key === selected);
  const total = (sizeObj.price || 0) * qty;

  return (
    <div className="modal-overlay">
      <div className="modal card">
        <div className="modal-header">
          <h3>{product.name}</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="modal-body">
          <p>{product.desc}</p>
          <div className="size-options">
            {product.sizes.map((s) => (
              <label key={s.key}>
                <input
                  type="radio"
                  name="size"
                  value={s.key}
                  checked={selected === s.key}
                  onChange={() => setSelected(s.key)}
                />
                {s.label} — ₹{s.price}
              </label>
            ))}
          </div>
          <div className="qty-selector">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="confirm-btn"
            onClick={() => onConfirm({ ...product, size: sizeObj, qty })}
          >
            Add ₹{total}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);

  const handleAddToCart = (product) => setModalProduct(product);

  const confirmAdd = (item) => {
    setCart((prev) => [...prev, item]);
    setModalProduct(null);
  };

  return (
    <div className="container">
      <header className="site-header">
        <div className="header-inner">
          <h1>Anant Gill Agro Farm</h1>
          <p className="subtitle">Best quality fresh organic mushrooms & delicious pickles</p>
        </div>
      </header>

      <main>
        <h2 className="section-title">Our Products</h2>
        <div className="grid">
          {productsList.map((p) => (
            <div className="card" key={p.id}>
              <div className="image-wrap">
                <img src={p.img} alt={p.name} className="product-img" />
              </div>
              <div className="card-body">
                <h3 className="product-title">{p.name}</h3>
                <p className="muted">{p.desc}</p>
                <p className="price">₹{p.sizes[0].price} — {p.sizes[0].label}{p.sizes.length > 1 ? " · multiple sizes" : ""}</p>
                <button className="add-btn" onClick={() => handleAddToCart(p)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p>📍 VPO Bhore Saidan, Pehowa Road, Kurukshetra-136118, Haryana, INDIA</p>
          <p>📞 +91-8837554747</p>
          <p>📧 anantgillagrofarm@gmail.com</p>
          <p>
            🌐 Follow us:
            <a href="https://www.instagram.com/anant.gill.agro.farm" target="_blank" rel="noreferrer"> Instagram </a>|
            <a href="https://facebook.com" target="_blank" rel="noreferrer"> Facebook</a>
          </p>
        </div>
      </footer>

      {modalProduct && (
        <AddToCartModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onConfirm={confirmAdd}
        />
      )}
    </div>
  );
}
