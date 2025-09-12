// src/App.jsx
import React, { useState } from "react";
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";
import "./index.css"; // keep your existing CSS file

// fallback image path in case asset fails (public/anant_gill_logo.png)
const fallbackImg = "/anant_gill_logo.png";

// Simple currency formatter (INR)
const formatINR = (value) =>
  value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    price: 200,
    img: freshImg,
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    price: 250,
    img: pickleImg,
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    price: 600,
    img: dryImg,
    desc: "Sun-dried premium mushrooms — great for storage and soups.",
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    price: 450,
    img: powderImg,
    desc: "Finely ground mushroom powder — perfect for seasoning & gravies.",
  },
  {
    id: "p5",
    name: "Mushroom Warriyan",
    price: 300,
    img: wariyanImg,
    desc: "Traditional mushroom wadiyan — tasty protein-rich bites.",
  },
];

function ProductCard({ product, onAdd }) {
  const [imgSrc, setImgSrc] = useState(product.img);

  return (
    <div className="card">
      <div className="card-image">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(fallbackImg)}
          style={{ maxHeight: 200, objectFit: "cover", width: "100%" }}
        />
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="desc">{product.desc}</p>
        <p className="price">{formatINR(product.price)}</p>
        <button className="btn" onClick={() => onAdd(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function Cart({ items, onRemove }) {
  const total = items.reduce((s, it) => s + it.price, 0);

  return (
    <aside className="cart">
      <h3>Cart</h3>
      {items.length === 0 ? (
        <p>No items</p>
      ) : (
        <>
          <ul>
            {items.map((it, idx) => (
              <li key={idx} className="cart-item">
                <span>{it.name}</span>
                <span>{formatINR(it.price)}</span>
                <button className="small" onClick={() => onRemove(it.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total:</strong> <span>{formatINR(total)}</span>
          </div>
        </>
      )}
    </aside>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    // add product id so remove works correctly
    setCart((prev) => [...prev, { ...product }]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>Welcome to Anant Gill Agro Farm</h1>
        <p>Best quality fresh organic mushrooms & delicious pickles</p>
      </header>

      <main className="container">
        <section className="products-section">
          <h2>Our Products</h2>
          <div className="grid">
            {productsList.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <Cart items={cart} onRemove={removeFromCart} />
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Anant Gill Agro Farm</p>
      </footer>
    </div>
  );
}
