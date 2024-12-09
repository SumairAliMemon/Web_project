import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Direct API call to register endpoint
      await axios.post('http://localhost:5500/api/register', {
        name,
        email,
        password,
        role
      });
      
      // Redirect to login after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
        >
          <option value="customer">Customer</option>
          <option value="hostel_owner">Hostel Owner</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p className="switch-auth">
        Already have an account? <NavLink to="/login">Login here</NavLink>
      </p>
    </div>
  );
};

export default Register;