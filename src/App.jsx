// src/App.jsx
import React, { useState } from "react";
import "./index.css";

/**
 * Images are expected in src/assets/
 * - fresh_mushrooms.jpg
 * - mushroom_pickle.jpg
 * - dry_mushrooms.jpg
 * - mushroom_powder.jpg
 * - mushroom_wariyan.jpg
 *
 * Logo is expected in public/ as: /anant_gill_logo.png
 */

import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

const formatINR = (value) =>
  value.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    // We'll show variant options in modal
    img: freshImg,
    variants: [
      { id: "v1", label: "40 / box", price: 40 },
      { id: "v2", label: "200 / kg", price: 200 },
    ],
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    img: pickleImg,
    variants: [
      { id: "v1", label: "200 g jar", price: 100 },
      { id: "v2", label: "400 g jar", price: 200 },
    ],
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    img: dryImg,
    variants: [{ id: "v1", label: "Per kg", price: 800 }],
    desc: "Premium sun-dried mushrooms — long shelf life and rich flavour.",
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    img: powderImg,
    variants: [{ id: "v1", label: "Per 100 g", price: 450 }],
    desc: "Concentrated mushroom powder — great for soups, gravies and marinades.",
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    img: wariyanImg,
    variants: [{ id: "v1", label: "100 g packet", price: 120 }],
    desc: "Traditional mushroom wadiyan — ready-to-cook flavor-packed pieces.",
  },
];

function App() {
  const [cart, setCart] = useState([]); // {productId, variantId, qty}
  const [modalProduct, setModalProduct] = useState(null); // product object
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  const openModal = (product) => {
    setModalProduct(product);
    setSelectedVariant(product.variants[0]?.id || null);
    setModalQty(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModal = () => {
    setModalProduct(null);
    setSelectedVariant(null);
    setModalQty(1);
  };

  const addToCartFromModal = () => {
    if (!modalProduct || !selectedVariant) return;
    const item = {
      productId: modalProduct.id,
      variantId: selectedVariant,
      qty: modalQty,
    };
    setCart((c) => {
      // if same product+variant present, increase qty
      const found = c.find(
        (x) => x.productId === item.productId && x.variantId === item.variantId
      );
      if (found) {
        return c.map((x) =>
          x.productId === item.productId && x.variantId === item.variantId
            ? { ...x, qty: x.qty + item.qty }
            : x
        );
      }
      return [...c, item];
    });
    closeModal();
  };

  const removeCartItem = (index) => {
    setCart((c) => c.filter((_, i) => i !== index));
  };

  const updateQty = (index, delta) => {
    setCart((c) =>
      c.map((it, i) => (i === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
    );
  };

  const getProduct = (id) => productsList.find((p) => p.id === id);

  const cartSummary = cart.map((it) => {
    const product = getProduct(it.productId);
    const variant = product.variants.find((v) => v.id === it.variantId);
    const price = variant.price * it.qty;
    return { product, variant, qty: it.qty, price };
  });

  const total = cartSummary.reduce((s, it) => s + it.price, 0);

  return (
    <div className="page-root">
      <header className="topbar">
        <div className="brand">
          <img src="/anant_gill_logo.png" alt="Anant Gill" className="logo" />
          <div>
            <h1>Anant Gill Agro Farm</h1>
            <p className="tag">Best quality fresh organic mushrooms & pickles</p>
          </div>
        </div>

        <div className="cart-box">
          <button className="cart-btn">
            Cart ({cart.length}) • {formatINR(total)}
          </button>
        </div>
      </header>

      <main className="container">
        <section className="products">
          <h2>Our Products</h2>
          <div className="grid">
            {productsList.map((p) => (
              <article key={p.id} className="card">
                <div className="media">
                  <img src={p.img} alt={p.name} className="product-image" />
                </div>
                <div className="card-body">
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-desc">{p.desc}</p>

                  <div className="price-row">
                    <strong className="price">
                      {formatINR(p.variants[0].price)}{" "}
                      <span className="muted">({p.variants[0].label})</span>
                    </strong>
                    <button className="btn" onClick={() => openModal(p)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cart-section">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p className="muted">Your cart is empty.</p>
          ) : (
            <div className="cart-list">
              {cartSummary.map((it, idx) => (
                <div key={idx} className="cart-item">
                  <div className="cart-left">
                    <img src={it.product.img} alt="" className="cart-thumb" />
                    <div>
                      <div className="cart-title">{it.product.name}</div>
                      <div className="muted">
                        {it.variant.label} • {formatINR(it.variant.price)} each
                      </div>
                    </div>
                  </div>

                  <div className="cart-right">
                    <div className="qty-control">
                      <button onClick={() => updateQty(idx, -1)}>-</button>
                      <span>{it.qty}</span>
                      <button onClick={() => updateQty(idx, +1)}>+</button>
                    </div>
                    <div className="cart-price">{formatINR(it.price)}</div>
                    <button className="remove-link" onClick={() => removeCartItem(idx)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-total">
                <div>Total</div>
                <div className="big">{formatINR(total)}</div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modal for variant selection */}
      {modalProduct && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modalProduct.name}</h3>
              <button className="close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <img src={modalProduct.img} alt="" className="modal-image" />
              <p className="muted">{modalProduct.desc}</p>

              <div className="variants">
                {modalProduct.variants.map((v) => (
                  <label key={v.id} className="variant-row">
                    <input
                      type="radio"
                      name="variant"
                      checked={selectedVariant === v.id}
                      onChange={() => setSelectedVariant(v.id)}
                    />
                    <div>
                      <div className="variant-label">{v.label}</div>
                      <div className="muted">{formatINR(v.price)}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="qty-bottom">
                <div className="qty-selector">
                  <button onClick={() => setModalQty((q) => Math.max(1, q - 1))}>-</button>
                  <span>{modalQty}</span>
                  <button onClick={() => setModalQty((q) => q + 1)}>+</button>
                </div>

                <div className="actions">
                  <button className="btn ghost" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="btn primary" onClick={addToCartFromModal}>
                    Add Item •{" "}
                    {formatINR(
                      modalProduct.variants.find((v) => v.id === selectedVariant).price * modalQty
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Anant Gill Agro Farm</p>
      </footer>
    </div>
  );
}

export default App;
