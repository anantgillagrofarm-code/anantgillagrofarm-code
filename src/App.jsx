// src/App.jsx
import React, { useState, useMemo } from "react";
import "./index.css";

/**
 * IMPORTANT:
 * - WhatsApp sending is implemented but OFF by default to avoid the blank-page issue
 * - To enable actual WhatsApp message send, set SEND_VIA_WHATSAPP = true
 */
const SEND_VIA_WHATSAPP = false; // <-- set true ONLY if you want to enable

const sampleProducts = [
  {
    id: "p1",
    title: "Fresh Mushrooms",
    subtitle: "per 200g box",
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    price: 50,
    variants: [
      { id: "v1", label: "200 g box", price: 50 },
      { id: "v2", label: "1 kg", price: 200 },
    ],
    img: "/assets/fresh-mushrooms.jpg",
  },
  {
    id: "p2",
    title: "Mushroom Pickle",
    subtitle: "per 200g jar",
    desc: "Tangy & spicy mushroom pickle made with traditional spices.",
    price: 100,
    variants: [
      { id: "v1", label: "200 g jar", price: 100 },
      { id: "v2", label: "400 g jar", price: 200 },
    ],
    img: "/assets/pickle.jpg",
  },
  {
    id: "p3",
    title: "Dry Mushrooms",
    subtitle: "per 100g",
    desc: "Dehydrated mushrooms, perfect for soups and long-term storage.",
    price: 300,
    variants: [{ id: "v1", label: "100 g", price: 300 }],
    img: "/assets/dried.jpg",
  },
  {
    id: "p4",
    title: "Mushroom Powder",
    subtitle: "per 200g",
    desc: "Powdered mushrooms for soups, sauces and seasoning.",
    price: 350,
    variants: [{ id: "v1", label: "200 g", price: 350 }],
    img: "/assets/powder.jpg",
  },
];

function Header({ onOpenCart, cartCount, onNavigate }) {
  return (
    <header className="site-header">
      <div className="brand">
        <img src="/assets/anant_gill_logo.png" alt="logo" className="logo" />
        <div>
          <div className="brand-title">Anant Gill Agro Farm</div>
          <div className="brand-sub">Quality mushrooms & preserves</div>
        </div>
      </div>
      <div className="header-actions">
        <button className="btn-outline" onClick={() => onNavigate("health")}>
          Health
        </button>
        <button className="cart-btn" onClick={onOpenCart}>
          Cart ({cartCount})
        </button>
      </div>
    </header>
  );
}

