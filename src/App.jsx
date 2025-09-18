// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/*
  IMPORTANT:
  - Put product images in src/assets and import them below (or use public/ paths).
  - Put logo and footer image in public/ if you prefer (this code uses public for logo).
*/

// If you kept images in src/assets, import them, e.g.:
// import imgFresh from "./assets/fresh_mushrooms.jpg";
// For simplicity here we reference product images from src/assets via imports:
import imgFresh from "./assets/fresh_mushrooms.jpg";
import imgPickle from "./assets/mushroom_pickle.jpg";
import imgDry from "./assets/dry_mushrooms.jpg";
import imgPowder from "./assets/mushroom_powder.jpg";
import imgWariyan from "./assets/mushroom_wariyan.jpg";

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    image: imgFresh,
    description: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    variants: [
      { id: "box200", label: "1 box (200 g)", price: 40 },
      { id: "kg", label: "1 kg", price: 200 }
    ]
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    image: imgPickle,
    description: "Tangy & spicy mushroom pickle made with traditional spices.",
    variants: [
      { id: "jar200", label: "200 g jar", price: 100 },
      { id: "jar500", label: "500 g jar", price: 180 }
    ]
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    image: imgDry,
    description: "Sun-dried mushrooms — great for soups and long-term storage.",
    price: 300,
    unit: "per 100g"
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    image: imgPowder,
    description: "Finely ground mushroom powder — perfect for seasoning.",
    price: 450,
    unit: "per 100g"
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    image: imgWariyan,
    description: "Traditional mushroom wadiyan — tasty & nutritious.",
    price: 120,
    unit: "per 100g packet"
  }
];

