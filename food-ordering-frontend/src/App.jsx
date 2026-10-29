import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://foodie-express-385k.onrender.com/api';

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ foodId: null, userName: '', rating: 5, comment: '' });
  const [newFood, setNewFood] = useState({ foodName: '', category: 'Main Course', price: '', location: 'Mumbai', imageUrl: '' });

  useEffect(() => {
    fetchFoods();
    fetchOrders();
  }, []);

  const fetchFoods = () => {
    axios.get(`${API_BASE_URL}/foods`)
      .then((res) => {
        setFoods(res.data || []);
        res.data.forEach(item => fetchReviews(item.id));
      })
      .catch((err) => console.error('Error fetching foods:', err));
  };

  const fetchOrders = () => {
    axios.get(`${API_BASE_URL}/orders`)
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error('Error fetching orders:', err));
  };

  const fetchReviews = (foodId) => {
    axios.get(`${API_BASE_URL}/reviews/${foodId}`)
      .then((res) => {
        setReviews(prev => ({ ...prev, [foodId]: res.data || [] }));
      })
      .catch((err) => console.error('Error fetching reviews:', err));
  };

  const addToCart = (item) => {
    const existing = cart.find((x) => x.id === item.id);
    if (existing) {
      setCart(cart.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

  const handlePaymentAndCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    
    const orderPayload = {
      customerName: "Guest Customer",
      totalAmount: cartTotal,
      paymentMethod: "Razorpay (Online Simulated)",
      items: cart.map(item => ({
        foodName: item.foodName,
        price: item.price,
        quantity: item.qty
      }))
    };

    axios.post(`${API_BASE_URL}/orders/place`, orderPayload)
      .then(() => {
        alert("🎉 Payment Successful via Razorpay Gateway!\nOrder placed successfully!");
        setCart([]);
        setIsPaymentModalOpen(false);
        setIsCartOpen(false);
        fetchOrders();
        setActiveTab('orders');
      })
      .catch((err) => alert("Failed to place order. " + err.message));
  };

  const handleReviewSubmit = (foodId, e) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return alert("Please fill name and comment!");
    
    const payload = {
      foodId: foodId,
      userName: newReview.userName,
      rating: Number(newReview.rating),
      comment: newReview.comment
    };

    axios.post(`${API_BASE_URL}/reviews`, payload)
      .then(() => {
        alert("Review added successfully!");
        setNewReview({ foodId: null, userName: '', rating: 5, comment: '' });
        fetchReviews(foodId);
      })
      .catch(() => alert("Error adding review"));
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.foodName || !newFood.price) return alert("Please fill all details!");
    axios.post(`${API_BASE_URL}/foods`, newFood)
      .then(() => {
        alert("Food item added successfully!");
        setNewFood({ foodName: '', category: 'Main Course', price: '', location: 'Mumbai', imageUrl: '' });
        fetchFoods();
      });
  };

  const handleDeleteFood = (id) => {
    if (window.confirm("Delete this food item?")) {
      axios.delete(`${API_BASE_URL}/foods/${id}`)
        .then(() => fetchFoods());
    }
  };

  const handleStatusUpdate = (orderId, status) => {
    axios.put(`${API_BASE_URL}/orders/${orderId}/status?status=${status}`)
      .then(() => fetchOrders());
  };

  const filteredFoods = foods
    .filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = (item.foodName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'lowToHigh') return a.price - b.price;
      if (sortOption === 'highToLow') return b.price - a.price;
      return 0;
    });

  const getFoodImage = (item) => {
    if (item.imageUrl && item.imageUrl.trim() !== '') return item.imageUrl;
    const name = (item.foodName || '').toLowerCase();
    if (name.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500';
    if (name.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
    if (name.includes('dosa')) return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500';
    if (name.includes('pasta')) return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500';
    if (name.includes('biryani') || name.includes('rice')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500';
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
  };

  return (
    <div className="swiggy-app">
      <header className="swiggy-navbar">
        <div className="nav-container">
          <div className="brand-section">
            <span className="swiggy-logo" onClick={() => setActiveTab('home')}>FoodieExpress</span>
            <span className="location-pill">📍 Mumbai, Maharashtra</span>
          </div>
          <nav className="nav-menu">
            <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
            <button className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu</button>
            <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>My Orders</button>
            <button className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Admin Panel</button>
            <button className="cart-btn-orange" onClick={() => setIsCartOpen(true)}>🛒 Cart ({cart.reduce((a,b)=>a+b.qty,0)})</button>
          </nav>
        </div>
      </header>

      {activeTab === 'home' && (
        <section className="swiggy-hero">
          <div className="hero-content">
            <h1>Order Food Online From Your Favourite Restaurants</h1>
            <p>Delicious Indian dishes delivered fast to your door!</p>
            <button className="explore-btn" onClick={() => setActiveTab('menu')}>Explore Full Menu</button>
          </div>
        </section>
      )}

      <main className="main-wrapper">
        {(activeTab === 'home' || activeTab === 'menu') && (
          <>
            <div className="filter-bar">
              <input 
                type="text" 
                placeholder="Search food items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
              <select onChange={(e) => setSelectedCategory(e.target.value)} className="select-dropdown">
                <option value="All">All Categories</option>
                <option value="Main Course">Main Course</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Breads">Breads</option>
                <option value="Desserts">Desserts</option>
              </select>
              <select onChange={(e) => setSortOption(e.target.value)} className="select-dropdown">
                <option value="default">Sort by Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>

            <div className="swiggy-grid">
              {filteredFoods.map(item => (
                <div key={item.id} className="swiggy-card">
                  <div className="card-img-container">
                    <img src={getFoodImage(item)} alt={item.foodName} />
                    <span className="offer-tag">50% OFF UPTO ₹100</span>
                  </div>
                  <div className="card-info">
                    <h3>{item.foodName}</h3>
                    <p className="cat-text">{item.category} 📍 {item.location || 'Local'}</p>
                    <div className="card-footer-row">
                      <span className="price-tag">₹{item.price}</span>
                      <button className="swiggy-add-btn" onClick={() => addToCart(item)}>ADD +</button>
                    </div>

                    <div className="reviews-box" style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                      <h4 style={{fontSize: '0.9rem', marginBottom: '6px'}}>Customer Reviews:</h4>
                      <div className="review-list" style={{maxHeight: '80px', overflowY: 'auto', fontSize: '0.8rem', marginBottom: '8px'}}>
                        {reviews[item.id] && reviews[item.id].length > 0 ? (
                          reviews[item.id].map((rev, idx) => (
                            <p key={idx}><b>{rev.userName}</b> ({rev.rating}⭐): {rev.comment}</p>
                          ))
                        ) : <p style={{color: '#888'}}>No reviews yet.</p>}
                      </div>
                      
                      <form onSubmit={(e) => handleReviewSubmit(item.id, e)} style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          value={newReview.foodId === item.id ? newReview.userName : ''} 
                          onChange={(e) => setNewReview({...newReview, foodId: item.id, userName: e.target.value})} 
                          style={{padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc'}}
                        />
                        <div style={{display: 'flex', gap: '4px'}}>
                          <select 
                            value={newReview.foodId === item.id ? newReview.rating : 5} 
                            onChange={(e) => setNewReview({...newReview, foodId: item.id, rating: e.target.value})}
                            style={{padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc'}}
                          >
                            <option value="5">5 ⭐</option>
                            <option value="4">4 ⭐</option>
                            <option value="3">3 ⭐</option>
                            <option value="2">2 ⭐</option>
                            <option value="1">1 ⭐</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Add review..." 
                            value={newReview.foodId === item.id ? newReview.comment : ''} 
                            onChange={(e) => setNewReview({...newReview, foodId: item.id, comment: e.target.value})} 
                            style={{padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1}}
                          />
                          <button type="submit" style={{background: '#fc8019', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'}}>Post</button>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <section className="orders-section">
            <h2>Your Order History & Invoices</h2>
            {orders.length === 0 ? <p>No orders placed yet!</p> : (
              orders.map(order => (
                <div key={order.id} className="order-history-card">
                  <div className="order-header">
                    <h3>Order #{order.id}</h3>
                    <span className="order-date">{new Date(order.orderDate).toLocaleString()}</span>
                    <span className="status-badge">{order.status}</span>
                  </div>
                  
                  <div className="tracking-stepper">
                    <div className={`step ${['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'active' : ''}`}>Placed</div>
                    <div className={`step ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'active' : ''}`}>Preparing</div>
                    <div className={`step ${['Out for Delivery', 'Delivered'].includes(order.status) ? 'active' : ''}`}>Out for Delivery</div>
                    <div className={`step ${order.status === 'Delivered' ? 'active' : ''}`}>Delivered</div>
                  </div>

                  <div className="order-items-list">
                    {order.items?.map((it, idx) => (
                      <p key={idx}>{it.foodName} x {it.quantity} - ₹{it.price * it.quantity}</p>
                    ))}
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px'}}>
                    <h4 className="total-text">Total Paid: ₹{order.totalAmount} ({order.paymentMethod})</h4>
                    <button 
                      onClick={() => window.open(`${API_BASE_URL}/orders/${order.id}/invoice`)}
                      style={{ background: '#fc8019', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      📄 Download Invoice
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === 'admin' && (
          <section className="admin-section">
            <h2>Admin Dashboard - Food & Order Management</h2>
            
            <form onSubmit={handleAddFood} className="admin-form">
              <h3>Add New Dish to Menu</h3>
              <input type="text" placeholder="Food Name" value={newFood.foodName} onChange={e=>setNewFood({...newFood, foodName: e.target.value})} required />
              <input type="number" placeholder="Price (₹)" value={newFood.price} onChange={e=>setNewFood({...newFood, price: e.target.value})} required />
              <input type="text" placeholder="Image URL (e.g. Unsplash link)" value={newFood.imageUrl} onChange={e=>setNewFood({...newFood, imageUrl: e.target.value})} />
              <select value={newFood.category} onChange={e=>setNewFood({...newFood, category: e.target.value})}>
                <option value="Main Course">Main Course</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Breads">Breads</option>
                <option value="Desserts">Desserts</option>
              </select>
              <button type="submit" className="add-dish-btn">Add Dish</button>
            </form>

            <h3>Manage Food Items</h3>
            <div className="admin-table">
              {foods.map(item => (
                <div key={item.id} className="admin-item-row">
                  <span><b>{item.foodName}</b> (₹{item.price}) - {item.category}</span>
                  <button onClick={() => handleDeleteFood(item.id)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>

<h3 style={{marginTop: '30px'}}>Update Live Order Status</h3>
            {orders.map(o => (
              <div key={o.id} className="admin-order-row">
                <span>Order #{o.id} - Current Status: <b>{o.status}</b></span>
                <select onChange={(e) => handleStatusUpdate(o.id, e.target.value)} defaultValue={o.status}>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))}
          </section>
        )}
      </main>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={e=>e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Your Order Cart</h2>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="drawer-body">
              {cart.length === 0 ? <p>Your cart is empty!</p> : (
                cart.map(item => (
                  <div key={item.id} className="drawer-item">
                    <div><h4>{item.foodName}</h4><p>₹{item.price}</p></div>
                    <div className="qty-controls">
                      <button onClick={() => updateQty(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="drawer-footer">
                <h3>Total: ₹{cartTotal}</h3>
                <button className="checkout-btn-orange" onClick={() => setIsPaymentModalOpen(true)}>PROCEED TO PAY (₹{cartTotal})</button>
              </div>
            )}
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h3>💳 Razorpay Payment Gateway</h3>
            <p>Amount to Pay: <b>₹{cartTotal}</b></p>
            <div className="payment-options">
              <label><input type="radio" defaultChecked name="pay" /> UPI / Google Pay / PhonePe</label>
              <label><input type="radio" name="pay" /> Credit / Debit Card</label>
              <label><input type="radio" name="pay" /> Net Banking</label>
            </div>
            <div className="modal-actions">
              <button className="pay-now-btn" onClick={handlePaymentAndCheckout}>Pay ₹{cartTotal}</button>
              <button className="cancel-btn" onClick={() => setIsPaymentModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;