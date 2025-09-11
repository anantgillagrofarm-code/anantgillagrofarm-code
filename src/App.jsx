// src/App.jsx
import React, { useState } from "react";
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";
import "./index.css"; // keep your existing styles (tailwind or custom)

// Simple currency formatter (INR)
const formatINR = (value) =>
  value.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    price: 200,
    img: freshImg,
    desc: "Hand-picked fresh button mushrooms — perfect for cooking.",
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    price: 250,
    img: pickleImg,
    desc: "Tangy & spicy mushroom pickle made with local spices.",
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    price: 600,
    img: dryImg,
    desc: "Premium sun-dried mushrooms — long shelf life, concentrated flavor.",
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    price: 450,
    img: powderImg,
    desc: "Finely ground mushroom powder — use in soups, gravies, shakes.",
  },
  {
    id: "p5",
    name: "Mushroom Warriyan",
    price: 180,
    img: wariyanImg,
    desc: "Traditional mushroom wadiyan — savory snack / cooking ingredient.",
  },
];

function ProductCard({ product, onAdd }) {
  return (
    <div className="card" style={cardStyle}>
      <div style={imgWrapStyle}>
        <img
          src={product.img}
          alt={product.name}
          style={imgStyle}
          onError={(e) => {
            // fallback if image missing
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
                <rect width='100%' height='100%' fill='#f3f4f6'/>
                <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='18'>
                  Image not available
                </text></svg>`);
          }}
        />
      </div>

      <h3 style={{ margin: "10px 0 6px", textAlign: "center" }}>{product.name}</h3>
      <p style={{ fontSize: 14, color: "#374151", textAlign: "center", minHeight: 36 }}>
        {product.desc}
      </p>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ color: "#047857" }}>{formatINR(product.price)}</strong>
        <button style={btnStyle} onClick={() => onAdd(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      // increase qty if already exists
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
        .filter(Boolean)
    );
  };

  const total = cart.reduce((s, item) => s + item.price * item.qty, 0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <header style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ color: "#047857", margin: 0 }}>Welcome to Anant Gill Agro Farm</h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>Best quality fresh organic mushrooms & delicious pickles</p>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        <section>
          <h2 style={{ marginBottom: 12 }}>Our Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
            {productsList.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <aside style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Cart</h3>
          {cart.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{formatINR(item.price)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={qtyBtnStyle}>-</button>
                    <div>{item.qty}</div>
                    <button onClick={() => changeQty(item.id, +1)} style={qtyBtnStyle}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ ...smallBtnStyle, marginLeft: 8 }}>Remove</button>
                </div>
              ))}

              <hr style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <div>Total</div>
                <div style={{ color: "#047857" }}>{formatINR(total)}</div>
              </div>

              <button
                style={{ marginTop: 12, width: "100%", padding: "10px 12px", background: "#047857", color: "#fff", borderRadius: 6, border: "none" }}
                onClick={() => alert("Checkout placeholder — integrate Razorpay when ready")}
              >
                Checkout
              </button>
            </div>
          )}
        </aside>
      </main>

      <footer style={{ textAlign: "center", marginTop: 36, color: "#9ca3af" }}>
        © {new Date().getFullYear()} Anant Gill Agro Farm
      </footer>
    </div>
  );
}

/* --- inline styles (simple) --- */
const cardStyle = {
  borderRadius: 12,
  boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
  padding: 16,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: 320,
};

const imgWrapStyle = {
  height: 150,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  marginBottom: 8,
};

const imgStyle = { maxWidth: "100%", maxHeight: "100%", objectFit: "cover", borderRadius: 6 };

const btnStyle = {
  background: "#059669",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer",
};

const qtyBtnStyle = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  padding: "4px 8px",
  borderRadius: 4,
  cursor: "pointer",
};

const smallBtnStyle = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  padding: "6px 8px",
  borderRadius: 6,
  cursor: "pointer",
};
