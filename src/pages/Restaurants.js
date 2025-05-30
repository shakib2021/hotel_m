import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Restaurants.css';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('high'); // 'high' or 'low'

 
  useEffect(() => {
    setLoading(true);
    let apiUrl =
      sortOrder === 'high'
        ? 'https://apex.oracle.com/pls/apex/sakib_62/restaurent/highrating'
        : 'https://apex.oracle.com/pls/apex/sakib_62/restaurent/lowrating';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setRestaurants(data.items);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [sortOrder]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <img src="https://i.gifer.com/ZJFD.gif" alt="Loading..." width="80" />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="fancy-sort-bar">
        <span className="fancy-sort-label">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight: 8, verticalAlign: 'middle'}}>
            <path d="M3 18h6M3 6h18M3 12h12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sort:
        </span>
        <select
          id="ratingSort"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="fancy-sort-select"
        >
          <option value="high">High to Low</option>
          <option value="low">Low to High</option>
        </select>
      </div>
      <div className="card-container">
        {restaurants.map((restaurant) => (
          <div className="card" key={restaurant.restaurant_id}>
            <div className="card-body">
              {/* Restaurant Image */}
              {restaurant.image_url && (
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/320x160?text=No+Image'; }}
                />
              )}
              <div>
                <div className="card-title">{restaurant.name}</div>
                <div className="card-info-row">
                  <span className="card-info-label">Cuisine:</span>
                  <span className="card-info-value">{restaurant.cuisine_type}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Rating:</span>
                  <span className="card-info-value">⭐ {restaurant.rating}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Capacity:</span>
                  <span className="card-info-value">{restaurant.capacity}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Hours:</span>
                  <span className="card-info-value">{restaurant.opening_hours}</span>
                </div>
                {/* Subtle info box for address only */}
                <div className="card-subtle-info">
                  <div><strong>Address:</strong> {restaurant.address}</div>
                </div>
              </div>
              <Link to={`/restaurant/${restaurant.restaurant_id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