function ProductCard({ p, onOpen }) {
  return (
    <article className="card product-card">
      <div className="card-media">
        <img src={p.img} alt={p.title} />
      </div>
      <div className="card-body">
        <h3 className="card-title">{p.title}</h3>
        <div className="card-sub">{p.subtitle}</div>
        <p className="card-desc">{p.desc}</p>
        <div className="card-row">
          <div className="card-price">₹{p.price}</div>
          <div>
            <button className="btn" onClick={() => onOpen(p)}>
              Details
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => onOpen(p, { openQuickAdd: true })}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductModal({ product, onClose, onAddToCart }) {
  const [variantId, setVariantId] = useState(
    product?.variants?.[0]?.id ?? null
  );

  if (!product) return null;

  const chosen = product.variants.find((v) => v.id === variantId) || product.variants[0];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-media">
          <img src={product.img} alt={product.title} />
        </div>
        <h2>{product.title}</h2>
        <p className="modal-sub">{product.subtitle}</p>
        <p className="modal-desc">{product.desc}</p>

        <div className="variants">
          <div className="variants-title">Choose size / variant</div>
          {product.variants.map((v) => (
            <label key={v.id} className={`variant ${v.id === variantId ? "selected" : ""}`}>
              <input
                type="radio"
                name="variant"
                checked={v.id === variantId}
                onChange={() => setVariantId(v.id)}
              />
              <div>
                <strong>{v.label}</strong>
                <div className="variant-price">₹{v.price}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              onAddToCart(product, chosen);
              onClose();
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function HealthPage({ onBack }) {
  // Example health content (expandable).
  const items = [
    {
      title: "Fresh Mushrooms",
      summary:
        "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
      details:
        "Per 100 g (approx.): Calories 22 kcal, Protein 3 g, Fiber 1 g — contains B-vitamins, selenium and potassium.",
    },
    {
      title: "Mushroom Pickle",
      summary: "Tangy & spicy mushroom pickle made with traditional spices.",
      details:
        "Pickles are flavorful, preserving mushrooms — watch salt levels if on a low-sodium diet.",
    },
  ];

  return (
    <div className="health-page">
      <div className="health-header">
        <h1>Health & Nutrition</h1>
        <button className="btn-outline" onClick={onBack}>
          Back to shop
        </button>
      </div>

      <div className="health-intro card">
        <h3>Introduction</h3>
        <p>
          Mushrooms are nutrient-dense fungi prized for their savory flavor and
          versatile culinary uses. Low in calories and rich in B vitamins,
          vitamin D (when sun-exposed), potassium, selenium, fiber and unique
          antioxidants.
        </p>
      </div>

      {items.map((it, idx) => (
        <details key={idx} className="health-item card">
          <summary className="health-title">{it.title}</summary>
          <p className="health-summary">{it.summary}</p>
          <div className="health-details">{it.details}</div>
        </details>
      ))}

      <div style={{ height: 30 }} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/assets/anant_gill_logo.png" alt="logo" className="logo-small" />
          <div>
            <strong>Anant Gill Agro Farm</strong>
            <div>Contact: +91 99999 99999</div>
            <div>Address: Near XYZ, Your City, India</div>
          </div>
        </div>

        <div className="footer-follow">
          <div>Follow us</div>
          <div className="socials">
            <a href="#" aria-label="facebook" className="social">f</a>
            <a href="#" aria-label="instagram" className="social">i</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CheckoutModal({ open, onClose, cart, onPlaceOrder }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const total = useMemo(
    () => cart.reduce((s, it) => s + it.variant.price * it.qty, 0),
    [cart]
  );

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return open ? (
    <div className="overlay" onClick={onClose}>
      <div className="modal checkout" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h3>Place Order</h3>
        <p>Enter details so we can contact you to confirm the order.</p>

        <label className="field">
          <div>Name *</div>
          <input value={form.name} onChange={(e) => setField("name", e.target.value)} />
        </label>

        <label className="field">
          <div>Phone *</div>
          <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
        </label>

        <label className="field">
          <div>Email</div>
          <input value={form.email} onChange={(e) => setField("email", e.target.value)} />
        </label>

        <label className="field">
          <div>Address</div>
          <textarea value={form.address} onChange={(e) => setField("address", e.target.value)} />
        </label>

        <label className="field">
          <div>Note (optional)</div>
          <input value={form.note} onChange={(e) => setField("note", e.target.value)} />
        </label>

        <div className="checkout-summary">
          <div>Total:</div>
          <div>₹{total}</div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={() => onPlaceOrder({ form, cart, total })}
          >
            Place Order (COD)
          </button>

          <button
            className="btn"
            onClick={() => onPlaceOrder({ form, cart, total, pay: true })}
          >
            Pay & Place Order
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default function App() {
  const [page, setPage] = useState("shop"); // shop | health
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  function openProduct(p, opts = {}) {
    setSelected(p);
    setModalOpen(true);
    if (opts.openQuickAdd) {
      // if quick add we still show modal, user can choose default variant and add
    }
  }

  function addToCart(product, variant, qty = 1) {
    setCart((c) => {
      const existing = c.find((it) => it.product.id === product.id && it.variant.id === variant.id);
      if (existing) {
        return c.map((it) =>
          it === existing ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [...c, { product, variant, qty }];
    });
  }

  function removeFromCart(index) {
    setCart((c) => c.filter((_, i) => i !== index));
  }

  function placeOrder(data) {
    // data: { form, cart, total, pay }
    // If you want to send the order to WA: build message and open wa.me
    const { form, cart: orderCart, total } = data;

    const lines = [
      `Order from Anant Gill Agro Farm`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address || "-"}`,
      `Note: ${form.note || "-"}`,
      `---`,
      `Items:`,
      ...orderCart.map(
        (it) => `• ${it.product.title} (${it.variant.label}) x${it.qty} — ₹${it.variant.price * it.qty}`
      ),
      `---`,
      `Total: ₹${total}`,
    ];

    const msg = encodeURIComponent(lines.join("\n"));

    if (SEND_VIA_WHATSAPP) {
      // NOTE: this opens WhatsApp chat in a new tab (web) or WA app on mobile.
      // Replace phone number below with your business number in international format (no +)
      const phone = "919999999999"; // << change if you want; currently example placeholder
      const waUrl = `https://wa.me/${phone}?text=${msg}`;
      window.open(waUrl, "_blank");
    } else {
      // Fallback: show a confirm and clear cart for demo
      alert("Order placed (demo). WhatsApp sending is disabled.");
    }

    // After placing: clear cart and close checkout
    setCart([]);
    setCheckoutOpen(false);
  }

  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  return (
    <div className="app-root">
      <div className="bg-image" aria-hidden />

      <Header
        onOpenCart={() => setCheckoutOpen(true)}
        cartCount={cartCount}
        onNavigate={(p) => setPage(p)}
      />

      <main className="container">
        {page === "shop" && (
          <>
            <section className="hero card">
              <h1>Fresh Mushrooms, Farm to Table</h1>
              <p>We grow, process and pack premium mushrooms in small batches — straight from our farm to your kitchen.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => window.scrollTo({ top: 300, behavior: "smooth" })}>
                  Shop Fresh
                </button>
                <button className="btn btn-outline" onClick={() => setPage("health")}>
                  About us
                </button>
              </div>
            </section>

            <h2 className="section-title">Our Products</h2>

            <div className="products-grid">
              {sampleProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  onOpen={(product, opts) => openProduct(product, opts)}
                />
              ))}
            </div>
          </>
        )}

        {page === "health" && <HealthPage onBack={() => setPage("shop")} />}
      </main>

      <Footer />

      {/* Product details modal */}
      {isModalOpen && selected && (
        <ProductModal
          product={selected}
          onClose={() => {
            setSelected(null);
            setModalOpen(false);
          }}
          onAddToCart={(product, variant) => addToCart(product, variant)}
        />
      )}

      {/* Checkout modal */}
      <CheckoutModal
        open={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onPlaceOrder={placeOrder}
      />
    </div>
  );
        }
