import React, { useState } from "react";
import logo from "./anant_gill_logo.svg";; // adjust path/name if needed

// Sample product list (replace or extend as needed)
const PRODUCTS = [
  { id: "p1", name: "Fresh Mushrooms", price: 200, unit: "kg" },
  { id: "p2", name: "Mushroom Pickle", price: 500, unit: "kg" },
  { id: "p3", name: "Dry Mushrooms", price: 600, unit: "250g" },
  { id: "p4", name: "Mushroom Powder", price: 400, unit: "100g" },
];

function formatCurrency(n) {
  // Indian rupee formatting (simple)
  return `₹${n.toFixed(0)}`;
}

function Cart({ cartItems, onIncrease, onDecrease, onClear }) {
  const total = cartItems.reduce((s, it) => s + it.qty * it.price, 0);

  return (
    <div className="cart p-4 bg-white rounded shadow-md" style={{ minWidth: 280 }}>
      <h3 className="text-lg font-semibold mb-2">Cart</h3>
      {cartItems.length === 0 ? (
        <div className="text-sm text-gray-600">Your cart is empty.</div>
      ) : (
        <div>
          {cartItems.map((it) => (
            <div key={it.id} className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(it.price)} × {it.qty}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label={`decrease ${it.name}`}
                  className="px-2 py-1 border rounded"
                  onClick={() => onDecrease(it.id)}
                >
                  −
                </button>
                <button
                  aria-label={`increase ${it.name}`}
                  className="px-2 py-1 border rounded"
                  onClick={() => onIncrease(it.id)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="mt-3 border-t pt-3">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 bg-green-500 text-white py-2 rounded" onClick={() => {
                // simple "checkout" behaviour: open WhatsApp with cart summary
                const msg = cartItems.map(i => `${i.name} x${i.qty} = ${formatCurrency(i.price * i.qty)}`).join('%0A');
                const totalMsg = `Total: ${formatCurrency(total)}`;
                const wa = `https://wa.me/?text=${encodeURIComponent(msg + '%0A' + totalMsg)}`;
                window.open(wa, "_blank");
              }}>
                Order on WhatsApp
              </button>
              <button className="px-3 py-2 border rounded" onClick={onClear}>Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]); // {id, name, price, qty}
  const addToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx === -1) {
        return [...prev, { ...product, qty: 1 }];
      } else {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
    });
  };
  const increase = (id) => {
    setCart((prev) => prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  };
  const decrease = (id) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty - 1) } : p))
        .filter((p) => p.qty > 0)
    );
  };
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-green-900 text-white p-6">
      <header className="max-w-4xl mx-auto flex items-center gap-4 mb-8">
        <img src={logo} alt="Anant Gill Agro Farm" style={{ width: 72, height: "auto" }} />
        <div>
          <h1 className="text-2xl font-semibold">ANANT GILL AGRO FARM</h1>
          <div className="text-sm text-green-200">Fresh Organic Mushrooms & Products</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <div className="bg-green-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">Welcome to Anant Gill Agro Farm</h2>
            <p className="text-green-100 mb-4">
              We sell fresh mushrooms, pickles, dry mushrooms, and mushroom powder.
            </p>
            <a
              href="https://wa.me/?text=Hi%20I%20want%20to%20order%20mushrooms"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded"
            >
              📲 Order on WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRODUCTS.map((p) => (
              <article key={p.id} className="bg-white text-black rounded p-4 shadow">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.unit}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-medium">{formatCurrency(p.price)}</div>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => addToCart(p)}
                  >
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 bg-green-800 p-4 rounded">
            <h3 className="font-semibold">Sample Products & Prices</h3>
            <ul className="mt-2 text-green-100">
              <li>Fresh Mushrooms — ₹200 / kg</li>
              <li>Mushroom Pickle — ₹500 / kg</li>
              <li>Dry Mushrooms — ₹600 / 250g</li>
              <li>Mushroom Powder — ₹400 / 100g</li>
            </ul>
          </div>
        </section>

        <aside className="md:col-span-1">
          <Cart cartItems={cart} onIncrease={increase} onDecrease={decrease} onClear={clearCart} />
        </aside>
      </main>

      <footer className="max-w-4xl mx-auto text-green-100 mt-10">
        <div className="border-t border-green-700 pt-6">
          © {new Date().getFullYear()} Anant Gill Agro Farm
        </div>
      </footer>
    </div>
  );
}
