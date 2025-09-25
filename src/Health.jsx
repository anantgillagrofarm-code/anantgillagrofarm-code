// src/Health.jsx
import React from "react";
import "./index.css";

export default function Health() {
  return (
    <div className="content">
      <h1 className="section-title">Mushrooms — Nutrition & Health Benefits</h1>

      <section className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h2>Introduction</h2>
        <p>
          Mushrooms are nutrient-dense fungi prized for their savory flavor and versatile culinary uses.
          Low in calories and rich in B vitamins, vitamin D (when sun-exposed), potassium, selenium, fiber,
          and unique antioxidants like ergothioneine, mushrooms make a wholesome addition to everyday meals.
        </p>
      </section>

      {/* Fresh Mushrooms */}
      <section className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h2>Fresh Mushrooms</h2>
        <p>
          Fresh button mushrooms are mild, slightly nutty and versatile — great for sautés, salads, soups and curries.
          They’re picked young and sold fresh to preserve flavor and texture.
        </p>
        <h3>Approximate Nutrition (per 100 g)</h3>
        <ul>
          <li>Calories: 22 kcal</li>
          <li>Protein: 3.1 g</li>
          <li>Carbs: 3.3 g (Fiber: 1 g, Sugars: 2 g)</li>
          <li>Fat: 0.3 g</li>
          <li>Potassium: 318 mg, Phosphorus: 86 mg, Selenium: 9–20 µg</li>
          <li>B vitamins: Niacin (B3), Riboflavin (B2), Pantothenic acid (B5)</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Low calorie, nutrient-dense food</li>
          <li>Supports energy metabolism (B vitamins)</li>
          <li>Good for heart & blood pressure (potassium)</li>
          <li>Antioxidants help protect cells</li>
        </ul>
      </section>

      {/* Mushroom Pickle */}
      <section className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h2>Mushroom Pickle</h2>
        <p>
          Tangy and spicy, mushroom pickle preserves mushrooms in flavorful spices and oil. A delicious condiment
          with meals, breads or rice.
        </p>
        <h3>Approximate Nutrition (per 100 g)</h3>
        <ul>
          <li>Calories: 120–220 kcal</li>
          <li>Protein: 2–4 g</li>
          <li>Carbs: 6–12 g</li>
          <li>Fat: 8–18 g</li>
          <li>Sodium: 600–1500 mg (varies)</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Retains mushroom nutrients</li>
          <li>Spices provide antioxidants & digestive support</li>
          <li>Enjoy in moderation due to oil & salt</li>
        </ul>
      </section>

      {/* Dry Mushrooms */}
      <section className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h2>Dry Mushrooms</h2>
        <p>
          Dehydrated mushrooms have a long shelf life and intense flavor. Rehydrate to add umami depth to soups,
          curries, and gravies.
        </p>
        <h3>Approximate Nutrition (per 100 g, dried)</h3>
        <ul>
          <li>Calories: 200–350 kcal</li>
          <li>Protein: 20–30 g</li>
          <li>Carbs: 40–60 g (Fiber: 12–25 g)</li>
          <li>Fat: 2–6 g</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Nutrient-dense, concentrated protein & fiber</li>
          <li>Rich umami flavor, reduces need for added salt</li>
          <li>Convenient long-term storage</li>
        </ul>
      </section>

      {/* Mushroom Powder */}
      <section className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h2>Mushroom Powder</h2>
        <p>
          Finely ground mushrooms used as seasoning. A small amount adds rich flavor and extra nutrients to soups,
          sauces and gravies.
        </p>
        <h3>Approximate Nutrition (per 100 g)</h3>
        <ul>
          <li>Calories: 250–350 kcal</li>
          <li>Protein: 20–30 g</li>
          <li>Carbs: 40–60 g (Fiber: 15–25 g)</li>
          <li>Fat: 2–6 g</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Easy way to add mushroom antioxidants</li>
          <li>Umami booster for recipes</li>
          <li>Shelf-stable & versatile</li>
        </ul>
      </section>

      {/* Mushroom Wariyan */}
      <section className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h2>Mushroom Wariyan</h2>
        <p>
          Traditional dried mushroom dumplings (wadiyan/wariyan) prepared with spices. A hearty addition to
          Punjabi-style curries and dals.
        </p>
        <h3>Approximate Nutrition (per 100 g, recipe-dependent)</h3>
        <ul>
          <li>Calories: 200–350 kcal</li>
          <li>Protein: 12–25 g</li>
          <li>Carbs: 20–40 g (Fiber: 4–12 g)</li>
          <li>Fat: 6–18 g</li>
          <li>Sodium: varies</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Rich protein & fiber</li>
          <li>Spices add antioxidants</li>
          <li>Traditional flavor, convenient pantry item</li>
        </ul>
      </section>

      <section className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h2>Summary</h2>
        <p>
          Fresh mushrooms are light and versatile. Dried mushrooms and powders concentrate nutrients and flavor.
          Pickles and wariyan bring tradition and taste. Together, they let you enjoy mushrooms in many forms —
          fresh, preserved, or seasoned — as part of a balanced diet.
        </p>
      </section>
    </div>
  );
}
