// src/App.jsx
import React, { useEffect, useState } from "react";
import "./index.css";

/* IMPORTANT:
   This version imports product images from src/assets.
   Place your product images in src/assets/ with the filenames below.
*/
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    subtitle: "per 200g box",
    description: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    image: freshImg,
    variants: [
      { id: "fresh-200g", label: "1 box (200 g)", price: 50 }, // updated: 50 / 200gm
      { id: "fresh-1kg", label: "1 kg", price: 200 }, // 200 / kg
    ],
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    subtitle: "per jar",
    description: "Tangy, homemade mushroom pickle — great with rotis & rice.",
    image: pickleImg,
    variants: [
      { id: "pickle-200g", label: "200 g jar", price: 100 },
      { id: "pickle-400g", label: "400 g jar", price: 200 },
    ],
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    subtitle: "per 100g",
    description: "Traditional dried button mushrooms — concentrated flavour.",
    image: dryImg,
    variants: [{ id: "dry-100g", label: "100 g", price: 300 }],
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    subtitle: "per 100g",
    description: "Finely ground mushroom powder — perfect for seasoning.",
    image: powderImg,
    variants: [{ id: "powder-100g", label: "100 g", price: 450 }],
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    subtitle: "per 100g packet",
    description: "Traditional mushroom wadiyan — tasty & nutritious.",
    image: wariyanImg,
    variants: [{ id: "wariyan-100g", label: "100 g packet", price: 120 }],
  },
];

function formatRupee(n) {
  return `₹${n.toFixed(0)}`;
}

