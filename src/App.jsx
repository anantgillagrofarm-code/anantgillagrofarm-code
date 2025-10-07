// src/App.jsx - FINAL COMPLETE CODE WITH HOMEPAGE ROUTING

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

// New images for Home/History page (place these in your src/assets folder if needed)
import imgHistory from "./assets/history_mushrooms.jpg"; // Placeholder
import imgVarieties from "./assets/varieties_mushrooms.jpg"; // Placeholder

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

// =========================================================
// Home Page Component (New)
// =========================================================

function HomePage({ onNavigateToShop, onNavigateToHealth }) {
  // Placeholder images for history and varieties
  const historyImage = imgHistory || PUBLIC_LOGO_PATH;
  const varietiesImage = imgVarieties || PUBLIC_LOGO_PATH;

  return (
    <main className="content" role="main" style={{ minHeight: '100vh', paddingBottom: 100 }}>
        
        {/* Hero Section */}
        <div className="hero-section" style={{ 
            textAlign: 'center', 
            padding: '30px 10px', 
            backgroundColor: 'var(--color-secondary)',
            borderRadius: '12px',
            marginBottom: '20px'
        }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 10px', color: 'var(--color-primary-dark)' }}>
                Welcome to Anant Gill Agro Farm
            </h2>
            <p style={{ color: 'var(--color-primary-light)', fontSize: '15px', maxWidth: 400, margin: '0 auto 20px' }}>
                Cultivating the finest quality mushrooms, from farm to your table. Explore our range of fresh produce and delicious preserves.
            </p>
            <button 
                className="add-btn" 
                onClick={onNavigateToShop} 
                style={{ fontSize: '16px', padding: '10px 20px' }}
            >
                Shop Now
            </button>
        </div>

        {/* Introduction Section */}
        <h2 className="section-title">Our Commitment</h2>
        <div className="cart-box" style={{ padding: 16, marginBottom: 20 }}>
            <p style={{ color: 'var(--color-primary-light)' }}>
                We believe in sustainable, hygienic farming practices. Our focus is on quality, consistency, and delivering nutrient-rich mushrooms grown in a controlled environment to ensure the best product every time.
            </p>
        </div>

        {/* History Section */}
        <h2 className="section-title">The History of Mushrooms</h2>
        <div className="product-card" style={{ display: 'block', padding: 16, marginBottom: 20 }}>
            <img src={historyImage} alt="Mushroom History" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
            <p style={{ color: 'var(--color-primary-light)' }}>
                Mushrooms have been part of the human diet for millennia, valued not just for their taste but also their medicinal properties. Ancient cultures worldwide used them, and today, modern science confirms their powerful health benefits. We carry on this ancient tradition with modern farming techniques.
            </p>
        </div>

        {/* Varieties Section */}
        <h2 className="section-title">Our Varieties</h2>
        <div className="product-card" style={{ display: 'block', padding: 16, marginBottom: 20 }}>
            <img src={varietiesImage} alt="Mushroom Varieties" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
            <p style={{ color: 'var(--color-primary-light)' }}>
                While our specialty is the premium **Button Mushroom** (Agaricus bisporus) in its fresh, dried, and powdered forms, we also use other potent varieties for our preserves like **Mushroom Pickle** and **Wariyan**. Visit our Health page for more details.
            </p>
            <button 
                className="detail-btn" 
                onClick={onNavigateToHealth} 
                style={{ marginTop: 10, width: '100%', fontSize: '15px' }}
            >
                Learn About Nutrition & Health
            </button>
        </div>

        {/* Call to Action at Bottom */}
        <div style={{ textAlign: 'center', padding: '15px 10px', borderTop: '1px solid var(--color-border)' }}>
             <button 
                className="add-btn" 
                onClick={onNavigateToShop} 
                style={{ fontSize: '16px', padding: '10px 20px' }}
            >
                Start Shopping Now!
            </button>
        </div>
    </main>
  );
}

// =========================================================
// Health & Nutrition Page Component
// =========================================================

function HealthPage({ onClose, products, onNavigateToShop }) {
  // Placeholder logic for the "Show Nutrition & Benefits" button
  const handleShowDetails = (title) => {
     alert(`Nutrition & Benefits for ${title}:\n\n- Rich in B-Vitamins and minerals.\n- Excellent source of dietary fiber.\n- Supports heart health and immunity.`);
  }

  return (
    <main className="content" role="main" style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header for Health Page */}
      <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 901, background: 'rgba(255,255,255,0.92)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Health & Nutrition</h2>
        <button className="cart-button" onClick={onNavigateToShop} style={{ borderRadius: 14 }}>Back to Shop</button>
      </div>

      <div className="cart-box" style={{ padding: 16, marginBottom: 14 }}>
        <h3 style={{ marginTop: 0, color: '#14502b' }}>Introduction</h3>
        <p style={{ color: '#556e64' }}>Mushrooms are nutrient-dense fungi prized for their savory flavor and versatile culinary uses. Low in calories and rich in B vitamins, vitamin D (when sun-exposed), potassium, selenium, fiber, and unique antioxidants like ergothioneine, mushrooms make a wholesome addition to everyday meals.</p>
        <p style={{ color: '#556e64', fontSize: '14px' }}>Below you can check the approximate nutrition and suggested health benefits for each product.</p>
      </div>

      {products.map((p) => (
        <div key={p.id} className="product-card" style={{ display: 'block', padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: '#14502b', fontSize: 18 }}>{p.title}</h3>
                <p className="short" style={{ margin: '4px 0 0' }}>{p.short}</p>
            </div>
            <button 
              className="detail-btn" 
              onClick={() => handleShowDetails(p.title)}
              style={{ flexShrink: 0, marginLeft: 10, padding: '8px 10px', fontSize: 13, background: '#f7faf6' }}
            >
              Show Nutrition & Benefits
            </button>
          </div>
        </div>
      ))}

      <div className="cart-box" style={{ padding: 16, marginTop: 14 }}>
          <h3 style={{ marginTop: 0, color: '#14502b' }}>Summary</h3>
          <p style={{ color: '#556e64' }}>Fresh, dried, powdered or pickled — mushrooms come in many forms that suit different cooking needs. Fresh mushrooms are low-calorie and versatile; dried and powdered forms concentrate nutrients and flavor; pickles and wariyan offer traditional taste. Together they help you add variety, nutrition and umami to your meals.</p>
      </div>
    </main>
  );
}

