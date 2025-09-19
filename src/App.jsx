// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/*
  IMPORTANT:
  - Product images are imported from src/assets/ (you have these files in repo)
  - Footer background image should be in public/ as /footer-mushrooms-v2.jpg
  - Background image (page) uses public/bg-mushrooms.jpg (already in your public folder)
  - Replace contact/address if needed below (already set as requested)
*/

import freshMushrooms from "./assets/fresh_mushrooms.jpg";
import mushroomPickle from "./assets/mushroom_pickle.jpg";
import dryMushrooms from "./assets/dry_mushrooms.jpg";
import mushroomPowder from "./assets/mushroom_powder.jpg";
import mushroomWariyan from "./assets/mushroom_wariyan.jpg";

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    price: 30,
    unit: "per 200g box",
    description: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    variants: [
      { id: "200g", label: "1 box (200 g)", price: 30 },
      { id: "1kg", label: "1 kg", price: 200 }
    ],
    image: freshMushrooms,
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    price: 100,
    unit: "per 200g jar",
    description: "Tangy & spicy mushroom pickle made with traditional spices.",
    variants: [
      { id: "200g", label: "200 g jar", price: 100 },
      { id: "400g", label: "400 g jar", price: 200 }
    ],
    image: mushroomPickle,
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    price: 300,
    unit: "per 100g",
    description: "Sun-dried button mushrooms — great for soups & curries.",
    image: dryMushrooms,
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    price: 450,
    unit: "per 100g",
    description: "Finely ground mushroom powder — perfect for seasoning.",
    image: mushroomPowder,
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    price: 120,
    unit: "per 100g packet",
    description: "Traditional mushroom wadiyan — tasty & nutritious.",
    image: mushroomWariyan,
  }
];

const CONTACT = {
  phone: "+91 88375 54747",
  email: "anantgillagrofarm@gmail.com",
  address: "Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001",
  facebook: "https://www.facebook.com/share/177NfwxRKr/"
};

function currency(n) {
  return `₹${Number(n).toFixed(0)}`;
}

