import React, { useState, useEffect } from 'react';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/api/foods')
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend Food Data Received:", data);
        setFoods(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching foods:', err);
        setLoading(false);
      });
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
    setOrderPlaced(false);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const itemNames = cart.map((item) => item.food_name || item.name).join(', ');
    const totalAmount = calculateTotal();

    fetch('http://localhost:8081/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: user,
        items: itemNames,
        totalAmount: totalAmount
      })
    })
      .then((res) => res.json())
      .then(() => {
        setOrderPlaced(true);
        setCart([]);
      })
      .catch((err) => console.error('Error placing order:', err));
  };

  if (!user) {
    return <Login onLoginSuccess={(username) => setUser(username)} />;
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Welcome, {user}! 👋</h1>
        <button 
          onClick={() => setUser(null)} 
          style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Food Menu 🍔🍕</h2>
      
      {loading ? (
        <p>Loading food menu...</p>
      ) : foods.length === 0 ? (
        <p style={{ color: 'red' }}>No food items available or failed to load from backend.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {foods.map((food) => (
            <div key={food.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <img 
                src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                alt={food.food_name || food.name} 
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} 
              />
              <h3 style={{ margin: '10px 0 5px 0' }}>{food.food_name || food.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', minHeight: '40px' }}>{food.category || food.description}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#27ae60', margin: '10px 0' }}>₹{food.price}</p>
              <button 
                onClick={() => addToCart(food)} 
                style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Add to Cart 🛒
              </button>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: '40px 0' }} />

      <h2>Your Cart 🛒</h2>
      {cart.length === 0 ? (
        <p style={{ color: '#777' }}>Cart is empty. Add items from the menu above!</p>
      ) : (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {cart.map((item, index) => (
              <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.food_name || item.name}</span>
                <strong>₹{item.price}</strong>
              </li>
            ))}
          </ul>
          <h3 style={{ textAlign: 'right', marginTop: '15px', color: '#333' }}>Total Amount: ₹{calculateTotal()}</h3>
          <button 
            onClick={handleCheckout} 
            style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            Place Order & Save to MySQL 🚀
          </button>
        </div>
      )}

      {orderPlaced && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '5px', border: '1px solid #c3e6cb', fontWeight: 'bold', textAlign: 'center' }}>
          ✅ Order Placed Successfully and Saved in MySQL Database!
        </div>
      )}
    </div>
  );
}

export default App;