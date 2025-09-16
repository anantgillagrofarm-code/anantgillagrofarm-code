/* src/index.css */

/* Reset & base */
* { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background: #f6fff6; color: #213; }

/* Creative mushroom collage background
   - multiple layered background images with low opacity
   - large subtle blur + dark overlay for contrast
*/
:root {
  --accent: #2a7a2a;
  --card-bg: rgba(255,255,255,0.9);
  --muted: #6b7a6b;
}

/* Body uses layered images for a soft textured background */
body {
  background-color: #f2f9f2;
  background-image:
    /* subtle vignette gradient */
    radial-gradient(1200px 400px at 10% 10%, rgba(0,0,0,0.04), transparent 20%),
    linear-gradient(180deg, rgba(240,252,240,0.8), rgba(238,247,238,0.9)),
    /* large decorative mushrooms (faded) */
    url('/src/assets/dry_mushrooms.jpg'),
    url('/src/assets/fresh_mushrooms.jpg'),
    url('/src/assets/mushroom_powder.jpg');
  background-repeat: no-repeat, no-repeat, no-repeat, repeat-x, repeat-x;
  background-position: center top, right 10% bottom 20%, left 10% bottom 10%, center bottom, right bottom;
  background-size: cover, 45rem, 28rem, 18rem, 22rem;
  /* soften the images */
  filter: none;
  position: relative;
  overflow-y: auto;
}

/* Add a semi-transparent overlay to improve contrast over images */
body::before{
  content:"";
  position:fixed;
  inset:0;
  background: linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.90));
  pointer-events:none;
  z-index:0;
}

/* Container */
.container{
  max-width:1100px;
  margin:24px auto;
  padding:18px 16px;
  position:relative;
  z-index:1; /* sit above background overlay */
}

/* Header */
.site-header, header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  background: transparent;
  padding: 8px 0;
}
.header-inner, .title-wrap { display:flex;align-items:center;gap:12px; }
.logo, .footer-logo { width:72px;height:72px;object-fit:contain;border-radius:10px;background:#fff;padding:6px;box-shadow:0 6px 18px rgba(10,20,10,0.05);}

/* Brand */
.brand, h1 { margin:0; font-size:1.4rem; color:var(--accent); font-weight:700; }
.subtitle, .tagline { color:var(--muted); margin-top:4px; font-size:0.95rem; }

/* Controls */
.admin-bar .top-controls { display:flex; gap:8px; flex-wrap:wrap; }
button { cursor:pointer; border:0; padding:8px 10px; border-radius:8px; }
.btn-primary { background:var(--accent); color:#fff; box-shadow:0 8px 22px rgba(40,80,40,0.12); }
.btn-ghost { background:transparent; border:1px solid rgba(180,210,180,0.6); color:#2f5130; }

/* Product grid & cards */
.grid {
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap:14px;
  margin-top:18px;
}
.card {
  background: var(--card-bg);
  border-radius:12px;
  padding:12px;
  box-shadow: 0 8px 20px rgba(20,40,20,0.06);
  display:flex;
  flex-direction:column;
  transition: transform .14s ease;
}
.card:hover { transform: translateY(-6px); }
.card img { width:100%; height:160px; object-fit:cover; border-radius:8px; }

/* Card body */
.card-body { padding-top:8px; display:flex; flex-direction:column; gap:8px; }
.product-title { margin:0; font-size:1.05rem; font-weight:600; color:#163a16; }
.muted { color:var(--muted); font-size:0.9rem; }

/* Price & actions */
.price-row { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.price { color: #0a6e0a; font-weight:800; font-size:1.08rem; }
.btn { padding:8px 10px; border-radius:8px; }

/* Cart button (floating) */
.cart-btn { position:fixed; right:14px; bottom:14px; background:var(--accent); color:#fff; padding:12px 14px; border-radius:999px; box-shadow: 0 12px 30px rgba(20,40,20,0.18); z-index:60; }

/* Cart panel */
.cart-panel { position:fixed; right:0; top:0; height:100%; width:360px; background:#fff; padding:18px; box-shadow:-8px 0 30px rgba(0,0,0,0.12); transform:translateX(110%); transition: transform .28s ease; z-index:70; }
.cart-panel.open { transform:translateX(0); }

/* Footer */
.site-footer, footer { margin-top:24px; padding:14px; border-radius:10px; background: linear-gradient(180deg,#f9fff9,#f3f9f3); z-index:1; }
.footer-inner { display:flex; gap:20px; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; }

/* Responsive tweaks */
@media (max-width: 740px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
  .logo{ width:56px; height:56px;}
  .cart-panel{ width:100%; }
}

/* Small utilities */
.small{font-size:0.85rem;}
.muted.small{ color:#6d7a6d; }
