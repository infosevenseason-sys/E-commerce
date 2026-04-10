import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const fetchProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !imgUrl) return alert("Details bharo!");
    setLoading(true);
    try {
      if (isEditing) {
        await updateDoc(doc(db, "products", currentId), { productName: name, productPrice: Number(price), productImage: imgUrl });
        alert("Updated!");
      } else {
        await addDoc(collection(db, "products"), { productName: name, productPrice: Number(price), productImage: imgUrl, createdAt: new Date() });
        alert("Added!");
      }
      cancelEdit(); fetchProducts();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const startEdit = (p) => {
    setIsEditing(true); setCurrentId(p.id); setName(p.productName); setPrice(p.productPrice); setImgUrl(p.productImage);
  };

  const cancelEdit = () => {
    setIsEditing(false); setCurrentId(null); setName(''); setPrice(''); setImgUrl('');
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete karvu che?")) {
      await deleteDoc(doc(db, "products", id)); fetchProducts();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f4f7f6', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      {/* SIDEBAR */}
      <div style={{ width: '280px', background: '#1a4d2e', color: 'white', padding: '30px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ letterSpacing: '2px', borderBottom: '1px solid #257d63', pb: '10px' }}>GIR GHEE ADMIN</h2>
        <div style={{ marginTop: '40px', flexGrow: 1 }}>
          <div style={{ padding: '15px', background: '#257d63', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }}>📦 Products</div>
          <div style={{ padding: '15px', opacity: 0.6, cursor: 'not-allowed' }}>📊 Sales Reports</div>
          <div style={{ padding: '15px', opacity: 0.6, cursor: 'not-allowed' }}>🛒 Orders</div>
        </div>
        <div style={{ borderTop: '1px solid #257d63', pt: '10px', fontSize: '14px' }}>Version 1.0.2</div>
      </div>

      {/* MAIN PANEL */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <h1 style={{ color: '#1a4d2e', marginTop: 0 }}>Dashboard</h1>
        
        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Form Card */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px' }}>{isEditing ? "Sudharo Karo" : "Navu Product Umero"}</h3>
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Product Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              <label style={labelStyle}>Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
              <label style={labelStyle}>Image URL</label>
              <input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} style={inputStyle} />
              
              <button type="submit" style={{ ...btnStyle, background: isEditing ? '#f39c12' : '#1a4d2e' }}>
                {loading ? "Processing..." : isEditing ? "Update Product" : "Publish Product"}
              </button>
              {isEditing && <button onClick={cancelEdit} style={{ ...btnStyle, background: '#eee', color: '#333', marginTop: '10px' }}>Cancel</button>}
            </form>
          </div>

          {/* Table Card */}
          <div style={{ flex: 1, background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3>Inventory ({products.length})</h3>
            <div style={{ marginTop: '20px' }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={p.productImage} alt="p" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: '600' }}>{p.productName}</span>
                  </div>
                  <div>
                    <button onClick={() => startEdit(p)} style={actionBtn}>Edit</button>
                    <button onClick={() => deleteProduct(p.id)} style={{ ...actionBtn, color: 'red' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '15px', boxSizing: 'border-box' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' };
const btnStyle = { width: '100%', padding: '14px', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const actionBtn = { background: 'none', border: 'none', cursor: 'pointer', color: '#1a4d2e', fontWeight: 'bold', marginLeft: '15px' };

export default Admin;