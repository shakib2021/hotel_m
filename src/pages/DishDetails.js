import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DishDetails.css';

export default function DishDetails() {
  const { dishId } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [rating, setRating] = useState(5);

  // Booking state
  const [bookingPeople, setBookingPeople] = useState(1);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Capacity state
  const [capacity, setCapacity] = useState(null);

  // Get user info from localStorage (adjust as needed)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const user_email = user.email || '';
  const user_name = user.name || '';

  // Fetch dish details
  useEffect(() => {
    fetch(`https://apex.oracle.com/pls/apex/sakib_62/dish/specificdish/${dishId}`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setDish(data);
        } else {
          setDish(null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dishId]);

  // Fetch reviews for this dish
  useEffect(() => {
    setReviewLoading(true);
    fetch(`https://apex.oracle.com/pls/apex/sakib_62/review/get/${dishId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.items || []);
        setReviewLoading(false);
      })
      .catch(() => setReviewLoading(false));
  }, [dishId, reviewSubmitting]);

  // Fetch restaurant capacity
  useEffect(() => {
    if (dish && dish.restaurant_id) {
      fetch(`https://apex.oracle.com/pls/apex/sakib_62/restaurents/get/${dish.restaurant_id}`)
        .then(res => res.json())
        .then(data => {
          // If  API returns an object directly with capacity
          if (data && data.capacity) {
            setCapacity(data.capacity);
          }
          // If  API returns { items: [ ... ] }
          else if (data && data.items && data.items[0] && data.items[0].capacity) {
            setCapacity(data.items[0].capacity);
          }
        });
    }
  }, [dish]);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);

    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/sakib_62/review/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user_email,
          name: user_name,
          restaurant_id: dish.restaurant_id,
          dish_id: parseInt(dishId),
          rating: parseFloat(rating),
          review_comment: reviewText
        })
      });
      // After a successful review POST, call the update API 
      if (res.ok) {
        setReviewText('');
        setRating(5);

        // Call the rating update API
        await fetch(`https://apex.oracle.com/pls/apex/sakib_62/dish/update/${dishId}`, {
          method: 'PUT'
        });

      } else {
        setReviewError('Failed to submit review.');
      }
    } catch {
      setReviewError('Failed to submit review.');
    }
    setReviewSubmitting(false);
  };

  // Booking handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSubmitting(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/sakib_62/users/bookings/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user_email,
          restaurant_id: dish.restaurant_id,
          dish_id: parseInt(dishId),
          num_guests: parseInt(bookingPeople),
          total_cost: totalCost
        })
      });
      // After successful booking
      if (res.ok) {
        setBookingSuccess(`Booked for ${bookingPeople} people!`);
        setBookingPeople(1);
        // Calculate new capacity
        const newCapacity = capacity - parseInt(bookingPeople);
        // Update restaurant capacity
        await fetch(`https://apex.oracle.com/pls/apex/sakib_62/restaurents/update/capacity/${dish.restaurant_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            new_capacity: newCapacity
          })
        });

      } else {
        setBookingError('Failed to book. Please try again.');
      }
    } catch {
      setBookingError('Failed to book. Please try again.');
    }
    setBookingSubmitting(false);
  };

  const totalCost = dish ? bookingPeople * dish.price : 0;

  if (loading) return <div>Loading...</div>;
  if (!dish) return <div>Dish not found</div>;

  return (
    <div className="dishdetails-container">
      {/* Reviews List Section - Left Side */}
      <div className="dishdetails-reviews">
        <div className="dishdetails-card">
          <h4>Reviews</h4>
          {reviewLoading ? (
            <div>Loading reviews...</div>
          ) : (
            <div>
              {reviews.length === 0 ? (
                <div>No reviews yet.</div>
              ) : (
                <ul className="dishdetails-review-list">
                  {reviews.map((r, i) => (
                    <li key={i} className="dishdetails-review-item">
                      <div>
                        <strong>{r.user_name || 'Anonymous'}</strong>
                        <span className="dishdetails-rating-star">★ {r.rating}</span>
                      </div>
                      <div>{r.review_comment}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dish Card & Review Submission  */}
      <div style={{ flex: '2 1 480px', minWidth: 0 }}>
        {/* Dish Card Section */}
        <div className="dishdetails-card">
          <h2>{dish.name}</h2>
          {dish.image_url && (
            <img
              src={dish.image_url}
              alt={dish.name}
              className="dishdetails-image"
            />
          )}
          <p><strong>Price:</strong> ${dish.price}</p>
          <p><strong>Category:</strong> {dish.category}</p>
          <p><strong>Available:</strong> {dish.availability === 'Y' ? 'Yes' : 'No'}</p>
          <p><strong>Description:</strong> {dish.description}</p>
          <p>
            <strong>Rating:</strong>{' '}
            {dish.rating !== null && dish.rating !== undefined ? (
              <span>⭐ {dish.rating}</span>
            ) : (
              <span>No rating</span>
            )}
          </p>
        </div>

        {/* Review Submission Section */}
        <div className="dishdetails-form">
          <form onSubmit={handleReviewSubmit}>
            <h4>Leave a Review</h4>
            <div className="mb-3">
              <label>Rating:</label>
              <input
                type="number"
                className="form-control dishdetails-booking-input"
                value={rating}
                min={1}
                max={5}
                step={0.5}
                onChange={e => setRating(e.target.value)}
                required
                disabled={reviewSubmitting}
              />
              <textarea
                className="form-control"
                placeholder="Write your review..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                required
                disabled={reviewSubmitting}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={reviewSubmitting || !reviewText.trim()}>
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            {reviewError && <div className="alert alert-danger mt-2">{reviewError}</div>}
          </form>
        </div>

        {/* Booking Section */}
        <div className="dishdetails-booking">
          <form onSubmit={handleBookingSubmit}>
            <h4>Book This Dish</h4>
            <div className="mb-3">
              <label>Number of People:</label>
              <input
                type="number"
                className="form-control dishdetails-booking-input"
                min={1}
                max={capacity || 20}
                value={bookingPeople}
                onChange={e => setBookingPeople(e.target.value)}
                required
                disabled={bookingSubmitting}
              />
              <div className="dishdetails-total-cost">
                <strong>Total Cost:</strong> ${totalCost}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>
                Max people allowed: {capacity || 20}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={bookingSubmitting}>
              {bookingSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
            {bookingError && <div className="alert alert-danger mt-2">{bookingError}</div>}
            {bookingSuccess && <div className="alert alert-success mt-2">{bookingSuccess}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