export default function App() {
  const [cart, setCart] = useState([]); // items: {productId, variantId, qty, price, title, variantLabel}
  const [sheet, setSheet] = useState(null); // product shown in sheet
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [btnAnim, setBtnAnim] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", !!sheet || cartOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [sheet, cartOpen]);

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemsCount = cart.reduce((s, it) => s + it.qty, 0);

  function openSheetFor(product) {
    setSheet(product);
    if (product.variants && product.variants.length) setSelectedVariant(product.variants[0].id);
  }
  function closeSheet() {
    setSheet(null);
    setSelectedVariant(null);
  }

  function addItem(product, variant) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === product.id && it.variantId === variant.id
      );
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            variantId: variant.id,
            qty: 1,
            price: variant.price,
            title: product.title,
            variantLabel: variant.label,
          },
        ];
      }
    });

    // quick button animation feedback
    const id = `${product.id}-${variant.id}-${Date.now()}`;
    setBtnAnim(id);
    setTimeout(() => setBtnAnim(null), 300);
  }

  function onAddClick(product) {
    // if multiple variants -> open sheet, else add directly
    if (!product.variants || product.variants.length <= 1) {
      const variant = product.variants[0];
      addItem(product, variant);
      // open sticky after small delay
      setTimeout(() => setCartOpen(true), 250);
    } else {
      openSheetFor(product);
    }
  }

  function confirmSheetAdd() {
    if (!sheet || !selectedVariant) return;
    const variant = sheet.variants.find((v) => v.id === selectedVariant);
    addItem(sheet, variant);
    closeSheet();
    setTimeout(() => setCartOpen(true), 200);
  }

  function changeQty(item, delta) {
    setCart((prev) =>
      prev
        .map((it) =>
          it.productId === item.productId && it.variantId === item.variantId
            ? { ...it, qty: Math.max(0, it.qty + delta) }
            : it
        )
        .filter((it) => it.qty > 0)
    );
  }
  function removeFromCart(item) {
    setCart((prev) =>
      prev.filter((it) => !(it.productId === item.productId && it.variantId === item.variantId))
    );
  }

  // social links
  const FB = "https://www.facebook.com/share/177NfwxRKr/";
  const IG = "https://www.instagram.com/anant.gill.agro.farm?igsh=MWVuNzUwbDc2bjl0aA==";

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="header-inner">
          <img src="/anant_gill_logo.png" alt="logo" className="logo" />
          <div className="site-title">
            <h1>Anant Gill Agro Farm</h1>
            <p className="tagline">Best quality fresh organic mushrooms & delicious pickles</p>
          </div>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            Cart <span className="cart-count">({itemsCount})</span>
          </button>
        </div>
      </header>

      <main className="site-main">
        <section className="products-section">
          <h2 className="section-title">Our Products</h2>
          <div className="products-list">
            {PRODUCTS.map((p) => {
              const firstVariant = p.variants[0];
              const animKey = `${p.id}-${firstVariant.id}`;
              return (
                <article className="product-card" key={p.id}>
                  <div className="product-image-col">
                    <img src={p.image} alt={p.title} className="product-image" />
                  </div>
                  <div className="product-info-col">
                    <h3 className="product-title">{p.title}</h3>
                    <div className="product-subtitle">{p.subtitle}</div>
                    <div className="product-desc">{p.description}</div>
                    <div className="product-row">
                      <div className="price">{formatRupee(firstVariant.price)}</div>
                      <div className="card-actions">
                        <button
                          className={`btn-add ${btnAnim === animKey ? "btn-add-anim" : ""}`}
                          onClick={() => onAddClick(p)}
                        >
                          Add to Cart
                        </button>
                        {/* we removed the large "Details" behavior — product sheet opens when required */}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="cart-section">
          <div className="cart-card">
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <div className="cart-empty">Your cart is empty</div>
            ) : (
              <>
                {cart.map((it) => (
                  <div className="cart-item" key={`${it.productId}-${it.variantId}`}>
                    <div className="cart-item-title">
                      {it.title} × {it.qty} <span className="cart-variant"> {it.variantLabel}</span>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => changeQty(it, -1)}>-</button>
                      <span className="cart-price">{formatRupee(it.price)}</span>
                      <button onClick={() => changeQty(it, +1)}>+</button>
                      <button className="btn-remove" onClick={() => removeFromCart(it)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="cart-subtotal">
                  <div>Subtotal</div>
                  <div className="cart-subtotal-amt">{formatRupee(subtotal)}</div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {cart.length > 0 && (
        <div className="mini-cart">
          <div>
            <div className="mini-count">{itemsCount} item</div>
            <div className="mini-sub">Subtotal {formatRupee(subtotal)}</div>
          </div>
          <div>
            <button className="btn-view" onClick={() => setCartOpen(true)}>View Cart</button>
          </div>
        </div>
      )}

      {sheet && (
        <div className="sheet-backdrop" onClick={() => closeSheet()}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => closeSheet()}>✕</button>
            <img src={sheet.image} alt={sheet.title} className="sheet-image" />
            <h3>{sheet.title}</h3>
            <p className="sheet-desc">{sheet.description}</p>

            <div className="variant-list">
              <div className="variant-title">Choose size / variant</div>
              {sheet.variants.map((v) => (
                <label key={v.id} className={`variant-item ${selectedVariant === v.id ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="variant"
                    checked={selectedVariant === v.id}
                    onChange={() => setSelectedVariant(v.id)}
                  />
                  <div className="variant-info">
                    <div className="variant-label">{v.label}</div>
                    <div className="variant-price">{formatRupee(v.price)}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="sheet-actions">
              <button className="btn-add sheet-add" onClick={() => confirmSheetAdd()}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setCartOpen(false)}>✕</button>
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <div>Your cart is empty</div>
            ) : (
              <>
                {cart.map((it) => (
                  <div className="cart-item-drawer" key={`${it.productId}-${it.variantId}`}>
                    <div>
                      <strong>{it.title}</strong> × {it.qty}
                      <div className="cart-variant small">{it.variantLabel}</div>
                    </div>
                    <div className="cart-controls-drawer">
                      <button onClick={() => changeQty(it, -1)}>-</button>
                      <span>{formatRupee(it.price)}</span>
                      <button onClick={() => changeQty(it, +1)}>+</button>
                      <button onClick={() => removeFromCart(it)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="cart-subtotal-drawer">
                  <div>Subtotal</div>
                  <div>{formatRupee(subtotal)}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="footer-overlay">
          <div className="footer-inner">
            <div className="footer-left">
              <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" />
              <h4>Anant Gill Agro Farm</h4>
              <div className="footer-contact">
                <div>Phone: <a href="tel:+918837554747">+91 88375 54747</a></div>
                <div>Email: <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
                <div className="footer-address">Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</div>
              </div>
            </div>

            <div className="footer-right">
              <div className="follow-title">Follow</div>
              <div className="social-row">
                <a className="social-btn" href={FB} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a 
href="https://www.instagram.com/anant.gill.agro.farm?igsh=MWVuNzUwbDc2bjl0aA=="
  target="_blank"
  rel="noreferrer"
  aria-label="instagram"
  className="icon-btn"
>
  {/* IG svg here */}
</a>
              <div className="copyright">© 2025 Anant Gill Agro Farm</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