const currency = (n) => `₹${Number(n).toFixed(2)}`;

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  // Lock scrolling when sheet or cart drawer open
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  // Add item to cart. variantId optional.
  function addItemToCart({ productId, variantId = null, qty = 1 }) {
    setCart(prev => {
      const key = variantId ? `${productId}::${variantId}` : productId;
      const found = prev.find(i => i.key === key);
      if (found) {
        return prev.map(i => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      const prod = PRODUCTS.find(p => p.id === productId);
      let title = prod.title;
      let price = prod.price ?? 0;
      if (variantId && prod.variants) {
        const v = prod.variants.find(x => x.id === variantId);
        if (v) { price = v.price; title = `${prod.title} • ${v.label}`; }
      }
      return [...prev, { key, productId, variantId, title, price, qty }];
    });
    // ensure mini-cart visible; small animation handled by caller
  }

  // Called by product card "Add to Cart"
  function onAddClick(product) {
    if (product.variants && product.variants.length) {
      // open sheet to choose variant
      setSheetProduct(product);
      setSelectedVariant(product.variants[0].id);
      return;
    }
    // immediate add
    addItemToCart({ productId: product.id, variantId: null, qty: 1 });
    triggerClickAnimation(product.id);
  }

  function triggerClickAnimation(id) {
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 220);
  }

  function sheetAddToCart() {
    if (!sheetProduct) return;
    const variantId = sheetProduct.variants && sheetProduct.variants.length ? selectedVariant : null;
    addItemToCart({ productId: sheetProduct.id, variantId, qty: 1 });
    triggerClickAnimation(sheetProduct.id);
    setSheetProduct(null);
    setSelectedVariant(null);
  }

  function changeQty(key, delta) {
    setCart(prev => prev.map(i => (i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i)).filter(i => i.qty > 0));
  }
  function removeItem(key) { setCart(prev => prev.filter(i => i.key !== key)); }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((c, it) => c + it.qty, 0);

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand">
          {/* logo in public/ - ensure /anant_gill_logo.png exists in public folder */}
          <img src="/anant_gill_logo.png" alt="logo" className="logo-small" />
          <div>
            <h1>Anant Gill Agro Farm</h1>
            <p className="tagline">Best quality fresh organic mushrooms & delicious pickles</p>
          </div>
        </div>

        <div className="cart-button-wrap">
          <button className="cart-toggle" onClick={() => setCartOpen(true)}>Cart {itemCount ? `(${itemCount})` : ""}</button>
        </div>
      </header>

      <main className="content">
        <h2 className="section-title">Our Products</h2>
        <section className="products-grid">
          {PRODUCTS.map(p => (
            <article className="product-card" key={p.id}>
              <div className="product-image">
                <img src={p.image} alt={p.title} />
              </div>

              <div className="product-body">
                <h3>{p.title}</h3>
                {p.description && <p className="product-description">{p.description}</p>}
                {p.unit && <p className="unit">{p.unit}</p>}

                <div className="price-row">
                  <div className="price">
                    {p.price ? currency(p.price) : (p.variants && p.variants.length ? currency(p.variants[0].price) : "")}
                  </div>

                  <div className="actions">
                    <button
                      className={`add-to-cart ${animatingId === p.id ? "clicked" : ""}`}
                      onClick={() => onAddClick(p)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="cart-card">
          <h3>Cart</h3>
          {cart.length === 0 ? <div className="empty">Your cart is empty</div> : (
            <>
              {cart.map(it => (
                <div className="cart-item" key={it.key}>
                  <div className="cart-left">{it.title} × {it.qty}</div>
                  <div className="cart-right">
                    <button onClick={() => changeQty(it.key, -1)}>-</button>
                    <span className="cart-price">{currency(it.price * it.qty)}</span>
                    <button onClick={() => changeQty(it.key, +1)}>+</button>
                    <button className="remove" onClick={() => removeItem(it.key)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="cart-footer">
                <div>Subtotal</div>
                <div className="subtotal">{currency(subtotal)}</div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" />
            <h4>Anant Gill Agro Farm</h4>
            <p><strong>Phone:</strong> <a href="tel:+918837554747">+91 88375 54747</a></p>
            <p><strong>Email:</strong> <a className="footer-email" href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></p>
            <p>Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</p>
          </div>

          <div className="footer-right">
            <h4>Follow</h4>
            <div className="socials">
              <a className="social-btn" href="https://www.facebook.com/share/177NfwxRKr/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.09 5.66 21.17 10.44 21.95v-6.88h-3.15v-2.99h3.15V9.4c0-3.12 1.86-4.84 4.7-4.84 1.36 0 2.78.24 2.78.24v3.05h-1.56c-1.54 0-2.02.96-2.02 1.94v2.32h3.44l-.55 2.99h-2.89V21.95C18.34 21.17 22 17.09 22 12.07z" fill="#fff"/>
                </svg>
              </a>

              <a className="social-btn" href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm6.5-.7a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" fill="#fff"/>
                  <circle cx="12" cy="14.2" r="3.2" fill="#fff"/>
                </svg>
              </a>
            </div>

            <div className="copyright">© 2025 Anant Gill Agro Farm</div>
          </div>
        </div>
      </footer>

      {/* Mini sticky cart bar */}
      {cart.length > 0 && (
        <div className="mini-cart-bar" onClick={() => setCartOpen(true)} role="button">
          <div className="mini-left">
            <div className="mini-count">{itemCount} item{itemCount > 1 ? "s" : ""}</div>
            <div className="mini-sub">Subtotal {currency(subtotal)}</div>
          </div>
          <div className="mini-right">
            <button className="mini-view">View Cart</button>
          </div>
        </div>
      )}

      {/* Right-side cart drawer */}
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`} role="dialog" aria-hidden={!cartOpen}>
        <div className="drawer-header">
          <h3>Cart</h3>
          <button className="close-drawer" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? <div className="empty">Your cart is empty</div> : (
            <>
              {cart.map(it => (
                <div className="drawer-item" key={it.key}>
                  <div>
                    <div className="drawer-item-title">{it.title}</div>
                    <div className="drawer-item-qty">Qty: {it.qty}</div>
                  </div>
                  <div>
                    <div className="drawer-item-price">{currency(it.price * it.qty)}</div>
                    <div className="drawer-item-controls">
                      <button onClick={() => changeQty(it.key, -1)}>-</button>
                      <button onClick={() => changeQty(it.key, +1)}>+</button>
                      <button className="remove" onClick={() => removeItem(it.key)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="drawer-footer">
                <div className="drawer-subtotal">
                  <strong>Subtotal</strong>
                  <div>{currency(subtotal)}</div>
                </div>
                <div>
                  <button className="checkout-btn">Checkout (placeholder)</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product details / variant sheet */}
      {sheetProduct && (
        <div className="sheet-overlay" onClick={() => { setSheetProduct(null); setSelectedVariant(null); }}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => { setSheetProduct(null); setSelectedVariant(null); }}>✕</button>
            <img src={sheetProduct.image} alt={sheetProduct.title} className="sheet-image" />
            <h3>{sheetProduct.title}</h3>
            {sheetProduct.description && <p className="product-description">{sheetProduct.description}</p>}

            <div className="variant-section">
              {sheetProduct.variants ? (
                <>
                  <p className="variant-title">Choose size / variant</p>
                  <div className="variants">
                    {sheetProduct.variants.map(v => (
                      <label key={v.id} className={`variant-btn ${selectedVariant === v.id ? "active" : ""}`}>
                        <input type="radio" name="variant" value={v.id} checked={selectedVariant === v.id} onChange={() => setSelectedVariant(v.id)} />
                        <div className="variant-label">
                          <div className="vname">{v.label}</div>
                          <div className="vprice">{currency(v.price)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <p className="variant-title">Price: {currency(sheetProduct.price || sheetProduct.variants?.[0]?.price)}</p>
              )}
            </div>

            <div className="sheet-actions">
              <button className="add-to-cart" onClick={sheetAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
