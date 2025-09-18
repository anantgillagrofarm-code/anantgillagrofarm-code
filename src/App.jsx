// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/*
  IMPORTANT:
  - Product images are expected inside src/assets/ and imported below.
  - Footer background image should be in public/footer-mushrooms.jpg
  - Replace telephone/email/address/links here if you want further edits.
*/

import imgFresh from "./assets/fresh_mushrooms.jpg";
import imgPickle from "./assets/mushroom_pickle.jpg";
import imgDry from "./assets/dry_mushrooms.jpg";
import imgPowder from "./assets/mushroom_powder.jpg";
import imgWariyan from "./assets/mushroom_wariyan.jpg";

const PRODUCTS = [
  { id: "fresh", title: "Fresh Mushrooms", price: 40, unit: "per 200g box", image: imgFresh },
  { id: "pickle", title: "Mushroom Pickle", price: 100, unit: "200g jar", image: imgPickle },
  { id: "dry", title: "Dry Mushrooms", price: 300, unit: "per 100g", image: imgDry },
  { id: "powder", title: "Mushroom Powder", price: 450, unit: "per 100g", image: imgPowder },
  { id: "wariyan", title: "Mushroom Wariyan", price: 120, unit: "per 100g packet", image: imgWariyan },
];

function currency(num) {
  return `₹${Number(num).toFixed(2)}`;
}

export default function App() {
  // cart items: { id, title, price, qty }
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [animating, setAnimating] = useState(null); // product id for click animation

  // sheetProduct kept if you later use a product detail sheet; not used to open on AddToCart
  const [sheetProduct, setSheetProduct] = useState(null);

  // Lock body scroll when cart drawer or sheet is open
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  function addToCart(product) {
    setCart(prev => {
      const exists = prev.find(it => it.id === product.id);
      if (exists) {
        return prev.map(it => it.id === product.id ? { ...it, qty: it.qty + 1 } : it);
      } else {
        return [...prev, { id: product.id, title: product.title, price: product.price, qty: 1 }];
      }
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function changeQty(id, delta) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Add-to-cart click handler with animation and showing mini bar
  function handleAddClick(product) {
    addToCart(product);
    // briefly animate button
    setAnimating(product.id);
    setTimeout(() => setAnimating(null), 250);
  }

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand">
          <img src="/anant_gill_logo.png" alt="Anant Gill logo" className="logo-small" />
          <div>
            <h1>Anant Gill Agro Farm</h1>
            <p className="tagline">Best quality fresh organic mushrooms & delicious pickles</p>
          </div>
        </div>

        <div className="cart-button-wrap">
          <button className="cart-toggle" onClick={() => setCartOpen(true)}>
            Cart {cart.length > 0 ? `(${cart.length})` : ""}
          </button>
        </div>
      </header>

      <main className="content">
        <h2 className="section-title">Our Products</h2>

        <section className="products-grid">
          {PRODUCTS.map(prod => (
            <article className="product-card" key={prod.id}>
              <div className="product-image">
                <img src={prod.image} alt={prod.title} />
              </div>
              <div className="product-body">
                <h3>{prod.title}</h3>
                <p className="unit">{prod.unit}</p>
                <div className="price-row">
                  <div className="price">{currency(prod.price)}</div>
                  <div className="actions">
                    <button
                      className={`add-to-cart ${animating === prod.id ? "clicked" : ""}`}
                      onClick={() => handleAddClick(prod)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="details"
                      onClick={() => setSheetProduct(prod)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="cart-card">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <div className="empty">Your cart is empty</div>
          ) : (
            <div>
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <div>{item.title} × {item.qty}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => changeQty(item.id, -1)}>-</button>
                    <span className="cart-price">{currency(item.price * item.qty)}</span>
                    <button onClick={() => changeQty(item.id, +1)}>+</button>
                    <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="cart-footer">
                <div>Subtotal</div>
                <div className="subtotal">{currency(subtotal)}</div>
              </div>
            </div>
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
            <p><strong>Email:</strong> <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></p>
            <p>Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</p>
          </div>

          <div className="footer-right">
            <h4>Follow</h4>
            <div className="socials">
              <a className="social-btn" href="https://www.facebook.com/share/177NfwxRKr/" target="_blank" rel="noreferrer">FB</a>
              <a className="social-btn" href="#" target="_blank" rel="noreferrer">IG</a>
            </div>
            <div className="copyright">© 2025 Anant Gill Agro Farm</div>
          </div>
        </div>
      </footer>

      {/* Mini cart bar (sticky) */}
      {cart.length > 0 && (
        <div className="mini-cart-bar" onClick={() => setCartOpen(true)}>
          <div className="mini-left">
            <div className="mini-count">{cart.length} item{cart.length > 1 ? "s" : ""}</div>
            <div className="mini-sub">Subtotal {currency(subtotal)}</div>
          </div>
          <div className="mini-right">
            <button className="mini-view">View Cart</button>
          </div>
        </div>
      )}

      {/* Right-side cart drawer */}
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Cart</h3>
          <button className="close-drawer" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty">Your cart is empty</div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="drawer-item">
                  <div>
                    <div className="drawer-item-title">{item.title}</div>
                    <div className="drawer-item-qty">Qty: {item.qty}</div>
                  </div>
                  <div>
                    <div className="drawer-item-price">{currency(item.price * item.qty)}</div>
                    <div className="drawer-item-controls">
                      <button onClick={() => changeQty(item.id, -1)}>-</button>
                      <button onClick={() => changeQty(item.id, +1)}>+</button>
                      <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
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

      {/* Optional product sheet modal (if you click Details) */}
      {sheetProduct && (
        <div className="sheet-overlay" onClick={() => setSheetProduct(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setSheetProduct(null)}>✕</button>
            <img src={sheetProduct.image} alt={sheetProduct.title} className="sheet-image" />
            <h3>{sheetProduct.title}</h3>
            <p>{currency(sheetProduct.price)} • {sheetProduct.unit}</p>
            <p>Product details placeholder...</p>
            <div className="sheet-actions">
              <button onClick={() => { handleAddClick(sheetProduct); setSheetProduct(null); }}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
