// ... upar na imports ...
import { auth, db } from './firebase';

// Admin login function ma aa badlav check karjo:
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // email.trim() bau jaruri che
    await signInWithEmailAndPassword(auth, email.trim(), password);
    alert("Login Successful!");
  } catch (error) {
    console.error("Firebase Error Code:", error.code);
    if (error.code === 'auth/invalid-credential') {
      alert("Email athva Password khoto che!");
    } else {
      alert("Error: " + error.code);
    }
  }
};
// ... baki no code ...
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { db, auth } from './firebase'; 
import { collection, getDocs, orderBy, query, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore"; 
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// --- 1. NAVIGATION ---
function Navigation() {
  const location = useLocation();
  if (location.pathname === '/admin') return null;

  return (
    <nav style={{ padding: '15px 40px', background: '#1a4d2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' }}>MARA SHOP</Link>
      <div style={{ display: 'flex', gap: '25px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Shop</Link>
      </div>
    </nav>
  );
}

// --- 2. ADMIN PANEL ---
function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchProducts();
    });
    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      alert("Login Failed! Email/Password check karo.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        productName: name, productPrice: price, productImage: image, createdAt: serverTimestamp()
      });
      setName(''); setPrice(''); setImage('');
      fetchProducts();
      alert("Product Added!");
    } catch (err) { alert("Error adding product"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete karvu che?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', background: '#f4f4f4', minHeight: '100vh' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px' }}>
          <h2 style={{ color: '#1a4d2e' }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required style={{padding:'12px'}}/>
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required style={{padding:'12px'}}/>
            <button type="submit" style={{padding:'12px', background:'#1a4d2e', color:'white', border:'none', cursor:'pointer'}}>Login</button>
          </form>
          <p style={{marginTop:'15px'}}><Link to="/">← Back to Store</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={() => signOut(auth)} style={{ background: 'red', color: 'white', padding: '5px 15px', border: 'none', borderRadius: '5px' }}>Logout</button>
      </div>
      <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', margin: '20px 0', background: '#eee', padding: '15px', borderRadius: '8px' }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{flex:1, padding:'8px'}} />
        <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required style={{width:'80px', padding:'8px'}} />
        <input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required style={{flex:1, padding:'8px'}} />
        <button type="submit" disabled={loading} style={{background:'#1a4d2e', color:'white', border:'none', padding:'0 20px'}}>{loading ? '...' : 'Add'}</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{background:'#1a4d2e', color:'white'}}><th style={{padding:'10px'}}>Product</th><th>Price</th><th>Action</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{borderBottom:'1px solid #ddd', textAlign:'center'}}>
              <td style={{padding:'10px'}}>{p.productName}</td>
              <td>₹{p.productPrice}</td>
              <td><button onClick={() => handleDelete(p.id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- 3. HOME COMPONENT ---
function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    getProducts();
  }, []);

  return (
    <div style={{ padding: '40px 20px', background: '#f9f9f9', minHeight: '90vh' }}>
      <h1 style={{ textAlign: 'center', color: '#1a4d2e' }}>Pure A2 Gir Cow Ghee</h1>
      {loading ? <p style={{textAlign:'center'}}>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <img src={p.productImage} alt={p.productName} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ color: '#1a4d2e' }}>{p.productName}</h3>
                <p style={{ fontSize: '22px', fontWeight: 'bold' }}>₹{p.productPrice}</p>
                <a href={`https://wa.me/91XXXXXXXXXX?text=I want to buy ${p.productName}`} target="_blank" rel="noreferrer" style={{ display: 'block', background: '#1a4d2e', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '8px', marginTop: '15px' }}>Buy Now on WhatsApp</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 4. MAIN APP ---
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