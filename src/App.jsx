// src/App.jsx
import React, { useEffect, useState } from "react";
import "./index.css";

/*
  PRODUCT data (prices/variants as requested)
  Images must be placed in public/ with exact filenames:
    /fresh_mushrooms.jpg
    /mushroom_pickle.jpg
    /dry_mushrooms.jpg
    /mushroom_powder.jpg
    /mushroom_wariyan.jpg
    /footer-mushrooms.jpg
*/

const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    description:
      "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    image: "/fresh_mushrooms.jpg",
    variants: [
      { id: "fresh-200g", name: "1 box (200 g)", price: 30, unit: "per 200g box" },
      { id: "fresh-1kg", name: "1 kg", price: 200, unit: "per kg" }
    ]
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    description: "Tangy & spicy mushroom pickle made with traditional spices.",
    image: "/mushroom_pickle.jpg",
    variants: [
      { id: "pickle-200", name: "200 g jar", price: 100, unit: "per 200g jar" },
      { id: "pickle-400", name: "400 g jar", price: 200, unit: "per 400g jar" }
    ]
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    description: "Sun-dried button mushrooms — great for long storage & cooking.",
    image: "/dry_mushrooms.jpg",
    variants: [{ id: "dry-100", name: "per 100 g", price: 300, unit: "per 100g" }]
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    description: "Finely ground mushroom powder — perfect for seasoning.",
    image: "/mushroom_powder.jpg",
    variants: [{ id: "powder-100", name: "per 100 g", price: 450, unit: "per 100g" }]
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    description: "Traditional mushroom wadiyan — tasty & nutritious.",
    image: "/mushroom_wariyan.jpg",
    variants: [{ id: "wariyan-100", name: "per 100g packet", price: 120, unit: "per 100g packet" }]
  }
];

// Helper to format rupee
const formatRupee = (n) => `₹${n.toFixed ? n.toFixed(2) : n}`;

