import React, { useEffect, useState } from 'react';
import './Myorder.css';

export default function Myorder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Placeholder for user photo
  const userPhoto = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User');

  // Fetch orders for this user
  useEffect(() => {
    if (user.email) {
      fetch(`https://apex.oracle.com/pls/apex/sakib_62/users/get/bookings/${user.email}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data.items || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user.email]);

  return (
    <div className="gotorder-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <img src={userPhoto} alt="User" style={{ width: 64, height: 64, borderRadius: '50%', marginRight: 24 }} />
        <div>
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
        </div>
      </div>
      <h3 style={{ textAlign: 'center', marginBottom: 32, letterSpacing: 2 }}>My Orders</h3>
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="gotorder-grid">
          {orders.length === 0 ? (
            <div className="gotorder-empty">No orders found.</div>
          ) : (
            orders.map((order, idx) => (
              <div key={idx} className={`gotorder-card gotorder-status-${order.status}`}>
                <div className="gotorder-card-header">
                  <span className="gotorder-dish">{order.dish_name}</span>
                  <span className={`gotorder-status-badge gotorder-status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="gotorder-card-body">
                  <div><strong>Restaurant:</strong> {order.restaurant_name}</div>
                  <div><strong>Guests:</strong> {order.num_guests}</div>
                  <div><strong>Date:</strong> {order.booking_date}</div>
                  <div><strong>Total Cost:</strong> <span style={{ color: '#28a745', fontWeight: 600 }}>${order.total_cost}</span></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