export default function App() {
  const [cart, setCart] = useState([]); // {id, variantId?, qty, price, title}
  const [sheetProduct, setSheetProduct] = useState(null); // product object shown in sheet
  const [sheetSelectedVariant, setSheetSelectedVariant] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [miniCartVisible, setMiniCartVisible] = useState(false);

  // when the sheet OR the cart drawer is open, prevent body scrolling
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    // cleanup on unmount (safety)
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  useEffect(() => {
    setMiniCartVisible(cart.length > 0);
  }, [cart]);

  function addToCart(product, opts = {}) {
    // opts: variantId (optional)
    // if product has variants but variant not supplied -> open sheet
    if (product.variants && product.variants.length > 0 && !opts.variantId) {
      setSheetProduct(product);
      setSheetSelectedVariant(product.variants[0].id);
      return;
    }

    const variantId = opts.variantId || (product.variants && product.variants[0] && product.variants[0].id) || null;
    const variant = product.variants?.find(v => v.id === variantId);
    const price = (variant ? variant.price : product.price);

    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === product.id && (i.variantId || null) === (variantId || null)
      );
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex].qty += 1;
        return copy;
      } else {
        return [...prev, {
          id: product.id,
          title: product.title,
          variantId,
          variantLabel: variant?.label || null,
          price,
          qty: 1
        }];
      }
    });

    // show mini-cart briefly (sticky)
    setMiniCartVisible(true);
    // briefly animate or highlight (CSS handles it)
  }

  function changeQty(index, delta) {
    setCart(prev => {
      const copy = [...prev];
      copy[index].qty = Math.max(0, copy[index].qty + delta);
      if (copy[index].qty === 0) copy.splice(index, 1);
      return copy;
    });
  }

  function removeItem(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function subtotal() {
    return cart.reduce((s, it) => s + (it.price * it.qty), 0);
  }

  function sheetAddToCart() {
    if (!sheetProduct) return;
    const variantId = sheetSelectedVariant;
    addToCart(sheetProduct, { variantId });
    setSheetProduct(null);
    setSheetSelectedVariant(null);
  }

  function openProductSheet(product) {
    // used by "Details" button
    setSheetProduct(product);
    setSheetSelectedVariant(product.variants?.[0]?.id || null);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src="/anant_gill_logo.png" alt="logo" className="logo" />
          <div>
            <h1 className="title">Anant Gill Agro Farm</h1>
            <div className="subtitle">Best quality fresh organic mushrooms &amp; delicious pickles</div>
          </div>
        </div>
        <button className="cart-button" onClick={() => setCartOpen(true)}>
          Cart {cart.length > 0 ? `(${cart.reduce((s, i)=>s+i.qty, 0)})` : ""}
        </button>
      </header>

      <main className="content">
        <h2 className="section-title">Our Products</h2>

        <div className="product-list">
          {PRODUCTS.map(prod => (
            <article key={prod.id} className="product-card">
              <div className="product-media">
                <img src={prod.image} alt={prod.title} />
              </div>
              <div className="product-body">
                <h3>{prod.title}</h3>
                <div className="unit">{prod.unit}</div>
                <div className="price-row">
                  <div className="price">{currency(prod.price)}</div>
                  <div className="actions">
                    <button className={`add-btn`} onClick={() => addToCart(prod)}>
                      Add to Cart
                    </button>
                    <button className="detail-btn" onClick={() => openProductSheet(prod)}>Details</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="cart-box">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            <div className="cart-summary">
              {cart.map((it, idx) => (
                <div className="cart-item" key={`${it.id}-${it.variantId || "v"}`}>
                  <div className="cart-item-title">{it.title}{it.variantLabel ? ` × ${it.variantLabel}` : ` × ${it.qty}`}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => changeQty(idx, -1)}>-</button>
                    <span className="cart-item-price">{currency(it.price)}</span>
                    <button onClick={() => changeQty(idx, +1)}>+</button>
                    <button className="remove" onClick={() => removeItem(idx)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="cart-subtotal">
                <div>Subtotal</div>
                <div className="subtotal-amount">{currency(subtotal())}</div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" />
            <h4>Anant Gill Agro Farm</h4>
            <div className="contact-line"><span>Phone:</span> <a href={`tel:${CONTACT.phone.replace(/\s+/g,"")}`}>{CONTACT.phone}</a></div>
            <div className="contact-line"><span>Email:</span> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
            <div className="contact-line address">{CONTACT.address}</div>
          </div>
          <div className="footer-right">
            <div className="follow-title">Follow</div>
            <div className="socials">
              <a className="social-btn" href={CONTACT.facebook} target="_blank" rel="noreferrer">FB</a>
              <a className="social-btn" href="#" target="_blank" rel="noreferrer">IG</a>
            </div>
            <div className="copyright">© 2025 Anant Gill Agro Farm</div>
          </div>
        </div>
      </footer>

      {/* Product sheet */}
      {sheetProduct && (
        <div className="sheet-overlay" role="dialog">
          <div className="sheet">
            <button className="sheet-close" onClick={() => setSheetProduct(null)}>✕</button>
            <div className="sheet-image">
              <img src={sheetProduct.image} alt={sheetProduct.title} />
            </div>
            <div className="sheet-body">
              <h3>{sheetProduct.title}</h3>
              <p className="sheet-desc">{sheetProduct.description}</p>

              {sheetProduct.variants && sheetProduct.variants.length > 0 && (
                <>
                  <div className="variant-title">Choose size / variant</div>
                  <div className="variants">
                    {sheetProduct.variants.map(v => {
                      const selected = v.id === sheetSelectedVariant;
                      return (
                        <label key={v.id} className={`variant-item ${selected ? "selected" : ""}`}>
                          <input
                            type="radio"
                            name="variant"
                            checked={selected}
                            onChange={() => setSheetSelectedVariant(v.id)}
                          />
                          <div className="variant-info">
                            <div className="variant-label">{v.label}</div>
                            <div className="variant-price">{currency(v.price)}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="sheet-actions">
                <button className="sheet-add" onClick={sheetAddToCart}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini-cart sticky */}
      {miniCartVisible && (
        <div className="mini-cart">
          <div className="mini-left">
            <div><strong>{cart.reduce((s, i) => s + i.qty, 0)} item</strong></div>
            <div className="mini-sub">Subtotal {currency(subtotal())}</div>
          </div>
          <div className="mini-right">
            <button className="view-cart" onClick={() => setCartOpen(true)}>View Cart</button>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="drawer-overlay" onClick={() => setCartOpen(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setCartOpen(false)}>✕</button>
            <h3>Cart</h3>
            {cart.length === 0 ? <div>Your cart is empty</div> : (
              <>
                {cart.map((it, idx) => (
                  <div key={`${it.id}-${it.variantId || "v"}`} className="drawer-item">
                    <div className="drawer-title">{it.title}{it.variantLabel ? ` — ${it.variantLabel}` : ""}</div>
                    <div className="drawer-controls">
                      <button onClick={() => changeQty(idx, -1)}>-</button>
                      <span>{it.qty}</span>
                      <button onClick={() => changeQty(idx, +1)}>+</button>
                      <button className="remove" onClick={() => removeItem(idx)}>Remove</button>
                    </div>
                    <div className="drawer-price">{currency(it.price * it.qty)}</div>
                  </div>
                ))}
                <div className="drawer-subtotal">
                  <div>Subtotal</div>
                  <div>{currency(subtotal())}</div>
                </div>
                <button className="checkout">Checkout (placeholder)</button>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
  }
