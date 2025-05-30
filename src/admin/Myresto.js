import React, { useEffect, useState } from 'react'
import './Myresto.css';

export default function Myresto({ restaurant }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (restaurant && restaurant.restaurant_id) {
      fetch(`https://apex.oracle.com/pls/apex/sakib_62/dish/get/${restaurant.restaurant_id}`)
        .then(res => res.json())
        .then(data => {
          setDishes(data.items || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [restaurant]);

  const handleDelete = async (dish_id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    setDeletingId(dish_id);
    try {
      await fetch(`https://apex.oracle.com/pls/apex/sakib_62/dish/delete/${dish_id}`, {
        method: 'DELETE'
      });
      setDishes(dishes.filter(d => d.dish_id !== dish_id));
    } catch {
      alert('Failed to delete dish.');
    }
    setDeletingId(null);
  };

  if (!restaurant) return null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>{restaurant.name}</h2>
      <div><strong>Cuisine:</strong> {restaurant.cuisine_type}</div>
      <div><strong>Rating:</strong> {restaurant.rating}</div>
      <div><strong>Capacity:</strong> {restaurant.capacity}</div>
      <div><strong>Hours:</strong> {restaurant.opening_hours}</div>
      <div><strong>Address:</strong> {restaurant.address}</div>
      <div><strong>Email:</strong> {restaurant.email}</div>
      <hr style={{ margin: '24px 0' }} />
      <h3 style={{ textAlign: 'center', marginBottom: 18 }}>Dishes</h3>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#888' }}>Loading dishes...</div>
      ) : dishes.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>No dishes found for this restaurant.</div>
      ) : (
        <div className="myresto-card-grid">
          {dishes.map(dish => (
            <div className="myresto-card" key={dish.dish_id}>
              <div className="myresto-card-header">
                <span className="myresto-dish-name">{dish.name}</span>
                <button
                  onClick={() => handleDelete(dish.dish_id)}
                  disabled={deletingId === dish.dish_id}
                  className="myresto-delete-btn"
                >
                  {deletingId === dish.dish_id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <div className="myresto-card-body">
                <div><strong>Price:</strong> ${dish.price}</div>
                <div><strong>Category:</strong> {dish.category}</div>
                <div><strong>Description:</strong> {dish.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
