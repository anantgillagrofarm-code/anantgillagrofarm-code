// src/App.jsx
import React, { useEffect, useState } from "react";
import "./index.css";

/*
  Single-file app component (replace your existing App.jsx with this).
  Images should be in /public/ as listed in the message above.

  Behavior summary:
  - PRODUCTS list includes variant info and prices per your request.
  - If a product has variants, "Add to Cart" opens product sheet to choose variant.
  - If no variants (single variant), Add to Cart immediately adds item (with mini-cart feedback).
  - A sticky mini-cart appears when cart has >=1 item. Clicking "View Cart" opens full cart drawer.
  - Footer uses a background image with overlay and clickable FB/IG icons.
*/

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    subtitle: "per 200g box",
    description:
      "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    image: "/fresh_mushrooms.jpg",
    // variants: label, price (INR), unit description
    variants: [
      { id: "fresh-200g", label: "1 box (200 g)", price: 50 },
      { id: "fresh-1kg", label: "1 kg", price: 200 },
    ],
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    subtitle: "per 200g jar",
    description:
      "Tangy & spicy mushroom pickle made with traditional spices.",
    image: "/mushroom_pickle.jpg",
    variants: [
      { id: "pickle-200g", label: "200 g jar", price: 100 },
      { id: "pickle-400g", label: "400 g jar", price: 200 },
    ],
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    subtitle: "per 100g",
    description: "Traditional dried mushrooms — tasty & nutritious.",
    image: "/dry_mushrooms.jpg",
    variants: [{ id: "dry-100g", label: "100 g", price: 300 }],
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    subtitle: "per 100g",
    description: "Finely ground mushroom powder — perfect for seasoning.",
    image: "/mushroom_powder.jpg",
    variants: [{ id: "powder-100g", label: "100 g", price: 450 }],
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    subtitle: "per 100g packet",
    description: "Traditional mushroom wadiyan — tasty & nutritious.",
    image: "/mushroom_wariyan.jpg",
    variants: [{ id: "wariyan-100g", label: "100 g packet", price: 120 }],
  },
];

function currency(n) {
  return `₹${n.toFixed(0)}`;
}

