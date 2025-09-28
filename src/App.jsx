// src/App.jsx
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-green-800 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <h1 className="text-lg font-semibold">Anant Gill Agro Farm</h1>
              <p className="text-xs text-gray-500">Best quality fresh organic mushrooms & delicious pickles</p>
            </div>
          </div>
          <div className="text-sm text-gray-700">Cart (0)</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Our Products</h2>
          <div className="grid grid-cols-1 gap-6">
            <article className="bg-white rounded-lg shadow p-4 flex gap-4">
              <img src="/bg-mushrooms.jpg" alt="Mushrooms" className="w-36 h-36 object-cover rounded"/>
              <div>
                <h3 className="text-lg font-semibold">Fresh Mushrooms</h3>
                <p className="text-sm text-gray-600">Hand-picked fresh button mushrooms — ideal for cooking & salads</p>
                <p className="mt-4 font-bold">₹50</p>
              </div>
            </article>
          </div>
        </section>

        <footer className="text-sm text-gray-600 border-t pt-6">
          <p>Phone: +91 18387 54747</p>
          <p>Email: anantgillagrofarm@gmail.com</p>
        </footer>
      </main>
    </div>
  );
}
