import React, { useState } from "react";
import freshMushrooms from "./assets/fresh_mushrooms.jpg";
import mushroomPickle from "./assets/mushroom_pickle.jpg";
import dryMushrooms from "./assets/dry_mushrooms.jpg";
import mushroomPowder from "./assets/mushroom_powder.jpg";
import mushroomWariyan from "./assets/mushroom_wariyan.jpg";

// Products list
const products = [
  { id: 1, name: "Fresh Mushrooms", price: 200, image: freshMushrooms },
  { id: 2, name: "Mushroom Pickle", price: 500, image: mushroomPickle },
  { id: 3, name: "Dry Mushrooms", price: 600, image: dryMushrooms },
  { id: 4, name: "Mushroom Powder", price: 400, image: mushroomPowder },
  { id: 5, name: "Mushroom Wariyan", price: 450, image: mushroomWariyan },
];

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: "#f9f9f9" }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2e7d32" }}>Welcome to Anant Gill Agro Farm</h1>
        <p style={{ color: "#555", fontSize: "18px" }}>
          Best quality fresh organic mushrooms & delicious pickles
        </p>
      </header>

      {/* Products Section */}
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Our Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ margin: "10px 0", color: "#2e7d32" }}>{product.name}</h3>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#444" }}>
              ₹{product.price}
            </p>
            <button
              onClick={() => addToCart(product)}
              style={{
                padding: "12px 20px",
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#1b5e20")}
              onMouseOut={(e) => (e.target.style.background = "#2e7d32")}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <aside style={{ marginTop: "50px" }}>
        <h2 style={{ color: "#333" }}>🛍️ Your Cart</h2>
        {cart.length === 0 ? (
          <p style={{ color: "#777" }}>No items in cart</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item, index) => (
              <li
                key={index}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {item.name} - ₹{item.price}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    marginLeft: "15px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

export default App;
