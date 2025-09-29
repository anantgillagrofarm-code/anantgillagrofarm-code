// src/App.jsx
import React, { useState } from "react";
import "./index.css";

/*
  Defensive App.jsx: same UI as before but handles multiple imported-image shapes
  (some bundlers return a string, some return { default: string }).
*/

import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

/* Helper to resolve imported images safely */
function getSrc(maybeImport, fallback = "") {
  if (!maybeImport) return fallback;
  // If default property exists (Bundlers like webpack sometimes export {default: url})
  if (typeof maybeImport === "object" && maybeImport.default) return maybeImport.default;
  // If it's already a string url
  if (typeof maybeImport === "string") return maybeImport;
  // Otherwise fallback
  return fallback;
}

const PRODUCTS = [
  {
    id: "mush-001",
    name: "Fresh Mushrooms",
    unit: "per 200g box",
    price: 50,
    img: freshImg,
    short: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    intro:
      "Fresh button mushrooms are harvested at peak freshness and chilled immediately to retain texture and flavour.",
    benefits: [
      "Low in calories, high in umami flavour.",
      "Good source of B-vitamins (riboflavin, niacin).",
      "Contains antioxidants and helpful bioactive compounds."
    ],
    nutrition: {
      Calories: "22 kcal / 100g",
      Protein: "3.1 g",
      Carbs: "3.3 g",
      Fiber: "1.0 g",
      Potassium: "318 mg"
    }
  },
  {
    id: "mush-002",
    name: "Mushroom Pickle",
    unit: "per 200g jar",
    price: 100,
    img: pickleImg,
    short: "Tangy & spicy mushroom pickle made with traditional spices.",
    intro:
      "Our mushroom pickle is handcrafted using fresh mushrooms and traditional pickling spices for a tangy, long-lasting jar.",
    benefits: [
      "Adds concentrated flavour to meals.",
      "Can act as a probiotic when naturally fermented."
    ],
    nutrition: {
      Calories: "80 kcal / 100g (approx)",
      Fat: "6 g",
      Sodium: "High (pickled product)",
      Carbs: "4 g"
    }
  },
  {
    id: "mush-003",
    name: "Dry Mushrooms",
    unit: "per 100g",
    price: 300,
    img: dryImg,
    short: "Dehydrated mushrooms, perfect for long-term storage and soups.",
    intro:
      "Dry mushrooms are dehydrated to preserve flavour and nutrients. Rehydrate in warm water or add directly to soups and stews.",
    benefits: [
      "Long shelf life and concentrated flavour.",
      "Great for stocks, soups and powders."
    ],
    nutrition: {
      Calories: "260 kcal / 100g (dried)",
      Protein: "25 g",
      Fiber: "20 g"
    }
  },
  {
    id: "mush-004",
    name: "Mushroom Powder",
    unit: "per 100g",
    price: 350,
    img: powderImg,
    short: "Finely ground mushroom powder — great for soups, rubs & smoothies.",
    intro:
      "Powdered mushrooms are made from dried fruiting bodies and are an easy way to add umami and nutrients.",
    benefits: [
      "Convenient and concentrated flavour.",
      "Easy to measure and store."
    ],
    nutrition: {
      Calories: "250 kcal / 100g",
      Protein: "22 g",
      Fiber: "18 g"
    }
  },
  {
    id: "mush-005",
    name: "Mushroom Wariyan",
    unit: "per 100g packet",
    price: 120,
    img: wariyanImg,
    short: "Traditional mushroom wariyan — tasty & nutritious.",
    intro:
      "A regional favourite, mushroom wariyan is made using local seasoning and frying to create a crunchy snack.",
    benefits: ["Tasty snack option", "Rich umami flavour"],
    nutrition: {
      Calories: "300 kcal / 100g (approx)",
      Protein: "8 g"
    }
  }
];

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

  function addToCart() {
    setCartCount((c) => c + 1);
  }

  function toggleDetails(id) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  // safe resolved logo & footer background
  const logoSrc = "/anant_gill_logo.png";
  const footerBg = "/footer-mushrooms-v2.jpg";

  return (
    <div className="site-root">
      <header className="site-header">
        <div className="container header-row">
          <div className="brand">
            <img src={logoSrc} alt="Anant Gill Agro Farm" className="logo" />
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
                <img src={getSrc(p.img, "")} alt={p.name} />
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
                      onClick={() => addToCart()}
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

        <section className="card-summary" aria-labelledby="cart-title">
          <h3 id="cart-title">Cart</h3>
          <p>Your cart has {cartCount} item{cartCount === 1 ? "" : "s"}.</p>
        </section>

        <section className="health-section">
          <h2 className="section-title">Health & Nutrition — Mushrooms</h2>
          <p>
            Mushrooms are nutrient-rich fungi that provide vitamins (B2, B3, B5), minerals like potassium, and dietary fiber while remaining low in calories.
            They are a versatile ingredient — use them fresh, dried, pickled or powdered depending on your recipe.
          </p>

          <h4>Key benefits</h4>
          <ul>
            <li>Source of B-vitamins and minerals.</li>
            <li>Low-calorie, nutrient-dense food useful in weight-management diets.</li>
            <li>Contain antioxidants and bioactive compounds that support immune function.</li>
          </ul>

          <h4>Summary</h4>
          <p>
            Incorporate mushrooms into soups, stir-fries, salads and pickles to add flavour and nutrition. Dried mushrooms and powders are excellent for stocks and long-term storage.
          </p>
        </section>
      </main>

      <footer className="site-footer" style={{ backgroundImage: `url('${footerBg}')` }}>
        <div className="footer-inner">
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 10 }}>
              <img src={logoSrc} alt="logo" style={{ width: 56, height: 56, borderRadius: 10 }} />
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
