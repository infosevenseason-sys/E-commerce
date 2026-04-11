import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, getDocs, orderBy, query, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore"; 

// --- NAVIGATION COMPONENT ---
function Navigation() {
  const location = useLocation();
  if (location.pathname === '/admin') return null;

  return (
    <nav style={{ 
      padding: '15px 40px', background: '#1a4d2e', display: 'flex', 
      justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' }}>
        MARA SHOP
      </Link>
      <div style={{ display: 'flex', gap: '25px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Shop</Link>
      </div>
    </nav>
  );
}

// --- ADMIN COMPONENT (Add & Manage Products) ---
function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [products, setProducts] = useState([]);

  // Products fetch karva mate
  const fetchProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      productName: name, productPrice: price, productImage: image, createdAt: serverTimestamp()
    });
    alert("Ghee product umerai gayu!");
    setName(''); setPrice(''); setImage('');
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Sure delete karvu che?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a4d2e' }}>Admin Panel - Manage Ghee Shop</h2>
      
      {/* Form to Add Product */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '40px', background: '#f4f4f4', padding: '20px', borderRadius: '10px' }}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{padding:'8px'}}/>
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required style={{padding:'8px'}}/>
        <input type="text" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required style={{padding:'8px'}}/>
        <button type="submit" style={{background:'#1a4d2e', color:'white', border:'none', padding:'10px 20px', cursor:'pointer'}}>Add</button>
      </form>

      {/* Product List for Admin to Delete */}
      <h3>Current Products</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{padding:'10px'}}>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{padding:'10px'}}><img src={p.productImage} width="50" alt=""/></td>
              <td>{p.productName}</td>
              <td>₹{p.productPrice}</td>
              <td><button onClick={() => handleDelete(p.id)} style={{background:'red', color:'white', border:'none', padding:'5px 10px', cursor:'pointer'}}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/><Link to="/">← Go to Website</Link>
    </div>
  );
}

// --- HOME COMPONENT ---
function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    getProducts();
  }, []);

  return (
    <div style={{ padding: '40px 20px', background: '#f9f9f9', minHeight: '90vh' }}>
      <h1 style={{ textAlign: 'center', color: '#1a4d2e' }}>Pure A2 Gir Cow Ghee</h1>
      {loading ? <p style={{textAlign:'center'}}>Loding...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <img src={p.productImage} alt={p.productName} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ color: '#1a4d2e' }}>{p.productName}</h3>
                <p style={{ fontSize: '22px', fontWeight: 'bold' }}>₹{p.productPrice}</p>
                <a href={`https://wa.me/91XXXXXXXXXX?text=I want to buy ${p.productName}`} target="_blank" rel="noreferrer" style={{ display: 'block', background: '#1a4d2e', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '8px', marginTop: '15px' }}>
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