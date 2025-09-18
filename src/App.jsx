// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

/* Import product images from src/assets */
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/*
 Replace the address/contact values below directly here.
 Footer uses /footer-mushrooms.jpg from public/
*/

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    price: 40,
    unit: "per 200g box",
    image: freshImg,
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    price: 100,
    unit: "200g jar",
    image: pickleImg,
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    price: 300,
    unit: "per 100g",
    image: dryImg,
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    price: 450,
    unit: "per 100g",
    image: powderImg,
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    price: 120,
    unit: "per 100g packet",
    image: wariyanImg,
  },
];

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({}); // { productId: qty }
  const [sheetProduct, setSheetProduct] = useState(null); // optional detail sheet (not used to open large images automatically)

  // when the sheet OR the cart drawer is open, prevent body scrolling
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  function addToCart(productId, qty = 1) {
    setCart((c) => {
      const prev = c[productId] || 0;
      return { ...c, [productId]: prev + qty };
    });
  }

  function removeFromCart(productId) {
    setCart((c) => {
      const next = { ...c };
      delete next[productId];
      return next;
    });
  }

  function changeQty(productId, qty) {
    if (qty <= 0) return removeFromCart(productId);
    setCart((c) => ({ ...c, [productId]: qty }));
  }

  function cartItems() {
    return Object.keys(cart).map((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return {
        id,
        title: product?.title || id,
        qty: cart[id],
        price: product?.price || 0,
      };
    });
  }

  const subtotal = cartItems().reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="header-inner">
          <img src="/anant_gill_logo.png" alt="Anant Gill Agro Farm" className="logo" />
          <div className="site-title">
            <h1>Anant Gill Agro Farm</h1>
            <p className="tagline">Best quality fresh organic mushrooms &amp; delicious pickles</p>
          </div>

          <button
            className="cart-toggle"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            Cart
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="products-section">
          <h2 className="section-title">Our Products</h2>
          <div className="product-grid">
            {PRODUCTS.map((p) => (
              <article key={p.id} className="card product-card">
                <div className="product-image-wrap">
                  <img src={p.image} alt={p.title} className="product-image" />
                </div>

                <div className="card-body">
                  <h3 className="product-title">{p.title}</h3>
                  <p className="muted">{/* description could go here */}</p>

                  <div className="price-row">
                    <div className="price">₹{p.price}</div>
                    <div className="unit">{p.unit}</div>
                  </div>

                  <div className="card-actions">
                    <button className="btn btn-primary" onClick={() => addToCart(p.id)}>
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSheetProduct(p)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" />
            <h3 className="footer-title">Anant Gill Agro Farm</h3>

            <div className="contact">
              <div>
                <strong>Phone:</strong>{" "}
                <a href="tel:+918837554747" className="footer-link">+91 88375 54747</a>
              </div>
              <div>
                <strong>Email:</strong>{" "}
                <a href="mailto:anantgillagrofarm@gmail.com" className="footer-link footer-email">anantgillagrofarm@gmail.com</a>
              </div>
              <div className="address">
                Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001
              </div>
            </div>
          </div>

          <div className="footer-right">
            <div className="follow">Follow</div>
            <div className="social">
              <a href="#" aria-label="Instagram" className="social-icon">IG</a>
              <a href="#" aria-label="Facebook" className="social-icon">FB</a>
            </div>

            <div className="copyright">© 2025 Anant Gill Agro Farm</div>
          </div>
        </div>
      </footer>

      {/* CART OVERLAY: only renders when cartOpen === true */}
      {cartOpen && (
        <div
          className="cart-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // close when clicking outside panel
            if (e.target.classList.contains("cart-overlay")) setCartOpen(false);
          }}
        >
          <div className="cart-panel">
            <div className="cart-header">
              <h3>Cart</h3>
              <button className="close" onClick={() => setCartOpen(false)}>×</button>
            </div>

            <div className="cart-body">
              {cartItems().length === 0 ? (
                <div className="empty">Your cart is empty</div>
              ) : (
                cartItems().map((it) => (
                  <div key={it.id} className="cart-row">
                    <div className="cart-row-title">{it.title}</div>
                    <div className="cart-qty">
                      <button onClick={() => changeQty(it.id, it.qty - 1)}>-</button>
                      <span>{it.qty}</span>
                      <button onClick={() => changeQty(it.id, it.qty + 1)}>+</button>
                    </div>
                    <div className="cart-price">₹{it.price * it.qty}</div>
                    <button className="remove" onClick={() => removeFromCart(it.id)}>Remove</button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="subtotal">
                <div>Subtotal</div>
                <div className="amount">₹{subtotal.toFixed(2)}</div>
              </div>
              <button className="btn btn-primary fullwidth">Checkout (placeholder)</button>
            </div>
          </div>
        </div>
      )}

      {/* optional Product sheet modal */}
      {sheetProduct && (
        <div
          className="sheet-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("sheet-overlay")) setSheetProduct(null);
          }}
        >
          <div className="sheet-body">
            <button className="close" onClick={() => setSheetProduct(null)}>×</button>
            <img src={sheetProduct.image} alt={sheetProduct.title} className="sheet-image" />
            <h3>{sheetProduct.title}</h3>
            <p>Price: ₹{sheetProduct.price}</p>
            <p>{sheetProduct.unit}</p>
            <div className="sheet-actions">
              <button className="btn btn-primary" onClick={() => { addToCart(sheetProduct.id); setSheetProduct(null); }}>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
