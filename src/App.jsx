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


// =========================================================
// Product Data & Nutrition Details
// =========================================================

// Nutritional data per 100g (Approximate)
const NUTRITION_DATA = {
  fresh: {
    title: "Fresh Button Mushrooms",
    calories: "22 Kcal",
    protein: "3.1 g",
    fat: "0.3 g",
    carbohydrates: "3.3 g",
    fiber: "1.0 g",
    vitamins: "Riboflavin (B2), Niacin (B3), Pantothenic Acid (B5)",
    minerals: "Potassium, Copper, Selenium",
    healthBenefits: "Low-calorie, excellent source of B-Vitamins for metabolism, supports immune function.",
  },
  pickle: {
    title: "Mushroom Pickle",
    calories: "95 - 180 Kcal",
    protein: "3.0 - 6.0 g",
    fat: "6.0 - 8.8 g (from oil)",
    carbohydrates: "1.0 - 3.5 g",
    fiber: "1.0 - 2.0 g",
    vitamins: "Trace B-Vitamins",
    minerals: "Sodium (High), Potassium",
    healthBenefits: "Adds a flavorful, gut-healthy kick to meals (may contain probiotics from fermentation).",
  },
  dry: {
    title: "Dry Mushrooms (Concentrated)",
    calories: "293 Kcal",
    protein: "34.0 g",
    fat: "3.9 g",
    carbohydrates: "17.4 g",
    fiber: "14.1 g",
    vitamins: "Concentrated B-Vitamins (Niacin, Riboflavin), Vitamin D (if UV treated)",
    minerals: "Iron, Copper, Selenium",
    healthBenefits: "Highly concentrated source of protein, fiber, and immune-boosting compounds.",
  },
  powder: {
    title: "Mushroom Powder",
    calories: "250 - 307 Kcal",
    protein: "25.0 - 35.0 g",
    fat: "1.5 - 3.0 g",
    carbohydrates: "50.0 - 75.0 g",
    fiber: "6.0 - 25.0 g",
    vitamins: "High in B-Vitamins and Vitamin D",
    minerals: "Beta-Glucans, Antioxidants (Ergothioneine)",
    healthBenefits: "Easy supplement for boosting protein, fiber, and antioxidant intake in any meal/drink.",
  },
  wariyan: {
    title: "Mushroom Wariyan (Mushroom & Lentil)",
    calories: "300 - 350 Kcal",
    protein: "20.0 - 25.0 g",
    fat: "5.0 - 8.0 g",
    carbohydrates: "40.0 - 50.0 g",
    fiber: "10.0 - 15.0 g",
    vitamins: "B-Vitamins, Folate",
    minerals: "Iron, Zinc",
    healthBenefits: "Combines high plant-based protein and dietary fiber from both mushrooms and lentils.",
  },
};

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
    nutritionId: "fresh",
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
    nutritionId: "pickle",
  },
  {
    id: "dry",
    title: "Dry Mushrooms",
    price: 300,
    unit: "per 100g",
    short: "Dehydrated mushrooms, perfect for long-term storage and soups.",
    image: imgDry,
    variants: null,
    nutritionId: "dry",
  },
  {
    id: "powder",
    title: "Mushroom Powder",
    price: 450,
    unit: "per 100g",
    short: "Finely ground mushroom powder — perfect for seasoning.",
    image: imgPowder,
    variants: null,
    nutritionId: "powder",
  },
  {
    id: "wariyan",
    title: "Mushroom Wariyan",
    price: 120,
    unit: "per 100g packet",
    short: "Traditional mushroom wadiyan — tasty & nutritious.",
    image: imgWariyan,
    variants: null,
    nutritionId: "wariyan",
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
// Nutrition Sheet Component (Modal/Overlay)
// =========================================================

function NutritionSheet({ product, onClose }) {
  const data = NUTRITION_DATA[product.nutritionId] || {};

  return (
    <div className="sheet-overlay" onClick={onClose} style={{ zIndex: 999 }}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 450 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 10, marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#14502b' }}>{data.title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: '#333' }}>✕</button>
        </div>

        <h4 style={{ margin: '0 0 10px' }}>Nutritional Value (per 100g $\pm$ )</h4>
        
        <table className="nutrition-table">
          <tbody>
            <tr><td>Energy</td><td>{data.calories}</td></tr>
            <tr><td>Protein</td><td>{data.protein}</td></tr>
            <tr><td>Total Fat</td><td>{data.fat}</td></tr>
            <tr><td>Total Carbohydrates</td><td>{data.carbohydrates}</td></tr>
            <tr><td>Dietary Fiber</td><td>{data.fiber}</td></tr>
          </tbody>
        </table>

        <div style={{ marginTop: 20 }}>
            <h4 style={{ margin: '0 0 10px' }}>Key Health Benefits</h4>
            <p style={{ margin: 0, color: '#556e64', lineHeight: 1.4 }}>{data.healthBenefits}</p>
        </div>

        <div style={{ marginTop: 15 }}>
            <h4 style={{ margin: '0 0 5px' }}>Rich In</h4>
            <p style={{ margin: 0, color: '#556e64', fontSize: 14 }}>
                <strong>Vitamins:</strong> {data.vitamins}<br/>
                <strong>Minerals & Compounds:</strong> {data.minerals}
            </p>
        </div>

        <div style={{ marginTop: 20, paddingTop: 10, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#999' }}>*Values are approximate and can vary based on batch, processing, and ingredients. Pickles and Wariyan contain additional ingredients.</p>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// Checkout Form Component
// =========================================================

function CheckoutForm({ cart, subtotal, onClose, onOrderPlaced }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === START: WhatsApp Order Logic ===
  const handleSubmit = (e, paymentType) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Please fill in all required fields (Name, Phone, Address).");
      return;
    }
    
    // --- WhatsApp Logic ---
    const orderItems = cart.map(item => 
        `- ${item.productTitle}${item.variantLabel ? ` (${item.variantLabel})` : ''} x${item.qty} (${formatINR(item.price * item.qty)})`
    ).join('\n');

    const paymentLabel = paymentType === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment (Confirmation needed)';
    
    // Creates the message with customer and order details, encoded for the URL
    const message = encodeURIComponent(`*New Order Alert!*%0A%0A*Customer Info:*%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0AAddress: ${address}%0ANote: ${note}%0A%0A*Order Details:*%0A${orderItems}%0A%0A*Subtotal:* ${formatINR(subtotal)}%0A*Payment:* ${paymentLabel}%0A%0A*Please send this message to confirm your order.*`);
    
    // Replaced with your confirmed number
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
  // === END: WhatsApp Order Logic ===


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
  // Removed isHealthPage state and related logic
  const [nutriSheetProduct, setNutriSheetProduct] = useState(null); // Product for nutrition sheet

  const cartBoxRef = useRef(null);
  const miniTimerRef = useRef(null);

  // when the sheet or checkout is open, prevent body scrolling
  useEffect(() => {
    const shouldLock = !!sheetProduct || isCheckoutOpen || !!nutriSheetProduct;
    if (shouldLock) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [sheetProduct, isCheckoutOpen, nutriSheetProduct]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
    };
  }, []);

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
  
  // Handlers for the NutritionSheet
  const handleShowNutrition = (product) => {
      setNutriSheetProduct(product);
  }
  const handleCloseNutrition = () => {
      setNutriSheetProduct(null);
  }


  return (
    <div className="app">
      
      {/* ---------------------------------------------------- */}
      {/* MAIN SHOP PAGE */}
      {/* ---------------------------------------------------- */}
      
      {/* Topbar */}
      <header className="topbar" role="banner">
        <div className="brand">
          <img className="logo" src={PUBLIC_LOGO_PATH} alt="Anant Gill Agro Farm logo" />
          <div>
            <h1 className="title">Anant Gill Agro Farm</h1>
            <div className="subtitle">Best quality fresh organic mushrooms & delicious pickles</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Cart Button (Scrolls to Cart) */}
          <button
            className="cart-button"
            onClick={scrollToCart}
            aria-label={`Open cart with ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
          >
            Cart ({itemCount})
          </button>
        </div>
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
                    {/* Detail button now opens Nutrition Sheet directly */}
                    <button 
                        className="detail-btn"
                        onClick={() => handleShowNutrition(p)}
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

      {/* Footer */}
      <footer className="site-footer" role="contentinfo" style={{ backgroundImage: `url(${FOOTER_BG_PATH})` }}>
        <div className="footer-inner">
          <div className="footer-left">
            {/* Logo path confirmed correct */}
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
      {itemCount > 0 && (
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

      {/* Nutrition Sheet Modal */}
      {nutriSheetProduct && (
          <NutritionSheet 
              product={nutriSheetProduct} 
              onClose={handleCloseNutrition} 
          />
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
