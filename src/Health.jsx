// src/Health.jsx
import React, { useState } from "react";

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
      <h3 style={{ marginTop: 0, color: "#14502b" }}>{title}</h3>
      <p style={{ color: "#444" }}>{intro}</p>

      <button
        className="detail-btn"
        onClick={() => setOpen(!open)}
        style={{ marginTop: 8 }}
      >
        {open ? "Hide Nutrition & Benefits" : "Show Nutrition & Benefits"}
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          <h4 style={{ marginBottom: 6 }}>Approximate Nutrition (per 100 g)</h4>
          <ul style={{ marginTop: 0, color: "#555" }}>
            {nutrition.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>

          <h4 style={{ marginBottom: 6, marginTop: 12 }}>Health Benefits</h4>
          <ul style={{ marginTop: 0, color: "#555" }}>
            {benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
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
          Mushrooms and mushroom-based products are valued not only for their
          unique taste but also for their nutritional and health-promoting
          qualities. At <strong>Anant Gill Agro Farm</strong>, we provide a
          variety of mushroom products — each with distinct nutritional values
          and health benefits.
        </p>
      </section>

      {/* Products */}
      <ToggleSection
        title="Fresh Mushrooms"
        intro="Hand-picked fresh button mushrooms — ideal for cooking & salads."
        nutrition={[
          "Calories: ~22 kcal",
          "Protein: 3.1 g",
          "Carbohydrates: 3.3 g",
          "Dietary Fiber: 1 g",
          "Fat: 0.3 g",
          "Rich in B vitamins (riboflavin, niacin, pantothenic acid)",
          "Minerals: selenium, potassium, copper",
        ]}
        benefits={[
          "Supports immune system due to natural antioxidants",
          "Good for weight management (low calorie, nutrient dense)",
          "Improves heart health by providing potassium",
          "Boosts energy with natural B vitamins",
        ]}
      />

      <ToggleSection
        title="Mushroom Pickle"
        intro="Tangy & spicy mushroom pickle made with traditional spices."
        nutrition={[
          "Calories: ~180 kcal (per 100 g, varies with oil/spice content)",
          "Protein: 2 g",
          "Carbohydrates: 8–10 g",
          "Fat: 15 g",
          "Sodium depends on salt content",
        ]}
        benefits={[
          "Combines mushroom nutrition with probiotics from pickling",
          "Spices add antioxidants and digestive support",
          "Provides energy and healthy fats",
        ]}
      />

      <ToggleSection
        title="Dry Mushrooms"
        intro="Dehydrated mushrooms, perfect for long-term storage and soups."
        nutrition={[
          "Calories: ~280 kcal",
          "Protein: 9–10 g",
          "Carbohydrates: 30 g",
          "Fiber: 10 g",
          "Low in fat (~1 g)",
          "Concentrated source of B vitamins & minerals",
        ]}
        benefits={[
          "Long shelf-life, nutrient dense",
          "Enhances flavor of soups, gravies, rice dishes",
          "Rich in antioxidants like ergothioneine",
          "Supports digestive health due to fiber",
        ]}
      />

      <ToggleSection
        title="Mushroom Powder"
        intro="Finely ground mushroom powder — perfect for seasoning."
        nutrition={[
          "Calories: ~300 kcal",
          "Protein: 20–25 g",
          "Carbohydrates: 40 g",
          "Fiber: 15 g",
          "Fat: 2–3 g",
          "Vitamins: B-complex, vitamin D (if sun-dried)",
        ]}
        benefits={[
          "Easy to add nutrition into soups, smoothies, or sauces",
          "Supports brain health and energy",
          "Provides natural umami flavor without additives",
          "Boosts immunity with antioxidants",
        ]}
      />

      <ToggleSection
        title="Mushroom Wariyan"
        intro="Traditional mushroom wadiyan — tasty & nutritious."
        nutrition={[
          "Calories: ~350 kcal",
          "Protein: 18–20 g",
          "Carbohydrates: 40 g",
          "Fiber: 10 g",
          "Fat: 5–6 g",
          "Rich in iron and plant-based protein",
        ]}
        benefits={[
          "Nutritious plant-based protein source",
          "Supports muscle growth & repair",
          "Good for vegetarians as an iron-rich food",
          "Adds unique flavor & nutrition to curries",
        ]}
      />

      {/* Closing summary */}
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
          Whether fresh, dried, powdered, or pickled, mushrooms are a powerhouse
          of nutrition. They provide low-calorie protein, fiber, essential
          vitamins, and minerals. Regular consumption may support immunity,
          energy, heart health, and overall wellbeing.
        </p>
      </section>
    </div>
  );
}