export default function App() {
  // cart items: { productId, variantId, qty, price, title, variantLabel }
  const [cart, setCart] = useState([]);
  const [sheetProduct, setSheetProduct] = useState(null); // product object when product sheet open
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [addAnimId, setAddAnimId] = useState(null); // for brief button animation

  // Prevent body scroll when sheet or cart drawer open
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  // Mini-cart shown when cart.length > 0
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemsCount = cart.reduce((s, it) => s + it.qty, 0);

  function openProductSheet(product) {
    setSheetProduct(product);
    // default select first variant
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].id);
    } else {
      setSelectedVariant(null);
    }
  }

  function closeProductSheet() {
    setSheetProduct(null);
    setSelectedVariant(null);
  }

  function addToCartDirect(product, variant) {
    // product: product object, variant: variant object
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
    // small animation feedback
    const id = `${product.id}-${variant.id}-${Date.now()}`;
    setAddAnimId(id);
    setTimeout(() => setAddAnimId(null), 350);
  }

  function onAddToCartClick(product) {
    if (!product.variants || product.variants.length <= 1) {
      // single variant -> immediate add
      const variant = product.variants[0];
      addToCartDirect(product, variant);
      setTimeout(() => setCartOpen(true), 250); // open mini cart then allow view
    } else {
      // open sheet for choosing variant
      openProductSheet(product);
    }
  }

  function onSheetAdd() {
    if (!sheetProduct || !selectedVariant) return;
    const product = sheetProduct;
    const variant = product.variants.find((v) => v.id === selectedVariant);
    if (!variant) return;
    addToCartDirect(product, variant);
    closeProductSheet();
    // open cart drawer so user can confirm
    setTimeout(() => setCartOpen(true), 200);
  }

  function changeQty(item, delta) {
    setCart((prev) => {
      const next = prev.map((it) =>
        it.productId === item.productId && it.variantId === item.variantId
          ? { ...it, qty: Math.max(0, it.qty + delta) }
          : it
      );
      return next.filter((it) => it.qty > 0);
    });
  }

  function removeItem(item) {
    setCart((prev) =>
      prev.filter(
        (it) => !(it.productId === item.productId && it.variantId === item.variantId)
      )
    );
  }

  function openCartDrawer() {
    setCartOpen(true);
  }
  function closeCartDrawer() {
    setCartOpen(false);
  }

  // footer social links
  const FB_LINK = "https://www.facebook.com/share/177NfwxRKr/";
  const IG_LINK =
    "https://www.instagram.com/anant.gill.agro.farm?igsh=MWVuNzUwbDc2bjl0aA==";

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
            <span>Cart</span>
            <span className="cart-count">({itemsCount})</span>
          </button>
        </div>
      </header>

      <main className="site-main">
        <section className="products-section">
          <h2 className="section-title">Our Products</h2>
          <div className="products-list">
            {PRODUCTS.map((p) => {
              const firstVariant = p.variants && p.variants[0];
              const animKey = `${p.id}-${firstVariant ? firstVariant.id : ""}`;
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
                      <div className="price">{currency(firstVariant.price)}</div>
                      <div className="card-actions">
                        <button
                          className={`btn-add ${addAnimId === animKey ? "btn-add-anim" : ""}`}
                          onClick={() => onAddToCartClick(p)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn-details"
                          onClick={() => openProductSheet(p)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Cart area on page (also available in drawer) */}
        <section className="cart-section">
          <div className="cart-card">
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <div className="cart-empty">Your cart is empty</div>
            ) : (
              <div className="cart-items">
                {cart.map((it) => (
                  <div key={`${it.productId}-${it.variantId}`} className="cart-item">
                    <div className="cart-item-title">
                      {it.title} × {it.qty} <span className="cart-variant"> {it.variantLabel}</span>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => changeQty(it, -1)}>-</button>
                      <span className="cart-price">{currency(it.price)}</span>
                      <button onClick={() => changeQty(it, +1)}>+</button>
                      <button className="btn-remove" onClick={() => removeItem(it)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="cart-subtotal">
                  <div>Subtotal</div>
                  <div className="cart-subtotal-amt">{currency(subtotal)}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mini sticky cart bar */}
      {cart.length > 0 && (
        <div className="mini-cart">
          <div className="mini-cart-left">
            <div className="mini-count">{itemsCount} item</div>
            <div className="mini-sub">Subtotal {currency(subtotal)}</div>
          </div>
          <div className="mini-cart-right">
            <button className="btn-view" onClick={openCartDrawer}>View Cart</button>
          </div>
        </div>
      )}

      {/* Product sheet modal */}
      {sheetProduct && (
        <div className="sheet-backdrop" onClick={closeProductSheet}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={closeProductSheet}>✕</button>
            <img src={sheetProduct.image} className="sheet-image" alt={sheetProduct.title} />
            <h3>{sheetProduct.title}</h3>
            <p className="sheet-desc">{sheetProduct.description}</p>

            <div className="variant-list">
              <div className="variant-title">Choose size / variant</div>
              {sheetProduct.variants.map((v) => (
                <label key={v.id} className={`variant-item ${selectedVariant === v.id ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="variant"
                    checked={selectedVariant === v.id}
                    onChange={() => setSelectedVariant(v.id)}
                  />
                  <div className="variant-info">
                    <div className="variant-label">{v.label}</div>
                    <div className="variant-price">{currency(v.price)}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="sheet-actions">
              <button className="btn-add sheet-add" onClick={onSheetAdd}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer (bottom sheet) */}
      {cartOpen && (
        <div className="cart-backdrop" onClick={closeCartDrawer}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={closeCartDrawer}>✕</button>
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <div>Your cart is empty</div>
            ) : (
              <div className="cart-drawer-list">
                {cart.map((it) => (
                  <div key={`${it.productId}-${it.variantId}`} className="cart-item-drawer">
                    <div>
                      <strong>{it.title}</strong> × {it.qty}
                      <div className="cart-variant small">{it.variantLabel}</div>
                    </div>
                    <div className="cart-controls-drawer">
                      <button onClick={() => changeQty(it, -1)}>-</button>
                      <span>{currency(it.price)}</span>
                      <button onClick={() => changeQty(it, +1)}>+</button>
                      <button onClick={() => removeItem(it)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="cart-subtotal-drawer">
                  <div>Subtotal</div>
                  <div>{currency(subtotal)}</div>
                </div>
              </div>
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
                <a className="social-btn" href={FB_LINK} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a className="social-btn" href={IG_LINK} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></svg>
                </a>
              </div>

              <div className="copyright">© 2025 Anant Gill Agro Farm</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
