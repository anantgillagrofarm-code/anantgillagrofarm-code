// src/App.jsx
import React, { useState } from "react";
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";
import logo from "./assets/anant_gill_logo.png";
import "./index.css";

/* format rupee */
const formatINR = (value) =>
  value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const productsList = [
  { id: "p1", name: "Fresh Mushrooms", price: 200, img: freshImg, desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads." },
  { id: "p2", name: "Mushroom Pickle", price: 250, img: pickleImg, desc: "Tangy & spicy mushroom pickle made with traditional spices." },
  { id: "p3", name: "Dry Mushrooms", price: 600, img: dryImg, desc: "Carefully sun-dried mushrooms for long shelf-life and rich flavor." },
  { id: "p4", name: "Mushroom Powder", price: 450, img: powderImg, desc: "Fine mushroom powder — great as seasoning or in soups." },
  { id: "p5", name: "Mushroom Wariyan", price: 120, img: wariyanImg, desc: "Traditional mushroom wariyan — tasty and ready-to-cook." }
];

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((p) => [...p, product]);
  };
  const removeFromCart = (index) => {
    setCart((p) => p.filter((_, i) => i !== index));
  };
  const total = cart.reduce((s, it) => s + it.price, 0);

  return (
    <div>
      <header className="hero">
        <img src={logo} alt="Anant Gill Logo" style={{ maxWidth: 140, display: "block", margin: "0 auto 8px" }} />
        <h1>Welcome to Anant Gill Agro Farm</h1>
        <p>Best quality fresh organic mushrooms & delicious pickles</p>
      </header>

      <main className="container">
        <section className="products-section">
          <h2>Our Products</h2>
          <div className="grid">
            {productsList.map((p) => (
              <article key={p.id} className="card">
                <div className="card-image">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="card-body">
                  <h3>{p.name}</h3>
                  <div className="desc">{p.desc}</div>
                  <div className="price">{formatINR(p.price)}</div>
                  <button className="btn" onClick={() => addToCart(p)}>Add to Cart</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart">
          <h3>Cart</h3>
          {cart.length === 0 ? <p style={{ color: "#666" }}>Your cart is empty</p> : (
            <>
              <ul>
                {cart.map((it, idx) => (
                  <li key={idx} className="cart-item">
                    <div>
                      <strong>{it.name}</strong>
                      <div style={{ color: "#666", fontSize: 13 }}>{formatINR(it.price)}</div>
                    </div>
                    <div>
                      <button className="btn small" onClick={() => removeFromCart(idx)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <div>Total</div>
                <div>{formatINR(total)}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn">Checkout</button>
              </div>
            </>
          )}
        </aside>
      </main>

      <footer className="footer">© {new Date().getFullYear()} Anant Gill Agro Farm</footer>
    </div>
  );
}

export default App;
