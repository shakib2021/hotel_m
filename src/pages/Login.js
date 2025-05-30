import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleLogin = async (credentialResponse) => {
    const userObject = jwtDecode(credentialResponse.credential);

  // users nicchi
    const res = await fetch('https://apex.oracle.com/pls/apex/sakib_62/user/get');
    const usersData = await res.json();
    const users = usersData.items || [];

    // 2. jodi user thake (by email)
    const exists = users.some(u => u.email === userObject.email);

    if (!exists) {
      // 3. jodi user na thake tahole user ke create korbo
      await fetch('https://apex.oracle.com/pls/apex/sakib_62/user/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userObject.email,
          name: userObject.name,
          picture_url: userObject.picture,
          role: role
        })
      });
    }

    // 4. localStorage e user er information save kore rakhteci
    localStorage.setItem('user', JSON.stringify({
      email: userObject.email,
      name: userObject.name,
      picture_url: userObject.picture,
      role: role
    }));
    navigate(from, { replace: true });
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Hotel_M</h2>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ marginBottom: 16, padding: 6, borderRadius: 4, width: '100%' }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        <div className="login-hint">
          You need to login/register to continue.
        </div>
      </div>
    </div>
  );
}
