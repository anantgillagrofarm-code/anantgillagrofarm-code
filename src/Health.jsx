// src/Health.jsx
import React, { useState } from "react";

/*
  Health.jsx
  - Toggle-style sections for each product
  - Uses the .toggle-content and .toggle-content.open classes from src/index.css
*/

function ToggleSection({ title, intro, nutrition, benefits }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0, color: "#14502b" }}>{title}</h3>
          <p style={{ color: "#444", marginBottom: 8 }}>{intro}</p>
        </div>

        <div style={{ flexShrink: 0 }}>
          <button
            className="detail-btn"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={`toggle-${title.replace(/\s+/g, "-").toLowerCase()}`}
            style={{ marginTop: 6 }}
          >
            {open ? "Hide Nutrition & Benefits" : "Show Nutrition & Benefits"}
          </button>
        </div>
      </div>

      {/* Animated content area */}
      <div
        id={`toggle-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className={`toggle-content ${open ? "open" : ""}`}
        aria-hidden={!open}
        style={{ marginTop: 12 }}
      >
        <h4 style={{ marginBottom: 6 }}>Approximate Nutrition (per 100 g)</h4>
        <ul>
          {nutrition.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>

        <h4 style={{ marginBottom: 6, marginTop: 12 }}>Health Benefits</h4>
        <ul>
          {benefits.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Health() {
  return (
    <div>
      {/* Introduction */}
      <section
        style={{
          background: "white",
          padding: 16,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}
      >
        <h2 style={{ marginTop: 0, color: "#14502b" }}>Introduction</h2>
        <p style={{ color: "#444" }}>
          Mushrooms are nutrient-dense fungi prized for their savory flavor and versatile culinary uses.
          Low in calories and rich in B vitamins, vitamin D (when sun-exposed), potassium, selenium, fiber,
          and unique antioxidants like ergothioneine, mushrooms make a wholesome addition to everyday meals.
        </p>
        <p style={{ color: "#444", marginTop: 8 }}>
          Below you can expand each product to read approximate nutrition and suggested health benefits.
          Values are representative estimates per 100 g — for exact label values use lab testing or a nutrition calculator based on your recipes.
        </p>
      </section>

      {/* Products */}
      <ToggleSection
        title="Fresh Mushrooms"
        intro="Hand-picked fresh button mushrooms — ideal for cooking & salads."
        nutrition={[
          "Calories: ~22 kcal",
          "Protein: 3.1 g",
          "Carbohydrates: 3.3 g (Fiber: 1 g, Sugars: 2 g)",
          "Fat: 0.3 g",
          "Potassium: ~318 mg; Phosphorus: ~86 mg; Selenium: ~9–20 µg",
          "B vitamins: niacin (B3), riboflavin (B2), pantothenic acid (B5)",
        ]}
        benefits={[
          "Low-calorie, nutrient-dense — great for weight management",
          "B vitamins support energy metabolism",
          "Potassium supports healthy blood pressure",
          "Antioxidants (ergothioneine & selenium) protect cells from oxidative stress",
        ]}
      />

      <ToggleSection
        title="Mushroom Pickle"
        intro="Tangy & spicy mushroom pickle made with traditional spices; a flavorful condiment."
        nutrition={[
          "Calories: ~120–220 kcal (varies by oil content)",
          "Protein: 2–4 g",
          "Carbohydrates: 6–12 g",
          "Fat: 8–18 g",
          "Sodium: can be high — often 600–1500 mg depending on recipe",
        ]}
        benefits={[
          "Retains mushroom nutrients while adding spice-derived phytonutrients",
          "Spices can aid digestion and provide antioxidants",
          "Enjoy in moderation due to higher sodium & oil content",
        ]}
      />

      <ToggleSection
        title="Dry Mushrooms"
        intro="Dehydrated mushrooms, perfect for long-term storage and for enriching soups and gravies."
        nutrition={[
          "Calories: ~200–350 kcal (concentrated)",
          "Protein: 20–30 g (varies by variety)",
          "Carbohydrates: 40–60 g",
          "Fiber: 12–25 g",
          "Fat: 2–6 g",
        ]}
        benefits={[
          "Concentrated nutrients make dried mushrooms a powerful pantry ingredient",
          "High fiber supports digestion",
          "Strong umami flavor reduces need for extra salt",
          "Rich in antioxidants and minerals",
        ]}
      />

      <ToggleSection
        title="Mushroom Powder"
        intro="Finely ground mushroom powder — a convenient seasoning to boost flavor and nutrition."
        nutrition={[
          "Calories: ~250–350 kcal",
          "Protein: 20–30 g",
          "Carbohydrates: 40–60 g",
          "Fiber: 15–25 g",
          "Fat: 2–6 g",
        ]}
        benefits={[
          "Easy way to add mushroom-derived antioxidants to recipes",
          "Adds natural umami, reducing dependence on processed flavorings",
          "Highly shelf-stable and versatile for sauces, rubs and soups",
        ]}
      />

      <ToggleSection
        title="Mushroom Wariyan"
        intro="Traditional mushroom wariyan (wadiyan) — seasoned, dried morsels used in curries and snacks."
        nutrition={[
          "Calories: ~200–350 kcal (recipe-dependent)",
          "Protein: 12–25 g",
          "Carbohydrates: 20–40 g",
          "Fiber: 4–12 g",
          "Fat: 6–18 g (if oil or flours used)",
        ]}
        benefits={[
          "Good plant-based protein and fiber source",
          "Spices used add antioxidants and flavor",
          "Convenient and tasty addition to traditional dishes",
        ]}
      />

      {/* Summary */}
      <section
        style={{
          background: "white",
          padding: 16,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
          marginTop: 20,
        }}
      >
        <h2 style={{ marginTop: 0, color: "#14502b" }}>Summary</h2>
        <p style={{ color: "#444" }}>
          Fresh, dried, powdered or pickled — mushrooms come in many forms that suit different cooking needs.
          Fresh mushrooms are low-calorie and versatile; dried and powdered forms concentrate nutrients and flavor;
          pickles and wariyan offer traditional taste. Together they help you add variety, nutrition and umami to your meals.
        </p>
      </section>
    </div>
  );
}
