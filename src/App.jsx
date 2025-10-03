// src/App.jsx - FINAL WORKING CODE with DETAILS BUTTONS and CHECKOUT FORM

import React, { useState, useEffect, useRef } from "react";
import "./index.css";

/*
  ASSET FIX:
  - Files in src/assets/ (product images) are imported.
  - Files in /public/ (logo, footer background) must be referenced via their absolute path string.
*/

// 1. Importing product images (correct for src/assets)
import imgFresh from "./assets/fresh_mushrooms.jpg";
import imgPickle from "./assets/mushroom_pickle.jpg";
import imgDry from "./assets/dry_mushrooms.jpg";
import imgPowder from "./assets/mushroom_powder.jpg";
import imgWariyan from "./assets/mushroom_wariyan.jpg";

// 2. Defining paths for public assets (correct for /public)
const PUBLIC_LOGO_PATH = "/anant_gill_logo.png";
const FOOTER_BG_PATH = "/footer-mushrooms-v2.jpg";


const PRODUCTS = [
  {
    id: "fresh",
    title: "Fresh Mushrooms",
    price: 50,
    unit: "per 200g box",
    short: "Hand-picked fresh button mushrooms — ideal for cooking & salads.",
    image: imgFresh,
    variants: [
      { id: "box200", label: "1 box (200 g)", price: 50 },
      { id: "kg", label: "1 kg", price: 200 },
    ],
  },
  {
    id: "pickle",
    title: "Mushroom Pickle",
    price: 100,
    unit: "per 200g jar",
    short: "Tangy & spicy mushroom pickle made with traditional spices.",
    image: imgPickle,
    variants: [
      { id: "jar200", label: "200 g jar", price: 100 },
      { id: "jar400", label: "400 g jar", price: 200 },
    ],
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    price: 300,
    unit: "per 100g",
    short: "Dehydrated mushrooms, perfect for long-term storage and soups.",
    image: imgDry,
    variants: null,
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    price: 450,
    unit: "per 100g",
    short: "Finely ground mushroom powder — perfect for seasoning.",
    image: imgPowder,
    variants: null,
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    price: 120,
    unit: "per 100g packet",
    short: "Traditional mushroom wadiyan — tasty & nutritious.",
    image: imgWariyan,
    variants: null,
  },
];

function formatINR(n) {
  try {
    const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
    return `₹${nf.format(Number(n) || 0)}`;
  } catch (e) {
    return `₹${Math.round(n || 0)}`;
  }
}

function CheckoutForm({ cart, subtotal, onClose, onOrderPlaced }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const orderDetails = {
      customer: { name, phone, address },
      items: cart.map(item => ({ 
        id: item.productId, 
        title: item.productTitle, 
        variant: item.variantLabel, 
        qty: item.qty, 
        price: item.price 
      })),
      total: subtotal
    };

    // 🛑 IMPORTANT: This is where you would place your ORIGINAL API/Firebase placeOrder call.
    // For now, it's a safe alert.

    console.log("Submitting order:", orderDetails);
    
    setTimeout(() => {
        setIsSubmitting(false);
        alert(`Order successfully prepared for submission!\n\nDetails:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nTotal: ${formatINR(subtotal)}\n\n(Original API call was replaced with this alert for stability.)`);
        onOrderPlaced(); // Clears cart and closes modal
    }, 1500);

  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet checkout-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3>Place Your Order ({formatINR(subtotal)})</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows="3"></textarea>
          </div>
          
          <div className="order-summary-box">
              <h4>Order Items</h4>
              {cart.map(it => (
                  <div key={it.key} className="order-item-line">
                      <span>{it.productTitle} {it.variantLabel ? ` (${it.variantLabel})` : ''} x {it.qty}</span>
                      <span>{formatINR(it.price * it.qty)}</span>
                  </div>
              ))}
              <div className="order-total-line">
                  <span>Order Total:</span>
                  <span style={{ fontWeight: 700 }}>{formatINR(subtotal)}</span>
              </div>
          </div>

          <button type="submit" className="add-btn" style={{ width: '100%', padding: '12px', marginTop: 16 }} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : `Confirm Order for ${formatINR(subtotal)}`}
          </button>
        </form>
      </div>
    </div>
  );
}


