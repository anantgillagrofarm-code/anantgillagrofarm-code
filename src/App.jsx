// src/App.jsx
import React, { useState } from "react";
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";
import logo from "./assets/anant_gill_logo.png"; // if logo is in public/, change to: const logoPublic = "/anant_gill_logo.png";
import "./index.css";

/* currency */
const toINR = (v) => v.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const productsList = [
  { id: "p1", name: "Fresh Mushrooms", price: 30, unitLabel: "per 200g box", priceNote: "₹200 / kg also available", img: freshImg, desc: "Hand-picked fresh mushrooms, ideal for cooking & salads." },
  { id: "p2", name: "Mushroom Pickle (200g)", price: 100, unitLabel: "200g jar", img: pickleImg, desc: "Tangy & spicy mushroom pickle — small jar." },
  { id: "p2b", name: "Mushroom Pickle (400g)", price: 200, unitLabel: "400g jar", img: pickleImg, desc: "Family pack — 400g jar." },
  { id: "p3", name: "Dry Mushrooms", price: 800, unitLabel: "per kg", img: dryImg, desc: "Premium sun-dried mushrooms — rich flavor." },
  { id: "p4", name: "Mushroom Powder", price: 450, unitLabel: "per 100g", img: powderImg, desc: "Finely ground powder — seasoning & soups." },
  { id: "p5", name: "Mushroom Wariyan", price: 120, unitLabel: "per 100g packet", img: wariyanImg, desc: "Traditional mushroom wadiyan — nutritious snack." }
];

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + qty } : p);
      return [...prev, { ...product, qty }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    setCart((prev) => prev.map((p) => p.id === id ? { ...p, qty } : p));
  };

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <div>
      <header className="header">
        <div className="brand">
          <img src={logo} alt="Anant Gill Logo" className="logo" />
          <div>
            <h1>Anant Gill Agro Farm</h1>
            <p className="muted">Fresh organic mushrooms & homemade pickles</p>
          </div>
        </div>
      </header>

      <div className="container">
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="section-title">Our Products</h2>
            <div style={{ color: "var(--muted)" }}>Quality checked • Packaged with care</div>
          </div>

          <div className="grid">
            {productsList.map((p) => (
              <article key={p.id} className="card">
                <div className="img-wrap">
                  <img src={p.img} alt={p.name} onError={(e)=> e.currentTarget.src = logo} />
                </div>

                <div className="body">
                  <h3>{p.name}</h3>
                  <div className="desc">{p.desc}</div>

                  <div className="price-row" style={{ marginTop: 12 }}>
                    <div>
                      <div className="price-main">{toINR(p.price)}</div>
                      <div className="unit">{p.unitLabel}{p.priceNote ? ` • ${p.priceNote}` : ""}</div>
                    </div>

                    <div>
                      <button className="btn" onClick={() => addToCart(p, 1)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart">
          <h3>Cart</h3>

          {cart.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Your cart is empty</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((it) => (
                  <li key={it.id} className="cart-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{it.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: 13 }}>{toINR(it.price)} • {it.unitLabel}</div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="qty">
                        <button onClick={() => updateQty(it.id, it.qty - 1)} className="qty-btn">-</button>
                        <div>{it.qty}</div>
                        <button onClick={() => updateQty(it.id, it.qty + 1)} className="qty-btn">+</button>
                      </div>
                      <button className="btn secondary" onClick={() => updateQty(it.id, 0)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-total">
                <div>Subtotal</div>
                <div style={{ color: "var(--accent)", fontWeight: 700 }}>{toINR(subtotal)}</div>
              </div>

              <button className="btn" style={{ width: "100%", marginTop: 12 }} onClick={() => alert("Checkout placeholder — integrate Razorpay later")}>
                Checkout
              </button>
            </>
          )}
        </aside>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Anant Gill Agro Farm • Contact: +91 88375 54747
      </footer>
    </div>
  );
}
