import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Tamara path mujab sudharjo
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Logout Function
  const handleLogout = () => signOut(auth);

  // Fetch Products
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setProducts(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => { fetchProducts(); }, []);

  // Add Product
  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) return alert("Badhi detail bharo!");
    await addDoc(collection(db, "products"), { name, price, imageUrl });
    setName(''); setPrice(''); setImageUrl('');
    fetchProducts();
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if(window.confirm("Kharekhar delete karvu che?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.brandName}>Seven Season</h2>
        <p style={styles.sidebarItem}>📊 Dashboard</p>
        <p style={styles.sidebarItem}>📦 Products</p>
        <p style={styles.sidebarItem}>🛒 Orders</p>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Manage your A2 Gir Cow Ghee Inventory</p>
        </div>

        {/* Form Card */}
        <div style={styles.card}>
          <h3>Add New Product</h3>
          <form onSubmit={addProduct} style={styles.formGrid}>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Product Name" style={styles.input} />
            <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price (₹)" style={styles.input} />
            <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="Image URL" style={styles.input} />
            <button type="submit" style={styles.addBtn}>Add Product</button>
          </form>
        </div>

        {/* Product Table */}
        <div style={styles.card}>
          <h3>Current Products</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={styles.tableRow}>
                  <td><img src={p.imageUrl} alt={p.name} style={styles.tableImg} /></td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <button onClick={() => deleteProduct(p.id)} style={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- PREMIUM STYLING ---
const styles = {
  dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: '250px', backgroundColor: '#1a4d2e', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' },
  brandName: { fontSize: '24px', fontWeight: 'bold', marginBottom: '40px', borderBottom: '1px solid #257d63', paddingBottom: '10px' },
  sidebarItem: { padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid #257d63', fontSize: '16px' },
  logoutBtn: { marginTop: 'auto', padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  mainContent: { flex: 1, padding: '30px' },
  header: { marginBottom: '30px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'center' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '5px' },
  addBtn: { padding: '12px 25px', backgroundColor: '#1a4d2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  tableHeader: { backgroundColor: '#f4f4f4', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee' },
  tableImg: { width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }
};

export default AdminDashboard;