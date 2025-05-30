import React, { useState } from 'react';

export default function CreateRestaurent() {
  // Get user email from localStorage
  let userEmail = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userEmail = user?.email || '';
  } catch (e) {}

  const [form, setForm] = useState({
    name: '',
    address: '',
    contact_number: '',
    email: userEmail,
    rating: '',
    capacity: '',
    opening_hours: '',
    cuisine_type: '',
    image_url: '' 
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/sakib_62/restaurent/post', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rating: parseFloat(form.rating),
          capacity: parseInt(form.capacity)
        })
      });
      if (res.ok) {
        setSuccess('Restaurant created successfully!');
        setForm({
          name: '',
          address: '',
          contact_number: '',
          email: userEmail,
          rating: '',
          capacity: '',
          opening_hours: '',
          cuisine_type: '',
          image_url: ''
        });
      } else {
        setError('Failed to create restaurant.');
      }
    } catch {
      setError('Failed to create restaurant.');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Create Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input name="address" className="form-control" value={form.address} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input name="contact_number" className="form-control" value={form.contact_number} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-control" value={form.email} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input name="rating" type="number" step="0.1" min="0" max="5" className="form-control" value={form.rating} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Capacity</label>
          <input name="capacity" type="number" min="1" className="form-control" value={form.capacity} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Opening Hours</label>
          <input name="opening_hours" className="form-control" value={form.opening_hours} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Cuisine Type</label>
          <input name="cuisine_type" className="form-control" value={form.cuisine_type} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            name="image_url"
            className="form-control"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Create Restaurant</button>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
