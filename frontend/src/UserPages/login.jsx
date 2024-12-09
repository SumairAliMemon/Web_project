import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Direct API call to login endpoint
      const response = await axios.post('http://localhost:5500/api/login', {
        email,
        password
      });

      // Destructure token and user from response
      const { token, user } = response.data;

      if (token) {
        // Store token and user info in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Decode token (using built-in method)
        const decodedToken = JSON.parse(window.atob(token.split('.')[1]));
        
        // Navigate based on role
        switch (decodedToken.role) {
          case 'customer':
            navigate('/customer-dashboard');
            break;
          case 'hostel_owner':
            navigate('/hostel-owner-dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="switch-auth">
        Don't have an account? <NavLink to="/signup">Create one</NavLink>
      </p>
    </div>
  );
};

export default Login;