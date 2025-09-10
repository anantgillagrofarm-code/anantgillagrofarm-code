import React, { useState } from "react";

/* ---------- Config ---------- */
const PHONE_NUMBER = "918837554747"; // replace with your WhatsApp number (countrycode + number)
const LOGO_PATH = "/anant_gill_logo.png"; // keep this if your logo is in public/

/* ---------- Sample product list (change prices/descriptions later) ---------- */
const PRODUCTS = [
  { id: "p1", title: "Fresh Mushrooms (1 kg)", price: 200, desc: "Locally grown, fresh & organic." },
  { id: "p2", title: "Mushroom Pickle (500 g)", price: 500, desc: "Tangy, handmade pickle." },
  { id: "p3", title: "Dry Mushrooms (250 g)", price: 600, desc: "Sun-dried, long shelf life." },
  { id: "p4", title: "Mushroom Powder (100 g)", price: 400, desc: "Powdered for soups & recipes." }
];

/* ---------- Small UI components ---------- */
function ProductCard({ p, onAdd }) {
  return (
    <div style={{ border: "1px solid #e6e6e6", borderRadius: 10, padding: 12, background: "#fff", width: 260 }}>
      <div style={{ fontWeight: 700 }}>{p.title}</div>
      <div style={{ color: "#555", marginTop: 6 }}>{p.desc}</div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800 }}>₹{p.price}</div>
        <button onClick={() => onAdd(p)} style={{ background: "#25D366", color: "#083a22", border: "none", padding: "8px 12px", borderRadius: 8, fontWeight: 700 }}>
          Add
        </button>
      </div>
    </div>
  );
}

function Cart({ cart, onInc, onDec, onRemove, onWhatsApp }) {
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <div style={{ padding: 12, borderRadius: 10, background: "#fff", border: "1px solid #e6e6e6", width: 360 }}>
      <h3 style={{ marginTop: 0 }}>Your Cart</h3>
      {cart.length === 0 && <div style={{ color: "#666" }}>Cart is empty</div>}
      {cart.map(item => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{item.title}</div>
            <div style={{ color: "#666" }}>₹{item.price} × {item.qty} = <strong>₹{item.price * item.qty}</strong></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onDec(item.id)} style={{ padding: "6px 8px" }}>−</button>
              <div style={{ minWidth: 26, textAlign: "center" }}>{item.qty}</div>
              <button onClick={() => onInc(item.id)} style={{ padding: "6px 8px" }}>+</button>
            </div>
            <button onClick={() => onRemove(item.id)} style={{ background: "#f44336", color: "#fff", border: "none", padding: "6px 8px", borderRadius: 6 }}>Remove</button>
          </div>
        </div>
      ))}

      <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginBottom: 12 }}>
        <div>Subtotal</div>
        <div>₹{subtotal}</div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          disabled={cart.length === 0}
          onClick={() => onWhatsApp(cart)}
          style={{
            background: "#25D366",
            color: "#083a22",
            border: "none",
            padding: "10px 14px",
            borderRadius: 8,
            fontWeight: 800,
            flex: 1
          }}
        >
          Order via WhatsApp
        </button>
        <a
          href="#contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            textDecoration: "none",
            color: "#333",
            width: 48
          }}
          title="Contact"
        >
          ?
        </a>
      </div>
    </div>
  );
}

/* ---------- Main App ---------- */
export default function App() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
  }
  function incQty(id) {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  }
  function decQty(id) {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p));
  }
  function removeItem(id) {
    setCart(prev => prev.filter(p => p.id !== id));
  }

  function openWhatsAppWithOrder(cartItems) {
    if (!cartItems || cartItems.length === 0) return;
    // build message
    const lines = [];
    lines.push("Hi Anant Gill Agro Farm, I would like to place an order:");
    cartItems.forEach(ci => {
      lines.push(`${ci.title} — Qty: ${ci.qty} — ₹${ci.price * ci.qty}`);
    });
    const total = cartItems.reduce((s, it) => s + it.price * it.qty, 0);
    lines.push(`Total: ₹${total}`);
    lines.push("");
    lines.push("Name: ");
    lines.push("Phone: ");
    lines.push("Address: ");
    const message = encodeURIComponent(lines.join("%0A"));
    const url = `https://wa.me/${PHONE_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f7f6", minHeight: "100vh", color: "#083a22" }}>
      {/* NAV */}
      <div style={{ background: "#083a22", color: "#fff", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={LOGO_PATH} alt="logo" style={{ height: 46 }} />
          <div style={{ fontWeight: 800, fontSize: 18 }}>ANANT GILL AGRO FARM</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="#products" style={{ color: "#fff", textDecoration: "none" }}>Products</a>
          <a href="#about" style={{ color: "#fff", textDecoration: "none" }}>About</a>
          <a href="#contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</a>
        </div>
      </div>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "28px 18px", background: "linear-gradient(180deg,#0f3b1d, #083a22)", color: "#fff" }}>
        <h1 style={{ margin: 0 }}>Fresh Mushrooms & Homemade Pickles</h1>
        <p style={{ color: "#e6e6e6", marginTop: 8 }}>Order fresh from our farm — quick delivery & best quality.</p>
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", gap: 20, maxWidth: 1200, margin: "24px auto", padding: "0 12px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <section id="products">
            <h2 style={{ marginTop: 0 }}>Products</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {PRODUCTS.map(p => (
                <ProductCard key={p.id} p={p} onAdd={addToCart} />
              ))}
            </div>
          </section>

          <section id="about" style={{ marginTop: 28 }}>
            <h3>About</h3>
            <p style={{ color: "#555" }}>
              Anant Gill Agro Farm is a family-run farm specialising in mushrooms and mushroom products.
              We use natural methods to grow and prepare our products. Registered under MSME.
            </p>
          </section>
        </div>

        <aside style={{ width: 380 }}>
          <Cart cart={cart} onInc={incQty} onDec={decQty} onRemove={removeItem} onWhatsApp={openWhatsAppWithOrder} />
        </aside>
      </div>

      {/* CONTACT */}
      <footer id="contact" style={{ background: "#083a22", color: "#fff", padding: 18, textAlign: "center" }}>
        <div>© {new Date().getFullYear()} Anant Gill Agro Farm — Anant Foods (Brand)</div>
        <div style={{ marginTop: 6 }}>Phone: +91 88375 54747 • Email: youremail@example.com</div>
      </footer>
    </div>
  );
}
