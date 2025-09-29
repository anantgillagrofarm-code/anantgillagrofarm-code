import React, { useState } from "react";
import "./index.css";

/*
  App.jsx
  - Product list with expandable details (benefits + nutrition)
  - Simple cart count (local state only)
  - Use images placed under src/assets/... or public folder paths
*/

const PRODUCTS = [
  {
    id: "mush-001",
    name: "Fresh Mushrooms",
    unit: "per 200g box",
    price: 50,
    img: "/assets/button-mushrooms.jpg", // put your image at src/assets/ or public/assets/
    short:
      "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    intro:
      "Fresh button mushrooms are harvested at peak freshness and chilled immediately to retain texture and flavor.",
    benefits: [
      "Low in calories, high in umami flavour.",
      "Good source of B-vitamins (riboflavin, niacin).",
      "Supports immune health with bioactive compounds."
    ],
    nutrition: {
      "Calories": "22 kcal / 100g",
      "Protein": "3.1 g",
      "Carbs": "3.3 g",
      "Fiber": "1.0 g",
      "Vitamin D": "Variable (when sun-exposed)",
      "Potassium": "318 mg"
    }
  },
  {
    id: "mush-002",
    name: "Mushroom Pickle",
    unit: "per 200g jar",
    price: 100,
    img: "/assets/mushroom-pickle.jpg",
    short: "Tangy & spicy mushroom pickle made with traditional spices.",
    intro:
      "Our mushroom pickle is handcrafted using fresh mushrooms and traditional pickling spices for a tangy, long-lasting jar.",
    benefits: [
      "Makes meals more palatable and adds probiotic potential (when naturally fermented).",
      "Concentrated mushroom flavor — small amounts go a long way."
    ],
    nutrition: {
      "Calories": "80 kcal / 100g (approx)",
      "Fat": "6 g",
      "Sodium": "High (due to pickling)",
      "Carbs": "4 g"
    }
  },
  {
    id: "mush-003",
    name: "Dry Mushrooms",
    unit: "per 100g",
    price: 300,
    img: "/assets/dry-mushrooms.jpg",
    short:
      "Dehydrated mushrooms, perfect for long-term storage and soups.",
    intro:
      "Dry mushrooms are dehydrated to preserve flavor and nutrients. Rehydrate in warm water or add directly to soups and stews.",
    benefits: [
      "Long shelf life and concentrated flavor.",
      "Excellent for stocks, soups and as a powdered seasoning."
    ],
    nutrition: {
      "Calories": "260 kcal / 100g (dried)",
      "Protein": "25 g",
      "Fiber": "20 g",
      "Minerals": "Concentrated (potassium, iron)"
    }
  },
  {
    id: "mush-004",
    name: "Mushroom Powder",
    unit: "per 100g",
    price: 350,
    img: "/assets/mushroom-powder.jpg",
    short: "Finely ground mushroom powder — great for soups, rubs & smoothies.",
    intro:
      "Powdered mushrooms are made from dried fruiting bodies and are an easy way to add umami and nutrients.",
    benefits: [
      "Convenient — adds flavor and nutrition to many dishes.",
      "Easy to measure and store."
    ],
    nutrition: {
      "Calories": "250 kcal / 100g",
      "Protein": "22 g",
      "Fiber": "18 g"
    }
  }
];

