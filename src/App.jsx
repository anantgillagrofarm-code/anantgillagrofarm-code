// src/App.jsx
import React, { useState, useEffect } from "react";
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";
import "./index.css";

/* Product data */
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

function formatINR(value) {
  return value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

/* Add to cart bottom-sheet modal */
function AddToCartModal({ product, onClose, onConfirm }) {
  const [selectedKey, setSelectedKey] = useState(product?.sizes?.[0]?.key || null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSelectedKey(product?.sizes?.[0]?.key || null);
    setQty(1);
  }, [product]);

  if (!product) return null;

  const sizeObj = product.sizes.find((s) => s.key === selectedKey) || {};
  const total = (sizeObj.price || 0) * qty;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <img className="sheet-thumb" src={product.img} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p className="muted">{product.desc}</p>
          </div>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="section">
            <div className="section-title">Choose size</div>
            {product.sizes.map((s) => (
              <label key={s.key} className="variant-row">
                <input
                  type="radio"
                  name="size"
                  checked={selectedKey === s.key}
                  onChange={() => setSelectedKey(s.key)}
                />
                <div>
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
              className="btn btn-primary"
              onClick={() => {
                onConfirm({
                  productId: product.id,
                  name: product.name,
                  sizeKey: selectedKey,
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
    </div
