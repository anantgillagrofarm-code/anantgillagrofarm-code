// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/* Images in src/assets (you uploaded these) */
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/* Logo served from public/ (no import) */
const logoPublic = "/anant_gill_logo.png";

/* formatting helper */
const toINR = (val) => val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/* Product list with variants — adjust descriptions/prices as you asked */
const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    img: freshImg,
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    variants: [
      { vid: "p1-200box", label: "200g box", price: 40 },
      { vid: "p1-1kg", label: "1 kg", price: 200 },
    ],
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    img: pickleImg,
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    variants: [
      { vid: "p2-200", label: "200g jar", price: 100 },
      { vid: "p2-400", label: "400g jar", price: 200 },
    ],
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    img: dryImg,
    desc: "Premium dried mushrooms — great for soups & long storage.",
    variants: [{ vid: "p3-1kg", label: "per kg", price: 800 }],
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    img: powderImg,
    desc: "Finely ground mushroom powder — perfect for seasoning.",
    variants: [{ vid: "p4-100g", label: "100 g", price: 450 }],
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    img: wariyanImg,
    desc: "Traditional mushroom wadiyan — tasty & nutritious.",
    variants: [{ vid: "p5-100g", label: "100 g pack", price: 120 }],
  },
];

function VariantSheet({ product, open, onClose, onAdd }) {
  const [selectedVid, setSelectedVid] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVid(product.variants[0].vid);
      setQty(1);
    }
  }, [product]);

  if (!open || !product) return null;

  const variant = product.variants.find((v) => v.vid === selectedVid) || product.variants[0];
  const total = variant.price * qty;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-top">
          <div className="sheet-left">
            <img src={product.img} alt={product.name} className="sheet-thumb" />
          </div>
          <div className="sheet-info">
            <h3 className="sheet-title">{product.name}</h3>
            <p className="muted">{product.desc}</p>
          </div>
        </div>

        <div className="sheet-section">
          <div className="sheet-section-title">Choose size</div>
          <div className="variants">
            {product.variants.map((v) => (
              <label key={v.vid} className={`variant-option ${v.vid === selectedVid ? "active" : ""}`}>
                <input
                  type="radio"
                  name="variant"
                  value={v.vid}
                  checked={v.vid === selectedVid}
                  onChange={() => setSelectedVid(v.vid)}
                />
                <div className="variant-text">
                  <div className="variant-price">{toINR(v.price)}</div>
                  <div className="variant-label muted">{v.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="sheet-section">
          <div className="sheet-section-title">Quantity</div>
          <div className="qty-controls">
            <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <div className="qty-value">{qty}</div>
            <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            <div className="qty-total muted">Total: <strong>{toINR(total)}</strong></div>
          </div>
        </div>

        <div className="sheet-footer">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onAdd(product, variant, qty)}>
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

  const openSheet = (product) => {
    setSheetProduct(product);
    setSheetOpen(true);
  };
  const closeSheet = () => setSheetOpen(false);

  const addToCart = (product, variant, qty) => {
    const key = `${product.id}::${variant.vid}`;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        key,
        productId: product.id,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        qty,
        img: product.img
      }];
    });
    setSheetOpen(false);
  };

  const changeQty = (key, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setCart((prev) => prev.map((i) => i.key === key ? { ...i, qty } : i));
  };

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  return (
    <div className="app-root">
      <header className="header">
        <div className="brand">
          <img className="logo" src={logoPublic} alt="logo" />
          <div>
            <h1 className="site-title">Anant Gill Agro Farm</h1>
            <div className="muted">Best quality fresh organic mushrooms & delicious pickles</div>
          </div>
        </div>

        <div className="header-right">
          <button className="cart-button" onClick={() => alert("Open cart drawer later")}>
            🛒 <span className="badge">{itemCount}</span>
            <div className="cart-sub">{toINR(subtotal)}</div>
          </button>
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">Our Products</h2>

        <div className="product-grid">
          {productsList.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-image">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="product-body">
                <h3>{p.name}</h3>
                <p className="muted">{p.desc}</p>
                <div className="product-footer">
                  <div>
                    <div className="price">{toINR(p.variants[0].price)}</div>
                    <div className="muted small">{p.variants[0].label}{p.variants.length>1? " • multiple sizes":""}</div>
                  </div>
                  <button className="btn primary" onClick={() => openSheet(p)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <VariantSheet
        product={sheetProduct}
        open={sheetOpen}
        onClose={closeSheet}
        onAdd={addToCart}
      />
    </div>
  );
}