// =========================================================
// Checkout Form Component (for order submission)
// =========================================================

function CheckoutForm({ cart, subtotal, onClose, onOrderPlaced }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === WhatsApp Order Logic ===
  const handleSubmit = (e, paymentType) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Please fill in all required fields (Name, Phone, Address).");
      return;
    }
    
    // --- WhatsApp Logic ---
    const orderItems = cart.map(item => 
        `- ${item.productTitle}${item.variantLabel ? ` (${item.variantLabel})` : ''} x${item.qty}`
    ).join('\n');

    const paymentLabel = paymentType === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment (Confirmation needed)';
    
    // Creates the message with customer and order details, encoded for the URL
    const message = encodeURIComponent(`*New Order Alert!*%0A%0A*Customer Info:*%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0AAddress: ${address}%0ANote: ${note}%0A%0A*Order Details:*%0A${orderItems}%0A%0A*Total:* ${formatINR(subtotal)}%0A*Payment:* ${paymentLabel}`);
    
    // Using your confirmed number
    const whatsappNumber = "918837554747"; 
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    setIsSubmitting(true);

    // Open WhatsApp link in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and close modal after a short delay
    setTimeout(() => {
        setIsSubmitting(false);
        alert(`Thank you! Your order summary is ready. Please click 'Send' in the new WhatsApp window to confirm and finalize your order with Anant Gill Agro Farm.`);
        onOrderPlaced(); 
    }, 500); 
    // --- END: WhatsApp Logic ---
  };
  // === End WhatsApp Order Logic ===


  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet checkout-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3>Place Order</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <p style={{ color: '#556e64', marginTop: -10 }}>Enter details so we can contact you to confirm the order.</p>
        
        {/* Form elements for Name, Phone, Email, Address, Note */}
        <form style={{ paddingBottom: 60 /* Space for buttons */ }}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows="3"></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="note">Note (optional)</label>
            <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows="2"></textarea>
          </div>
          
          {/* Fixed button bar at the bottom */}
          <div className="checkout-actions">
              <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>

              <button 
                  type="button" 
                  className="add-btn pay-btn"
                  onClick={(e) => handleSubmit(e, 'PAY_ONLINE')}
                  disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? 'Processing...' : 'Pay & Place Order'}
              </button>

              <button 
                  type="button" 
                  className="add-btn cod-btn" 
                  onClick={(e) => handleSubmit(e, 'COD')} 
                  disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? 'Processing...' : 'Place Order (COD)'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// =========================================================
