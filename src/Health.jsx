// src/Health.jsx
import React, { useState } from "react";
import "./index.css";

function ToggleSection({ title, intro, nutrition, benefits }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="product-card"
      style={{ flexDirection: "column", alignItems: "flex-start" }}
    >
      <h2>{title}</h2>
      <p>{intro}</p>

      <button
        className="detail-btn"
        onClick={() => setOpen(!open)}
        style={{ marginTop: 8 }}
      >
        {open ? "Hide Nutrition & Benefits" : "Show Nutrition & Benefits"}
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          <h3>Approximate Nutrition (per 100 g)</h3>
          <ul>
            {nutrition.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
          <h3>Health Benefits</h3>
          <ul>
            {benefits.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function Health() {
  return (
    <div className="content">
      <h1 className="section-title">Mushrooms — Nutrition & Health Benefits</h1>

      {/* Introduction */}
      <section
        className="product-card"
        style={{ flexDirection: "column", alignItems: "flex-start" }}
      >
        <h2>Introduction</h2>
        <p>
          Mushrooms are nutrient-dense fungi prized for their savory flavor and
          versatile culinary uses. Low in calories and rich in B vitamins,
          vitamin D (when sun-exposed), potassium, selenium, fiber, and unique
          antioxidants like ergothioneine, mushrooms make a wholesome addition
          to everyday meals.
        </p>
      </section>

      {/* Fresh Mushrooms */}
      <ToggleSection
        title="Fresh Mushrooms"
        intro="Fresh button mushrooms are mild, slightly nutty and versatile — great for sautés, salads, soups and curries."
        nutrition={[
          "Calories: 22 kcal",
          "Protein: 3.1 g",
          "Carbs: 3.3 g (Fiber: 1 g, Sugars: 2 g)",
          "Fat: 0.3 g",
          "Potassium: 318 mg, Phosphorus: 86 mg, Selenium: 9–20 µg",
          "B vitamins: Niacin (B3), Riboflavin (B2), Pantothenic acid (B5)",
        ]}
        benefits={[
          "Low calorie, nutrient-dense food",
          "Supports energy metabolism (B vitamins)",
          "Good for heart & blood pressure (potassium)",
          "Antioxidants help protect cells",
        ]}
      />

      {/* Mushroom Pickle */}
      <ToggleSection
        title="Mushroom Pickle"
        intro="Tangy and spicy, mushroom pickle preserves mushrooms in flavorful spices and oil. A delicious condiment with meals, breads or rice."
        nutrition={[
          "Calories: 120–220 kcal",
          "Protein: 2–4 g",
          "Carbs: 6–12 g",
          "Fat: 8–18 g",
          "Sodium: 600–1500 mg (varies)",
        ]}
        benefits={[
          "Retains mushroom nutrients",
          "Spices provide antioxidants & digestive support",
          "Enjoy in moderation due to oil & salt",
        ]}
      />

      {/* Dry Mushrooms */}
      <ToggleSection
        title="Dry Mushrooms"
        intro="Dehydrated mushrooms have a long shelf life and intense flavor. Rehydrate to add umami depth to soups, curries, and gravies."
        nutrition={[
          "Calories: 200–350 kcal",
          "Protein: 20–30 g",
          "Carbs: 40–60 g (Fiber: 12–25 g)",
          "Fat: 2–6 g",
        ]}
        benefits={[
          "Nutrient-dense, concentrated protein & fiber",
          "Rich umami flavor, reduces need for added salt",
          "Convenient long-term storage",
        ]}
      />

      {/* Mushroom Powder */}
      <ToggleSection
        title="Mushroom Powder"
        intro="Finely ground mushrooms used as seasoning. A small amount adds rich flavor and extra nutrients to soups, sauces and gravies."
        nutrition={[
          "Calories: 250–350 kcal",
          "Protein: 20–30 g",
          "Carbs: 40–60 g (Fiber: 15–25 g)",
          "Fat: 2–6 g",
        ]}
        benefits={[
          "Easy way to add mushroom antioxidants",
          "Umami booster for recipes",
          "Shelf-stable & versatile",
        ]}
      />

      {/* Mushroom Wariyan */}
      <ToggleSection
        title="Mushroom Wariyan"
        intro="Traditional dried mushroom dumplings (wadiyan/wariyan) prepared with spices. A hearty addition to Punjabi-style curries and dals."
        nutrition={[
          "Calories: 200–350 kcal",
          "Protein: 12–25 g",
          "Carbs: 20–40 g (Fiber: 4–12 g)",
          "Fat: 6–18 g",
          "Sodium: varies",
        ]}
        benefits={[
          "Rich protein & fiber",
          "Spices add antioxidants",
          "Traditional flavor, convenient pantry item",
        ]}
      />

      {/* Summary */}
      <section
        className="product-card"
        style={{ flexDirection: "column", alignItems: "flex-start" }}
      >
        <h2>Summary</h2>
        <p>
          Fresh mushrooms are light and versatile. Dried mushrooms and powders
          concentrate nutrients and flavor. Pickles and wariyan bring tradition
          and taste. Together, they let you enjoy mushrooms in many forms —
          fresh, preserved, or seasoned — as part of a balanced diet.
        </p>
      </section>
    </div>
  );
}
