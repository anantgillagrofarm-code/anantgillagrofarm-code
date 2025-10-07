import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faFacebook, faInstagram, faTwitter, faWhatsapp, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram as fabInstagram, faTwitter as fabTwitter, faWhatsapp as fabWhatsapp } from '@fortawesome/free-brands-svg-icons';

// --- Assets ---
import logo from './assets/logo.jpg';
import freshMushrooms from './assets/fresh_mushrooms.jpg';
import driedMushrooms from './assets/dried_mushrooms.jpg';
import mushroomPickle from './assets/mushroom_pickle.jpg';
import mushroomPowder from './assets/mushroom_powder.jpg';
import mushroomWariyan from './assets/mushroom_wariyan.jpg';
// --- END Assets ---

// --- Data for Products (ProductList is now the default page) ---
const products = [
  {
    id: 1,
    name: 'Fresh Button Mushrooms',
    description: 'Farm-fresh, hand-picked button mushrooms, perfect for all your culinary needs. High in Vitamin D and B-vitamins.',
    price: '₹200 / Kg',
    image: freshMushrooms,
    healthBenefit: 'High in Vitamin D and B-vitamins, supports immunity and bone health.',
    nutritionalKey: 'fresh',
  },
  {
    id: 2,
    name: 'Dried Mushroom Slices',
    description: 'Premium dried mushrooms. Rehydrate for a meaty texture or grind for seasoning. Long shelf life.',
    price: '₹800 / 100g',
    image: driedMushrooms,
    healthBenefit: 'Concentrated protein and fiber source. Excellent for adding an umami flavor to dishes.',
    nutritionalKey: 'dried',
  },
  {
    id: 3,
    name: 'Mushroom Pickle',
    description: 'Spicy and tangy mushroom pickle, made with traditional Indian spices and high-quality oil. A delightful condiment.',
    price: '₹350 / Jar',
    image: mushroomPickle,
    healthBenefit: 'Aids digestion with probiotics (due to fermentation) and provides essential minerals.',
    nutritionalKey: 'pickle',
  },
  {
    id: 4,
    name: 'Mushroom Powder',
    description: 'Finely ground mushroom powder. Easily mix into smoothies, soups, or coffee for a nutritional boost.',
    price: '₹550 / Jar',
    image: mushroomPowder,
    healthBenefit: 'An excellent supplement for protein, fiber, and powerful antioxidants like L-Ergothioneine.',
    nutritionalKey: 'powder',
  },
  {
    id: 5,
    name: 'Mushroom Wariyan',
    description: 'Traditional Punjabi Wariyan made with quality mushrooms and lentils. A unique, savory cooking additive.',
    price: '₹450 / 250g',
    image: mushroomWariyan,
    healthBenefit: 'Combination of mushroom protein and lentil fiber for enhanced satiety and gut health.',
    nutritionalKey: 'wariyan',
  },
];
// --- END Data ---

// --- Nutritional Data (Per 100g) ---
// Note: These are general, reliable values for each category.
const nutritionalData = {
  fresh: {
    title: 'Fresh Mushrooms (Button/White - Raw)',
    calories: '22 Kcal',
    protein: '3.1 g',
    fat: '0.3 g',
    carbohydrates: '3.3 g',
    fiber: '1.0 g',
    vitamins: 'Excellent source of Riboflavin (B2), Niacin (B3), Pantothenic Acid (B5)',
    minerals: 'Good source of Potassium and Phosphorus',
  },
  dried: {
    title: 'Dried Mushrooms (General)',
    calories: '293 Kcal',
    protein: '34.0 g',
    fat: '3.9 g',
    carbohydrates: '17.4 g',
    fiber: '14.1 g',
    vitamins: 'Concentrated source of B-vitamins (Niacin, Riboflavin)',
    minerals: 'High in Iron, Copper, and Selenium',
  },
  pickle: {
    title: 'Mushroom Pickle (Approximate)',
    calories: '95 - 180 Kcal',
    protein: '3.0 - 6.0 g',
    fat: '6.0 - 8.8 g',
    carbohydrates: '1.0 - 3.5 g',
    fiber: '1.0 - 2.0 g',
    vitamins: 'Vitamins preserved from mushrooms, but may contain high sodium from salt and oil.',
    minerals: 'Source of Potassium and Iron, generally high in Sodium.',
  },
  powder: {
    title: 'Mushroom Powder (Dry Weight)',
    calories: '250 - 307 Kcal',
    protein: '25.0 - 35.0 g',
    fat: '1.5 - 3.0 g',
    carbohydrates: '50.0 - 75.0 g',
    fiber: '6.0 - 25.0 g',
    vitamins: 'High concentration of Vitamin D (if UV-exposed) and B-Vitamins',
    minerals: 'Rich in Beta-Glucans and Antioxidants (Ergothioneine)',
  },
  wariyan: {
    title: 'Mushroom Wariyan (Mushroom & Lentil)',
    calories: '300 - 350 Kcal',
    protein: '20.0 - 25.0 g',
    fat: '5.0 - 8.0 g',
    carbohydrates: '40.0 - 50.0 g',
    fiber: '10.0 - 15.0 g',
    vitamins: 'Combines nutrients from mushrooms and lentils.',
    minerals: 'Excellent source of Plant-Based Protein and Dietary Fiber.',
  }
};
// --- END Nutritional Data ---

// --- Components ---

