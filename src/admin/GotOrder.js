import React, { useEffect, useState } from 'react';
import './GotOrder.css';

export default function GotOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Get owner info from localStorage 
  const owner = JSON.parse(localStorage.getItem('user') || '{}');
  const ownerEmail = owner.email;

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [ownerEmail]);

  const fetchOrders = () => {
    fetch(`https://apex.oracle.com/pls/apex/sakib_62/users/gotorder/${ownerEmail}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await fetch(`https://apex.oracle.com/pls/apex/sakib_62/users/update/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_status: newStatus })
      });
      fetchOrders();
    } catch {
     
    }
    setUpdatingId(null);
  };

  return (
    <div className="gotorder-container">
      <h2 style={{ textAlign: 'center', marginBottom: 32, letterSpacing: 2 }}>All Orders Received</h2>
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
                  <div><strong>Customer:</strong> {order.email}</div>
                  <div><strong>Guests:</strong> {order.num_guests}</div>
                  <div><strong>Date:</strong> {order.booking_date}</div>
                  <div><strong>Total Cost:</strong> <span style={{ color: '#28a745', fontWeight: 600 }}>${order.total_cost}</span></div>
                </div>
                <div className="gotorder-card-footer">
                  <label style={{ marginRight: 8, fontWeight: 500 }}>Change Status:</label>
                  <select
                    value={order.status}
                    disabled={updatingId === order.booking_id}
                    onChange={e => handleStatusChange(order.booking_id, e.target.value)}
                    className="gotorder-status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
