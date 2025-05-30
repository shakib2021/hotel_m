import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRestaurent from './CreateRestaurent';
import CreateDish from './CreateDish';
import Myresto from './Myresto'; // <-- import Myresto

export default function AdminDash() {
  const [view, setView] = useState('restaurant');
  const [myRestaurant, setMyRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get current user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }

  useEffect(() => {
    if (user && user.email) {
      fetch('https://apex.oracle.com/pls/apex/sakib_62/restaurents/get')
        .then(res => res.json())
        .then(data => {
          const found = (data.items || []).find(r => r.email === user.email);
          setMyRestaurant(found || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '32px 0 16px 0' }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
        <button
          className={`btn btn-outline-primary${view === 'restaurant' ? ' active' : ''}`}
          onClick={() => setView('restaurant')}
          disabled={!!myRestaurant}
        >
          Create Restaurant
        </button>
        <button
          className={`btn btn-outline-primary${view === 'dish' ? ' active' : ''}`}
          onClick={() => setView('dish')}
          disabled={!myRestaurant}
        >
          Create Dish
        </button>
        <button
          className={`btn btn-outline-info${view === 'myresto' ? ' active' : ''}`}
          onClick={() => setView('myresto')}
          disabled={!myRestaurant}
        >
          My Restaurant
        </button>
        <button
          className="btn btn-outline-success"
          onClick={() => navigate('/gotorder')}
        >
          View Orders
        </button>
      </div>
      {view === 'restaurant' && !myRestaurant && <CreateRestaurent />}
      {view === 'restaurant' && myRestaurant && (
        <div style={{ textAlign: 'center', color: '#888', marginBottom: 24 }}>
          You already have a restaurant registered with your email.<br />
          You can only create dishes for your restaurant.
        </div>
      )}
      {view === 'dish' && myRestaurant && <CreateDish restaurantId={myRestaurant.restaurant_id} />}
      {view === 'dish' && !myRestaurant && (
        <div style={{ textAlign: 'center', color: '#888', marginBottom: 24 }}>
          Please create your restaurant first to add dishes.
        </div>
      )}
      {view === 'myresto' && myRestaurant && (
        <Myresto restaurant={myRestaurant} />
      )}
      {view === 'myresto' && !myRestaurant && (
        <div style={{ textAlign: 'center', color: '#888', marginBottom: 24 }}>
          Please create your restaurant first to view details.
        </div>
      )}
    </div>
  );
}