const Header = ({ onNavigate }) => (
  <header className="header">
    <div className="logo-container" onClick={() => onNavigate('shop')}>
      <img src={logo} alt="Anant Gill Foods Logo" className="logo" />
      <span className="brand-name">Anant Gill Foods</span>
    </div>
    <nav className="nav">
      <button className="nav-button" onClick={() => onNavigate('shop')}>Shop</button>
      <button className="nav-button" onClick={() => onNavigate('health')}>Health Benefits</button>
      <button className="nav-button" onClick={() => onNavigate('contact')}>Contact Us</button>
    </nav>
  </header>
);

const Footer = ({ onNavigate }) => {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', checkScrollTop);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <img src={logo} alt="Anant Gill Foods Logo" className="footer-logo" />
          <p>
            Anant Gill Foods is committed to delivering the highest quality mushroom products, from farm to table. Sustainably grown for a healthier you.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={fabInstagram} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={fabTwitter} /></a>
            <a href="https://wa.me/YOURPHONENUMBER" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={fabWhatsapp} /></a>
          </div>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li onClick={() => onNavigate('shop')}>Shop</li>
            <li onClick={() => onNavigate('health')}>Health Benefits</li>
            <li onClick={() => onNavigate('contact')}>Contact Us</li>
            <li>Privacy Policy (Placeholder)</li>
            <li>Terms of Service (Placeholder)</li>
          </ul>
        </div>
        <div className="footer-section contact-info">
          <h2>Contact Info</h2>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> Ludhiana, Punjab, India</p>
          <p><FontAwesomeIcon icon={faPhone} className="icon" /> +91 99999 99999 (Placeholder)</p>
          <p><FontAwesomeIcon icon={faEnvelope} className="icon" /> contact@anantgillfoods.in (Placeholder)</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Anant Gill Foods. All Rights Reserved.
      </div>
      {showScroll && (
        <button className="scroll-to-top" onClick={scrollTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </footer>
  );
};

const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.image} alt={product.name} className="product-image" />
    <div className="product-info">
      <h3>{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">{product.price}</p>
      <button className="buy-now-button">Buy Now</button>
      <div className="product-health-tip">
        <strong>Benefit:</strong> {product.healthBenefit}
      </div>
    </div>
  </div>
);

const ProductList = () => (
  <div className="product-list-page">
    <h2 className="section-title">Our Mushroom Products</h2>
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

const NutritionalValueTable = ({ data }) => (
  <div className="nutritional-table">
    <h3 className="nutritional-title">{data.title} (Per 100g)</h3>
    <table>
      <thead>
        <tr>
          <th>Nutrient</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Energy</td><td>{data.calories}</td></tr>
        <tr><td>Protein</td><td>{data.protein}</td></tr>
        <tr><td>Fat</td><td>{data.fat}</td></tr>
        <tr><td>Carbohydrates</td><td>{data.carbohydrates}</td></tr>
        <tr><td>Dietary Fiber</td><td>{data.fiber}</td></tr>
      </tbody>
    </table>
    <div className="nutritional-details">
      <p><strong>Key Vitamins:</strong> {data.vitamins}</p>
      <p><strong>Key Minerals & Compounds:</strong> {data.minerals}</p>
    </div>
  </div>
);

const HealthPage = () => (
  <div className="health-page">
    <h2 className="section-title">The Power of Mushrooms</h2>
    <p className="intro-text">Mushrooms are nutritional powerhouses, low in calories and fat, yet packed with essential vitamins, minerals, and potent antioxidants. Our products harness these benefits for your health.</p>

    <div className="nutritional-breakdown-grid">
      <NutritionalValueTable data={nutritionalData.fresh} />
      <NutritionalValueTable data={nutritionalData.dried} />
      <NutritionalValueTable data={nutritionalData.pickle} />
      <NutritionalValueTable data={nutritionalData.powder} />
      <NutritionalValueTable data={nutritionalData.wariyan} />
      
      {/* Disclaimer Section */}
      <div className="nutritional-disclaimer">
        <h3>A Note on Nutritional Information:</h3>
        <p>The values above are general averages per $100\text{ g}$ based on standard nutritional databases and typical product compositions. Actual values may vary slightly based on specific ingredients, preparation methods, and mushroom species used in each batch. Please refer to the specific product packaging for precise nutrient information.</p>
      </div>
    </div>
  </div>
);


const ContactPage = () => (
  <div className="contact-page">
    <h2 className="section-title">Contact Us</h2>
    <p>We'd love to hear from you! Please reach out with any questions, wholesale inquiries, or feedback.</p>
    
    <div className="contact-info-block">
      <h3>Get in Touch</h3>
      <p><FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> **Head Office (Placeholder):** Ludhiana, Punjab, India</p>
      <p><FontAwesomeIcon icon={faPhone} className="icon" /> **Phone (Placeholder):** +91 99999 99999</p>
      <p><FontAwesomeIcon icon={faEnvelope} className="icon" /> **Email (Placeholder):** contact@anantgillfoods.in</p>
      <p><FontAwesomeIcon icon={faWhatsapp} className="icon" /> **WhatsApp:** +91 99999 99999</p>
    </div>

    <form className="contact-form">
      <h3>Send us a Message</h3>
      <input type="text" placeholder="Your Name" required />
      <input type="email" placeholder="Your Email" required />
      <input type="text" placeholder="Subject" required />
      <textarea placeholder="Your Message" rows="5" required></textarea>
      <button type="submit" className="submit-button">Send Message</button>
    </form>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('shop'); // Default to the product list page

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <ProductList />;
      case 'health':
        return <HealthPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <ProductList />;
    }
  };

  return (
    <div className="App">
      <Header onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
