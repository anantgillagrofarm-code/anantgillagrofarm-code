import React, { useState } from "react";
const logo = "/anant_gill_logo.png"; // file in the public/ folder // correct path now

// Dummy Products – replace later with real data + images
const products = [
  { id: 1, name: "Fresh Mushrooms", price: 200, image: "/mushroom1.jpg" },
  { id: 2, name: "Mango Pickle", price: 500, image: "/pickle1.jpg" },
  { id: 3, name: "Dry Mushrooms", price: 600, image: "/drymushroom.jpg" },
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Anant Gill Agro Farm Logo" className="h-10" />
          <h1 className="text-xl font-bold">Anant Gill Agro Farm</h1>
        </div>
        <div className="font-semibold">Cart ({cart.length})</div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-10 text-center shadow">
        <h2 className="text-3xl font-bold text-green-700">
          Welcome to Anant Gill Agro Farm
        </h2>
        <p className="mt-2 text-gray-600">
          Best quality fresh organic mushrooms & delicious pickles
        </p>
      </section>

      {/* Products Section */}
      <section className="p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg p-4 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-32 w-32 object-cover rounded"
              />
              <h4 className="mt-2 font-semibold">{product.name}</h4>
              <p className="text-green-700 font-bold">₹{product.price}</p>
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

      {/* About Section */}
      <section className="bg-gray-100 py-10 px-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">About Us</h3>
        <p className="text-gray-700 max-w-3xl">
          At Anant Gill Agro Farm, we take pride in delivering the finest organic
          mushrooms and mushroom-based products. From fresh harvests to
          innovative pickles and powders, our mission is to bring natural,
          chemical-free, and nutritious products directly to your table.
        </p>
      </section>

      {/* Cart Section */}
      <aside className="p-6 bg-white shadow mt-6">
        <h3 className="text-xl font-bold mb-3">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{item.name}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-4 mt-6">
        © {new Date().getFullYear()} Anant Gill Agro Farm. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