// Simple helper to render nutrition object
function NutritionTable({ data }) {
  return (
    <table className="nutrition-table" aria-label="Nutritional values">
      <tbody>
        {Object.entries(data).map(([k, v]) => (
          <tr key={k}>
            <td className="nutrient-key">{k}</td>
            <td className="nutrient-val">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [openId, setOpenId] = useState(null);

  function addToCart(product) {
    setCartCount((c) => c + 1);
    // You can extend this to store items to localStorage or send to your backend later
  }

  function toggleDetails(id) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <div className="site-root">
      <header className="site-header">
        <div className="container header-row">
          <div className="brand">
            <img src="/assets/logo-square.png" alt="Anant Gill Agro Farm" className="logo" />
            <div>
              <div className="brand-title">Anant Gill Agro Farm</div>
              <div className="brand-sub">Best quality fresh organic mushrooms &amp; delicious pickles</div>
            </div>
          </div>

          <div className="header-actions">
            <div className="cart-bubble" aria-live="polite">Cart ({cartCount})</div>
          </div>
        </div>
      </header>

      <main className="container site-content">
        <h2 className="section-title">Our Products</h2>

        <div className="product-grid" role="list">
          {PRODUCTS.map((p) => (
            <article className="product-card" key={p.id} role="listitem" aria-labelledby={`p-${p.id}-title`}>
              <div className="thumb">
                <img src={p.img} alt={p.name} />
              </div>

              <div className="meta">
                <h3 id={`p-${p.id}-title`}>{p.name}</h3>
                <div className="subtitle">{p.unit}</div>
                <p className="description">{p.short}</p>

                <div className="actions">
                  <div className="price">₹{p.price}</div>

                  <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
                    <button
                      className="btn"
                      onClick={() => addToCart(p)}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={() => toggleDetails(p.id)}
                      aria-expanded={openId === p.id}
                    >
                      {openId === p.id ? "Hide" : "More"}
                    </button>
                  </div>
                </div>

                {/* Expandable details */}
                {openId === p.id && (
                  <div className="details-panel" role="region" aria-live="polite">
                    <h4>Introduction</h4>
                    <p>{p.intro}</p>

                    <h4>Health Benefits</h4>
                    <ul>
                      {p.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>

                    <h4>Nutritional values (per 100g)</h4>
                    <NutritionTable data={p.nutrition} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Cart summary panel */}
        <section className="card-summary" aria-labelledby="cart-title">
          <h3 id="cart-title">Cart</h3>
          <p>Your cart has {cartCount} item{cartCount === 1 ? "" : "s"}.</p>
        </section>

        {/* Health introduction & final summary */}
        <section className="health-section">
          <h2 className="section-title">Health & Nutrition — Mushrooms</h2>

          <p>
            Mushrooms are nutrient-rich fungi that provide vitamins (B2, B3, B5), minerals like potassium, and dietary fiber while remaining low in calories.
            Regular mushroom consumption supports balanced diets — they add umami, help reduce sodium needs in recipes, and contribute plant-based protein.
          </p>

          <h4>Key benefits</h4>
          <ul>
            <li>Source of B-vitamins and minerals.</li>
            <li>Low-calorie, nutrient-dense food useful in weight-management diets.</li>
            <li>Contain antioxidants and bioactive compounds that support immune function.</li>
          </ul>

          <h4>Summary</h4>
          <p>
            Incorporate mushrooms into soups, stir-fries, salads and pickles to add flavor and nutrition. Dried mushrooms and mushroom powder are excellent for stocks and long-term storage, while pickles can add probiotic potential and taste.
          </p>
        </section>
      </main>

      <footer className="site-footer" style={{ backgroundImage: "url('/assets/footer-bg.jpg')" }}>
        <div className="footer-inner">
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 10 }}>
              <img src="/assets/logo-square.png" alt="logo" style={{ width: 56, height: 56, borderRadius: 10 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Anant Gill Agro Farm</div>
                <div style={{ opacity: 0.95 }}>Phone: <a href="tel:+918837554747">+91 88375 54747</a></div>
                <div>Email: <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a></div>
              </div>
            </div>

            <p style={{ maxWidth: 720 }}>
              Gali No. 1, Baba Deep Singh Avenue, Village Nangli Bhatha, Amritsar 143001
            </p>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Follow</div>
              <div style={{ display: "flex", gap: 12 }}>
                <a aria-label="facebook" className="social-btn" href="#"><span>f</span></a>
                <a aria-label="instagram" className="social-btn" href="#"><span>📷</span></a>
              </div>
            </div>

            <div style={{ marginTop: 28, opacity: 0.95 }}>
              © {new Date().getFullYear()} Anant Gill Agro Farm
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
