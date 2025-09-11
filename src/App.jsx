import React, { useState } from "react";
import logo from "./assets/anant_gill_logo.png"; // use PNG logo instead of SVG

// Product list
const products = [
  {
    id: 1,
    name: "Fresh Mushrooms",
    price: 200,
    image: "./assets/fresh_mushrooms.jpg",
  },
  {
    id: 2,
    name: "Mushroom Pickle",
    price: 500,
    image: "./assets/mushroom_pickle.jpg",
  },
  {
    id: 3,
    name: "Dry Mushrooms",
    price: 600,
    image: "./assets/dry_mushrooms.jpg",
  },
  {
    id: 4,
    name: "Mushroom Powder",
    price: 400,
    image: "./assets/mushroom_powder.jpg",
  },
  {
    id: 5,
    name: "Mushroom Warriyan",
    price: 450,
    image: "./assets/mushroom_wariyan.jpg",
  },
];

function App() {
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item, index) => index !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center">
        <img src={logo} alt="Logo" className="h-12 mr-3" />
        <h1 className="text-2xl font-bold text-green-700">
          Anant Gill Agro Farm
        </h1>
      </header>

      {/* Intro */}
      <section className="text-center mt-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome to Anant Gill Agro Farm
        </h2>
        <p className="text-gray-600">
          Best quality fresh organic mushrooms & delicious pickles
        </p>
      </section>

      {/* Products */}
      <section className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-green-600 font-bold">₹{product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Cart */}
      <aside className="p-6 bg-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600">Cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-2 rounded shadow"
              >
                <span>
                  {item.name} - ₹{item.price}
                </span>
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:underline"
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
