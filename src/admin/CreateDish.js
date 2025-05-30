import React, { useState } from 'react';

export default function CreateDish({ restaurantId }) {
  const [form, setForm] = useState({
    restaurant_id: restaurantId || '',
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    availability: true // true for 'Y', false for 'N'
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/sakib_62/dish/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: parseInt(form.restaurant_id),
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          category: form.category,
          image_url: form.image_url,
          availability: form.availability ? 'Y' : 'N'
        })
      });

      if (res.ok) {
       
        setSuccess('Dish created successfully!');
        setForm({
          restaurant_id: restaurantId || '',
          name: '',
          description: '',
          price: '',
          category: '',
          image_url: '',
          availability: true
        });
      }
       else {
        setError('Failed to create dish.');
      }
    } catch {
      setError('Failed to create dish.');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Create Dish</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Restaurant ID</label>
          <input
            name="restaurant_id"
            type="number"
            className="form-control"
            value={form.restaurant_id}
            disabled
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input name="price" type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input name="image_url" className="form-control" value={form.image_url} onChange={handleChange} required />
        </div>
        <div className="mb-3 form-check">
          <input
            name="availability"
            type="checkbox"
            className="form-check-input"
            checked={form.availability}
            onChange={handleChange}
          />
          <label className="form-check-label">Available</label>
        </div>
        <button type="submit" className="btn btn-primary w-100">Create Dish</button>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}