export default function App() {
  // Cart items: [{ productId, variantId, qty }]
  const [cart, setCart] = useState([]);
  // sheetProduct: product object for variant sheet modal
  const [sheetProduct, setSheetProduct] = useState(null);
  // selected variant id in sheet
  const [selectedVariant, setSelectedVariant] = useState(null);
  // Mini-cart visible when cart has items
  const [miniCartVisible, setMiniCartVisible] = useState(false);
  // cart drawer open (full cart)
  const [cartOpen, setCartOpen] = useState(false);

  // lock body scroll when either sheet or cart drawer open
  useEffect(() => {
    const shouldLock = !!sheetProduct || !!cartOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, cartOpen]);

  // subtotal and total items
  const cartTotals = cart.reduce(
    (acc, it) => {
      const prod = PRODUCTS.find((p) => p.id === it.productId);
      const variant = prod && prod.variants.find((v) => v.id === it.variantId);
      const price = variant ? variant.price : 0;
      acc.items += it.qty;
      acc.subtotal += price * it.qty;
      return acc;
    },
    { items: 0, subtotal: 0 }
  );

  useEffect(() => {
    setMiniCartVisible(cartTotals.items > 0);
  }, [cartTotals.items]);

  // Adds product with chosen variant ID (if single variant, use that)
  function addToCartImmediate(product, variantId = null, qty = 1) {
    const vId = variantId || (product.variants && product.variants[0] && product.variants[0].id);
    if (!vId) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.variantId === vId);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.variantId === vId ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        return [...prev, { productId: product.id, variantId: vId, qty }];
      }
    });
    // show mini cart briefly
    setMiniCartVisible(true);
    // small animation could be done by adding a class; we just ensure visible
  }

  // "Add to Cart" button behavior:
  // - If product has >1 variant: open sheet to choose
  // - If only one variant: add immediately
  function handleAddClick(product) {
    if (product.variants.length > 1) {
      setSelectedVariant(product.variants[0].id); // default
      setSheetProduct(product);
    } else {
      addToCartImmediate(product, product.variants[0].id);
    }
  }

  function confirmAddFromSheet() {
    if (!sheetProduct || !selectedVariant) return;
    addToCartImmediate(sheetProduct, selectedVariant);
    setSheetProduct(null);
    setSelectedVariant(null);
  }

  function changeQty(productId, variantId, delta) {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(productId, variantId) {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  }

  function openCartDrawer() {
    setCartOpen(true);
  }

  function closeCartDrawer() {
    setCartOpen(false);
  }

  // Get product+variant details helper
  function findProductAndVariant(productId, variantId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    const variant = product && product.variants.find((v) => v.id === variantId);
    return { product, variant };
  }

  // Footer contact/address values (as you requested)
  const FOOTER = {
    phone: "+91 88375 54747",
    email: "anantgillagrofarm@gmail.com",
    address: "Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001",
    fb: "https://www.facebook.com/share/177NfwxRKr/",
    ig: "#" // add instagram link if you want
  };

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand">
          <img src="/anant_gill_logo.png" alt="logo" className="logo" onError={(e)=>{e.target.style.display='none'}}/>
          <div>
            <h1>Anant Gill Agro Farm</h1>
            <p className="tag">Best quality fresh organic mushrooms &amp; delicious pickles</p>
          </div>
        </div>
        <button className="cart-button" onClick={openCartDrawer}>
          Cart {cartTotals.items > 0 ? `(${cartTotals.items})` : ""}
        </button>
      </header>

      <main>
        <section className="products">
          <h2>Our Products</h2>
          <div className="product-grid">
            {PRODUCTS.map((p) => (
              <article className="card" key={p.id}>
                <div className="card-image">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="card-body">
                  <h3>{p.title}</h3>
                  <p className="muted">{p.variants[0].unit}</p>
                  <div className="price-row">
                    <div className="price">{formatRupee(p.variants[0].price)}</div>
                    <div className="actions">
                      <button className="btn btn-primary" onClick={() => handleAddClick(p)}>
                        Add to Cart
                      </button>
                      <button className="btn btn-ghost" onClick={() => { setSelectedVariant(p.variants[0].id); setSheetProduct(p); }}>
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Cart card inside main content (keeps for desktop) */}
        <aside className="cart-card">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <p className="muted">Your cart is empty</p>
          ) : (
            <>
              {cart.map((it) => {
                const { product, variant } = findProductAndVariant(it.productId, it.variantId);
                return (
                  <div key={`${it.productId}-${it.variantId}`} className="cart-item">
                    <div>
                      <strong>{product.title}</strong> × {it.qty}
                    </div>
                    <div className="cart-controls">
                      <button onClick={() => changeQty(it.productId, it.variantId, -1)}>-</button>
                      <span>{formatRupee(variant.price)}</span>
                      <button onClick={() => changeQty(it.productId, it.variantId, +1)}>+</button>
                      <button onClick={() => removeItem(it.productId, it.variantId)}>Remove</button>
                    </div>
                  </div>
                );
              })}
              <div className="subtotal">Subtotal<br/>{formatRupee(cartTotals.subtotal)}</div>
            </>
          )}
        </aside>
      </main>

      {/* Sheet Modal for selecting variants */}
      {sheetProduct && (
        <div className="sheet-overlay" onClick={() => setSheetProduct(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setSheetProduct(null)}>✕</button>
            <img className="sheet-image" src={sheetProduct.image} alt={sheetProduct.title} />
            <h3>{sheetProduct.title}</h3>
            <p className="muted">{sheetProduct.description}</p>

            <div className="variants">
              <p className="muted">Choose size / variant</p>
              {sheetProduct.variants.map((v) => (
                <label
                  key={v.id}
                  className={`variant-card ${selectedVariant === v.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="variant"
                    checked={selectedVariant === v.id}
                    onChange={() => setSelectedVariant(v.id)}
                  />
                  <div className="variant-info">
                    <div className="variant-name">{v.name}</div>
                    <div className="variant-price">{formatRupee(v.price)}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="sheet-actions">
              <button className="btn btn-primary" onClick={confirmAddFromSheet}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer (full) */}
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Cart</h3>
          <button className="drawer-close" onClick={closeCartDrawer}>✕</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <p className="muted">Your cart is empty</p>
          ) : (
            <>
              {cart.map((it) => {
                const { product, variant } = findProductAndVariant(it.productId, it.variantId);
                return (
                  <div key={`${it.productId}-${it.variantId}`} className="drawer-item">
                    <div>
                      <strong>{product.title}</strong> × {it.qty}
                      <div className="muted">{variant.name}</div>
                    </div>
                    <div className="drawer-controls">
                      <button onClick={() => changeQty(it.productId, it.variantId, -1)}>-</button>
                      <span>{formatRupee(variant.price)}</span>
                      <button onClick={() => changeQty(it.productId, it.variantId, +1)}>+</button>
                      <button onClick={() => removeItem(it.productId, it.variantId)}>Remove</button>
                    </div>
                  </div>
                );
              })}
              <div className="drawer-subtotal">Subtotal<br/>{formatRupee(cartTotals.subtotal)}</div>
            </>
          )}
        </div>
      </div>

      {/* Mini sticky cart bar */}
      {miniCartVisible && cartTotals.items > 0 && (
        <div className="mini-cart">
          <div className="mini-left">
            <div><strong>{cartTotals.items} item</strong></div>
            <div className="muted">Subtotal {formatRupee(cartTotals.subtotal)}</div>
          </div>
          <div className="mini-right">
            <button className="btn btn-primary" onClick={() => { openCartDrawer(); }}>
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="site-footer" style={{ backgroundImage: 'url(/footer-mushrooms.jpg)' }}>
        <div className="footer-inner">
          <div className="footer-left">
            <img src="/anant_gill_logo.png" alt="logo" className="footer-logo" onError={(e)=>{e.target.style.display='none'}} />
            <h4>Anant Gill Agro Farm</h4>
            <p className="muted"><strong>Phone:</strong> <a href={`tel:${FOOTER.phone.replace(/\s+/g,"")}`}>{FOOTER.phone}</a></p>
            <p className="muted"><strong>Email:</strong> <a className="email-link" href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a></p>
            <p className="muted address">{FOOTER.address}</p>
          </div>

          <div className="footer-right">
            <p>Follow</p>
            <div className="socials">
              <a className="social-btn" href={FOOTER.fb} target="_blank" rel="noreferrer">FB</a>
              <a className="social-btn" href={FOOTER.ig} target="_blank" rel="noreferrer">IG</a>
            </div>
            <p className="copyright">© 2025 Anant Gill Agro Farm</p>
          </div>
        </div>
      </footer>
    </div>
  );
                }