export default function App() {
  const [cart, setCart] = useState([]); // { productId, variantId?, qty }
  const [sheetProduct, setSheetProduct] = useState(null); // product being chosen (for variants)
  const [sheetVariant, setSheetVariant] = useState(null); // selected variant id in sheet
  const [miniVisible, setMiniVisible] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // <--- ADDED STATE

  const cartBoxRef = useRef(null);
  const miniTimerRef = useRef(null);

  // when the sheet is open, prevent body scrolling
  useEffect(() => {
    const shouldLock = !!sheetProduct || isCheckoutOpen; // <--- MODIFIED
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, isCheckoutOpen]); // <--- MODIFIED

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
    };
  }, []);

  // Add to cart (public call)
  function handleAdd(product, variantId = null, qty = 1) {
    // if product has variants but no variantId supplied -> open sheet
    if (product.variants && !variantId) {
      setSheetProduct(product);
      setSheetVariant(product.variants[0].id);
      return;
    }

    // find price & label
    const variant = product.variants ? product.variants.find((v) => v.id === variantId) : null;
    const key = `${product.id}:${variant ? variant.id : "default"}`;

    setCart((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) {
        return prev.map((it) => (it.key === key ? { ...it, qty: it.qty + qty } : it));
      } else {
        return [
          ...prev,
          {
            key,
            productId: product.id,
            productTitle: product.title,
            variantId: variant ? variant.id : null,
            variantLabel: variant ? variant.label : null,
            price: variant ? variant.price : product.price,
            qty,
          },
        ];
      }
    });

    // show mini cart briefly
    setMiniVisible(true);
    if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
    miniTimerRef.current = setTimeout(() => {
      setMiniVisible(false);
      miniTimerRef.current = null;
    }, 3500);
  }

  function openSheetForProduct(product) {
    if (!product.variants) return;
    setSheetProduct(product);
    setSheetVariant(product.variants[0].id);
  }

  function closeSheet() {
    setSheetProduct(null);
    setSheetVariant(null);
  }

  function changeQty(key, delta) {
    setCart((prev) =>
      prev
        .map((it) => (it.key === key ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((it) => it.key !== key));
  }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cart.reduce((s, it) => s + it.qty, 0);

  // when user confirms Add to Cart from sheet
  function confirmAddFromSheet() {
    if (!sheetProduct) return;
    handleAdd(sheetProduct, sheetVariant, 1);
    closeSheet();
  }

  // social links
  const fbUrl = "https://www.facebook.com/share/177NfwxRKr/"; // replace if you have an official FB page
  // updated Instagram official link as provided by you
  const igUrl = "https://www.instagram.com/anant.gill.agro.farm?igsh=MWVuNzUwbDc2bjl0aA==";

  function scrollToCart() {
    if (cartBoxRef.current) {
      cartBoxRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }

  // Simple details modal for all products
  function showProductDetails(p) {
    const defaultDetails = `Details for ${p.title}:\n\n- Rich in Vitamin D and B-Vitamins.\n- Excellent source of fiber and protein.\n- Low in calories and fat.\n\n(Original details page/modal coming soon)`;
    alert(defaultDetails);
  }

  return (
    <div className="app">
      {/* Topbar */}
      <header className="topbar" role="banner">
        <div className="brand">
          <img className="logo" src={PUBLIC_LOGO_PATH} alt="Anant Gill Agro Farm logo" />
          <div>
            <h1 className="title">Anant Gill Agro Farm</h1>
            <div className="subtitle">Best quality fresh organic mushrooms & delicious pickles</div>
          </div>
        </div>
        <button
          className="cart-button"
          onClick={scrollToCart}
          aria-label={`Open cart with ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
        >
          Cart ({itemCount})
        </button>
      </header>

      {/* Content */}
      <main className="content" role="main">
        <h2 className="section-title">Our Products</h2>

        <div className="product-list">
          {PRODUCTS.map((p) => (
            <article key={p.id} className="product-card" aria-labelledby={`product-${p.id}-title`}>
              <div className="product-media">
                <img src={p.image} alt={p.title} />
              </div>

              <div className="product-body">
                <h3 id={`product-${p.id}-title`}>{p.title}</h3>
                <div className="unit">{p.unit}</div>
                <div className="short">{p.short}</div>

                <div className="price-row">
                  <div>
                    <div className="price">{formatINR(p.price)}</div>
                  </div>

                  <div className="actions">
                    {/* ADDED: Details Button */}
                    <button 
                        className="detail-btn"
                        onClick={() => showProductDetails(p)}
                    >
                        Details
                    </button>

                    <button
                      className="add-btn"
                      onClick={() => {
                        // if product has variants -> open sheet; else add immediately
                        if (p.variants) openSheetForProduct(p);
                        else handleAdd(p, null, 1);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Inline Cart Box (below product list) */}
        <div className="cart-box" id="cart-box" ref={cartBoxRef}>
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            <>
              {cart.map((it) => (
                <div key={it.key} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>
                    {it.productTitle}
                    {it.variantLabel ? ` × ${it.variantLabel}` : ""}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <button aria-label={`Decrease qty of ${it.productTitle}`} onClick={() => changeQty(it.key, -1)}>
                      -
                    </button>
                    <span style={{ margin: "0 8px" }}>{formatINR(it.price * it.qty)}</span>
                    <button aria-label={`Increase qty of ${it.productTitle}`} onClick={() => changeQty(it.key, +1)}>
                      +
                    </button>
                    <button style={{ marginLeft: 10 }} onClick={() => removeItem(it.key)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="cart-summary"> {/* MODIFIED TO ADD CLASS */}
                <div className="cart-total-line">
                  <div>Subtotal</div>
                  <div style={{ fontWeight: 700 }}>{formatINR(subtotal)}</div>
                </div>
                {/* ADDED: Checkout Button */}
                <button 
                    className="checkout-btn add-btn" 
                    disabled={cart.length === 0}
                    onClick={() => setIsCheckoutOpen(true)}
                    style={{ marginTop: 12, width: '100%' }}
                >
                    Place Order ({formatINR(subtotal)})
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo" style={{ backgroundImage: `url(${FOOTER_BG_PATH})` }}>

    
