import React from "react";

/* Small, reusable product card component */
function ProductCard({ title, price, desc, whatsappMsg }) {
  const phone = "918837554747"; // <-- change to your number if needed
  const encoded = encodeURIComponent(whatsappMsg);
  return (
    <div style={{
      background: "white",
      color: "#0f3b1d",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      width: "100%",
      maxWidth: 320,
      boxSizing: "border-box",
      margin: 8,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <div>
        <h4 style={{ margin: "0 0 8px", fontSize: 18 }}>{title}</h4>
        <p style={{ margin: "0 0 12px", color: "#3d3d3d", fontSize: 14 }}>{desc}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ fontWeight: 700, color: "#0f3b1d" }}>₹{price}</div>
        <a
          href={`https://wa.me/${phone}?text=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#25D366",
            color: "white",
            padding: "8px 12px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 14
          }}
        >
          Order
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const products = [
    { title: "Fresh Mushrooms (per kg)", price: 200, desc: "Locally grown, fresh & organic.", whatsappMsg: "Hi Anant Gill Agro Farm, I want to order Fresh Mushrooms (1 kg)." },
    { title: "Mushroom Pickle (500 g)", price: 500, desc: "Tangy & natural pickles made in-house.", whatsappMsg: "Hi Anant Gill Agro Farm, I want to order Mushroom Pickle (500 g)." },
    { title: "Dry Mushrooms (250 g)", price: 600, desc: "Sun-dried, long shelf life.", whatsappMsg: "Hi Anant Gill Agro Farm, I want to order Dry Mushrooms (250 g)." },
    { title: "Mushroom Powder (100 g)", price: 400, desc: "Powdered for soups & recipes.", whatsappMsg: "Hi Anant Gill Agro Farm, I want to order Mushroom Powder (100 g)." }
  ];

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", lineHeight: 1.45, color: "#0f3b1d" }}>
      {/* NAV / HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        background: "#083a22",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 40
      }}>
        <div style={{display: "flex", alignItems: "center", gap: 12}}>
          <img src="/anant_gill_logo.png" alt="Anant Gill Agro Farm" style={{ height: 48 }} />
          <div style={{ fontWeight: 700, fontSize: 18 }}>ANANT GILL AGRO FARM</div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#products" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Products</a>
          <a href="#about" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>About</a>
          <a href="#contact" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Contact</a>
          <a href="https://wa.me/918837554747?text=Hi%20Anant%20Gill%20Agro%20Farm" target="_blank" rel="noopener noreferrer"
             style={{ background: "#25D366", color: "#083a22", padding: "8px 12px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* HERO */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "48px 20px",
        background: "linear-gradient(180deg,#0f3b1d 0%, #0a2e17 100%)",
        color: "white"
      }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Fresh mushrooms, picked & packed by growers you trust</h1>
        <p style={{ maxWidth: 800, marginTop: 12, color: "#e6e6e6" }}>
          Anant Gill Agro Farm — Premium organic mushrooms, pickles and mushroom products. Farm-to-table freshness delivered with care.
        </p>
        <div style={{ marginTop: 18 }}>
          <a href="#products" style={{
            background: "#e6c79a", color: "#083a22", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700, marginRight: 10
          }}>
            Shop Products
          </a>
          <a href="#contact" style={{
            background: "transparent", border: "2px solid white", color: "white", padding: "10px 18px", borderRadius: 10, textDecoration: "none", fontWeight: 700
          }}>
            Contact Us
          </a>
        </div>
      </section>

      {/* TRUST / STATS */}
      <section style={{ display: "flex", justifyContent: "center", gap: 24, padding: "22px 18px", background: "#f8faf8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>100+</div>
          <div style={{ color: "#666" }}>Satisfied Customers</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>5+</div>
          <div style={{ color: "#666" }}>Years Farming</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>100% </div>
          <div style={{ color: "#666" }}>Natural Practices</div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section id="products" style={{ padding: "28px 18px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ marginBottom: 12 }}>Our Products</h2>
          <p style={{ color: "#444", marginTop: 0 }}>Quality-tested farm produce — click Order to message us on WhatsApp and confirm your order.</p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: 18 }}>
            {products.map((p, i) => (
              <ProductCard key={i} title={p.title} price={p.price} desc={p.desc} whatsappMsg={p.whatsappMsg} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "28px 18px", background: "#fbfdfb" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2>About Anant Gill Agro Farm</h2>
          <p style={{ color: "#444" }}>
            We are a family-run farm focused on sustainable mushroom cultivation and handmade products.
            We follow traditional methods combined with careful quality control to ensure the freshest harvest.
          </p>
          <ul style={{ color: "#444" }}>
            <li>Certified producer under MSME (registered units shown on our certificate)</li>
            <li>Farm to table — minimal processing, no preservatives</li>
            <li>Local deliveries and bulk orders welcomed</li>
          </ul>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "28px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3>Contact</h3>
            <p style={{ color: "#444" }}>Email: <a href="mailto:youremail@example.com">youremail@example.com</a></p>
            <p style={{ color: "#444" }}>Phone: <a href="tel:+918837554747">+91 88375 54747</a></p>
            <p style={{ color: "#444" }}>Address: Your farm village / district, State, India</p>

            <div style={{ marginTop: 10 }}>
              <a href="https://wa.me/918837554747?text=Hi%20Anant%20Gill%20Agro%20Farm" target="_blank" rel="noopener noreferrer"
                 style={{ background: "#25D366", color: "#083a22", padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <h3>Order Form (email)</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = e.target;
              const sub = encodeURIComponent("Order from website");
              const body = encodeURIComponent(`Product: ${f.product.value}\nQty: ${f.qty.value}\nName: ${f.name.value}\nPhone: ${f.phone.value}\nAddress: ${f.address.value}`);
              window.location.href = `mailto:youremail@example.com?subject=${sub}&body=${body}`;
            }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input name="product" placeholder="Product name" required style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              <input name="qty" type="number" placeholder="Quantity" defaultValue="1" style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              <input name="name" placeholder="Your name" required style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              <input name="phone" placeholder="Phone" required style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              <textarea name="address" placeholder="Address (optional)" style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              <button type="submit" style={{ background: "#0f3b1d", color: "white", padding: "10px 12px", borderRadius: 8, fontWeight: 700 }}>
                Place Order (Email)
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "18px", background: "#083a22", color: "white", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 8 }}>
            © {new Date().getFullYear()} Anant Gill Agro Farm — Anant Foods (Brand)
          </div>
          <div style={{ color: "#cfead0", fontSize: 13 }}>
            Registered MSME: UDYAM-PB-01-0117522
          </div>
        </div>
      </footer>
    </div>
  );
}
