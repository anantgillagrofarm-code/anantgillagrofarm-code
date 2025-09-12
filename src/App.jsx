// src/App.jsx
import React, { useState } from "react";
import "./index.css";

// Product images from src/assets
import freshImg from "./assets/fresh_mushrooms.jpg";
import pickleImg from "./assets/mushroom_pickle.jpg";
import dryImg from "./assets/dry_mushrooms.jpg";
import powderImg from "./assets/mushroom_powder.jpg";
import wariyanImg from "./assets/mushroom_wariyan.jpg";

// Product list with variants
const productsList = [
  {
    id: "p1",
    name: "Fresh Mushrooms",
    options: [
      { label: "Box (200g)", price: 40 },
      { label: "1 Kg", price: 200 }
    ],
    img: freshImg,
    desc: "Hand-picked fresh button mushrooms — ideal for cooking & salads."
  },
  {
    id: "p2",
    name: "Mushroom Pickle",
    options: [
      { label: "200g Jar", price: 100 },
      { label: "400g Jar", price: 200 }
    ],
    img: pickleImg,
    desc: "Tangy & spicy mushroom pickle made with traditional spices."
  },
  {
    id: "p3",
    name: "Dry Mushrooms",
    options: [{ label: "1 Kg", price: 800 }],
    img: dryImg,
    desc: "Premium sun-dried mushrooms packed with rich flavor."
  },
  {
    id: "p4",
    name: "Mushroom Powder",
    options: [{ label: "100g Pack", price: 450 }],
    img: powderImg,
    desc: "Fine mushroom powder to enrich gravies & soups."
  },
  {
    id: "p5",
    name: "Mushroom Wariyan",
    options: [{ label: "100g Pack", price: 120 }],
    img: wariyanImg,
    desc: "Traditional mushroom wariyan for authentic taste."
  }
];

function App() {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Add product with selected option
  const addToCart = (product, option) => {
    setCart((prev) => [...prev, { ...product, chosen: option }]);
    setSelectedProduct(null); // close popup
  };

  const removeFromCart = (id, optionLabel) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.chosen.label === optionLabel)
      )
    );
  };

  return (
    <div className="app">
      {/* Header with logo from public folder */}
      <header className="header">
        <img src="/anant_gill_logo.png" alt="Anant Gill Logo" className="logo" />
        <h1>Anant Gill Agro Farm</h1>
        <p>Best quality fresh organic mushrooms & delicious pickles</p>
      </header>

      {/* Products */}
      <h2>Our Products</h2>
      <div className="products">
        {productsList.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.desc}</p>
            <button onClick={() => setSelectedProduct(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Popup for selecting option */}
      {selectedProduct && (
        <div className="popup">
          <div className="popup-content">
            <h3>{selectedProduct.name}</h3>
            <p>Select size/quantity:</p>
            {selectedProduct.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => addToCart(selectedProduct, option)}
              >
                {option.label} — ₹{option.price}
              </button>
            ))}
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cart */}
      <h2>Cart</h2>
      <div className="cart">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="cart-item">
              <span>
                {item.name} ({item.chosen.label})
              </span>
              <span>₹{item.chosen.price}</span>
              <button
                onClick={() => removeFromCart(item.id, item.chosen.label)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
