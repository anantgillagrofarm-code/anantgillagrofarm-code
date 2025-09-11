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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "green" }}>Welcome to Anant Gill Agro Farm</h1>
        <p>Best quality fresh organic mushrooms & delicious pickles</p>
      </header>

      <h2>Our Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "15px", textAlign: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              style={{ padding: "10px 15px", background: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <aside style={{ marginTop: "40px" }}>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - ₹{item.price}{" "}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
                >
                  Remove
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
