import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Admin from './pages/Admin';
import { db } from './firebase'; 
import { collection, getDocs, orderBy, query } from "firebase/firestore"; 

// --- NAVIGATION COMPONENT ---
function Navigation() {
  const location = useLocation();
  
  // 1. Jo URL /admin hoy to aakhi Nav bar hide thai jase
  if (location.pathname === '/admin') return null;

  return (
    <nav style={{ 
      padding: '15px 40px', 
      background: '#1a4d2e', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' }}>
        MARA SHOP
      </Link>
      
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Shop</Link>
        {/* Admin ni link ahi thi delete kari nakhi che jethi user ne na dekhay */}
      </div>
    </nav>
  );
}

// --- HOME COMPONENT ---
function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    getProducts();
  }, []);

  return (
    <div style={{ padding: '40px 20px', background: '#f9f9f9', minHeight: '90vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1a4d2e', fontSize: '32px', marginBottom: '10px' }}>Pure A2 Gir Cow Ghee</h1>
        <p style={{ color: '#666' }}>Traditional Valona Method - From Our Farm to Your Home</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Dukaan khuli rahi che...</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {products.map(p => (
            <div key={p.id} style={{ 
              background: 'white', 
              borderRadius: '15px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <img 
                src={p.productImage || 'https://via.placeholder.com/300x200?text=A2+Ghee'} 
                alt={p.productName} 
                style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1a4d2e' }}>{p.productName}</h3>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>₹{p.productPrice}</p>
                <a 
                  href={`https://wa.me/91XXXXXXXXXX?text=I want to buy ${p.productName}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    display: 'block', 
                    background: '#1a4d2e', 
                    color: 'white', 
                    textDecoration: 'none', 
                    padding: '12px', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    marginTop: '15px'
                  }}
                >
                  Buy Now on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MAIN APP ---
export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}