// Main App Component
// =========================================================

export default function App() {
  const [cart, setCart] = useState([]); // { productId, variantId?, qty }
  const [sheetProduct, setSheetProduct] = useState(null); // product being chosen (for variants)
  const [sheetVariant, setSheetVariant] = useState(null); // selected variant id in sheet
  const [miniVisible, setMiniVisible] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // ROUTING: Use state to control which main page is visible
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'shop', 'health' 

  const cartBoxRef = useRef(null);
  const miniTimerRef = useRef(null);

  // when the sheet or checkout is open, prevent body scrolling
  useEffect(() => {
    const shouldLock = !!sheetProduct || isCheckoutOpen;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, isCheckoutOpen]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
    };
  }, []);

  // Navigation functions
  const navigateToHome = () => setCurrentPage('home');
  const navigateToShop = () => setCurrentPage('shop');
  const navigateToHealth = () => setCurrentPage('health');

  // Add to cart (public call)
  function handleAdd(product, variantId = null, qty = 1) {
    if (product.variants && !variantId) {
      setSheetProduct(product);
      setSheetVariant(product.variants[0].id);
      return;
    }

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

  function confirmAddFromSheet() {
    if (!sheetProduct) return;
    handleAdd(sheetProduct, sheetVariant, 1);
    closeSheet();
  }

  const fbUrl = "https://www.facebook.com/share/177NfwxRKr/";
  const igUrl = "https://www.instagram.com/anant.gill.agro.farm?igsh=MWVuNzUwbDc2bjl0aA==";

  function scrollToCart() {
    if (cartBoxRef.current) {
      cartBoxRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }
  
  // ----------------------------------------------------
  // SHOP CONTENT: The original product listing page
  // ----------------------------------------------------
  const ShopContent = (
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
                  {/* Health Detail button now links to Health Page */}
                  <button 
                      className="detail-btn"
                      onClick={navigateToHealth}
                  >
                      Details
                  </button>

                  <button
                    className="add-btn"
                    onClick={() => {
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
            
            <div className="cart-summary">
              <div className="cart-total-line">
                <div>Subtotal</div>
                <div style={{ fontWeight: 700 }}>{formatINR(subtotal)}</div>
              </div>
              {/* Checkout Button (Opens CheckoutForm modal) */}
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
  );

  return (
    <div className="app">
      
      {/* Topbar (Main Navigation) */}
      <header className="topbar" role="banner">
        <div className="brand" onClick={navigateToHome} style={{ cursor: 'pointer' }}>
          <img className="logo" src={PUBLIC_LOGO_PATH} alt="Anant Gill Agro Farm logo" />
          <div>
            <h1 className="title">Anant Gill Agro Farm</h1>
            <div className="subtitle">Best quality fresh organic mushrooms & delicious pickles</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentPage !== 'home' && (
            <button className="cart-button" onClick={navigateToHome} style={{ background: currentPage === 'home' ? 'var(--color-primary-dark)' : 'var(--color-primary-light)' }}>
                Home
            </button>
          )}
          
          {currentPage !== 'shop' && (
            <button className="cart-button" onClick={navigateToShop} style={{ background: currentPage === 'shop' ? 'var(--color-primary-dark)' : 'var(--color-primary-light)' }}>
                Shop
            </button>
          )}
          
          {currentPage !== 'health' && (
            <button className="cart-button" onClick={navigateToHealth} style={{ background: currentPage === 'health' ? 'var(--color-primary-dark)' : 'var(--color-primary-light)' }}>
                Health
            </button>
          )}

          {/* Cart Button (Always visible on Shop) */}
          {currentPage === 'shop' && (
            <button
              className="cart-button"
              onClick={scrollToCart}
              aria-label={`Open cart with ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            >
              Cart ({itemCount})
            </button>
          )}
        </div>
      </header>
      
      {/* ---------------------------------------------------- */}
      {/* CONDITIONAL RENDERING: Page Router */}
      {/* ---------------------------------------------------- */}
      {currentPage === 'home' && (
        <HomePage 
          onNavigateToShop={navigateToShop} 
          onNavigateToHealth={navigateToHealth}
        />
      )}
      
      {currentPage === 'shop' && ShopContent}

      {currentPage === 'health' && (
        <HealthPage 
            onClose={navigateToShop} // Back button navigates to shop
            onNavigateToShop={navigateToShop}
            products={PRODUCTS} 
        />
      )}

      {/* Footer (Always Visible) */}
      <footer className="site-footer" role="contentinfo" style={{ backgroundImage: `url(${FOOTER_BG_PATH})` }}>
        <div className="footer-inner">
          <div className="footer-left">
            {/* Logo is here. CSS filter turns it white. */}
            <img className="footer-logo" src={PUBLIC_LOGO_PATH} alt="Anant Gill Agro Farm logo" />
            <h4>Anant Gill Agro Farm</h4>
            <div className="contact-line">
              Phone: <a href="tel:+918837554747">+91 88375 54747</a>
            </div>
            <div className="contact-line">
              Email: <a href="mailto:anantgillagrofarm@gmail.com">anantgillagrofarm@gmail.com</a>
            </div>
            <div className="contact-line address">Gali No. 1, Baba Deep Singh Avenue, village Nangli bhatha, Amritsar 143001</div>
          </div>

          <div className="footer-right">
            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>Follow</div>
            <div className="socials">
              <a
                className="social-btn"
                href={fbUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H12C9.79 3 8 4.79 8 7V10H5V13H8V21H11V13H14L15 10H11V7C11 6.45 11.45 6 12 6H15V3Z" fill="white" />
                </svg>
              </a>

              <a
                className="social-btn"
                href={igUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2H17C20 2 22 4 22 7V17C22 20 20 22 17 22H7C4 22 2 20 2 17V7C2 4 4 2 7 2Z" stroke="white" strokeWidth="1.2" fill="none" />
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.2" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="white" />
                </svg>
              </a>
            </div>

            <div style={{ color: "rgba(255,255,255,0.95)", marginTop: 12 }}>© 2025 Anant Gill Agro Farm</div>
          </div>
        </div>
      </footer>

      {/* Mini-cart sticky bottom */}
      {itemCount > 0 && currentPage === 'shop' && (
        <div className="mini-cart" style={{ display: miniVisible ? "flex" : "none" }} aria-live="polite">
          <div className="mini-left">
            <div style={{ fontWeight: 700 }}>
              {itemCount} item{itemCount > 1 ? "s" : ""}
            </div>
            <div className="mini-sub">Subtotal {formatINR(subtotal)}</div>
          </div>
          <div>
            <button className="view-cart" onClick={scrollToCart}>
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Sheet overlay for product variants */}
      {sheetProduct && (
        <div className="sheet-overlay" onClick={closeSheet}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <button style={{ borderRadius: 8 }} onClick={closeSheet} aria-label="Close variants sheet">
                ✕
              </button>
            </div>

            <div style={{ padding: "8px 4px 24px" }}>
              <div className="sheet-image" style={{ marginBottom: 12 }}>
                <img src={sheetProduct.image} alt={sheetProduct.title} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 10 }} />
              </div>

              <h3 style={{ marginTop: 0 }}>{sheetProduct.title}</h3>
              <p style={{ color: "#556e64" }}>{sheetProduct.short}</p>

              <div style={{ marginTop: 12, fontWeight: 600 }}>Choose size / variant</div>

              <div style={{ marginTop: 8 }}>
                {sheetProduct.variants.map((v) => (
                  <label
                    key={v.id}
                    style={{
                      display: "block",
                      border: sheetVariant === v.id ? "2px solid #14502b" : "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 8,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={v.id}
                      checked={sheetVariant === v.id}
                      onChange={() => setSheetVariant(v.id)}
                      style={{ marginRight: 10 }}
                    />
                    <span style={{ fontWeight: 600 }}>{v.label}</span>
                    <div style={{ color: "#556e64" }}>{formatINR(v.price)}</div>
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button className="add-btn" style={{ padding: "10px 16px" }} onClick={confirmAddFromSheet}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {isCheckoutOpen && (
        <CheckoutForm
          cart={cart}
          subtotal={subtotal}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderPlaced={() => {
            setCart([]);
            setIsCheckoutOpen(false);
          }}
        />
      )}
    </div>
  );
}
