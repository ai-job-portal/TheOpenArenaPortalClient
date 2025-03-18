// src/components/JarvisLogin.js
import React, { useState } from 'react';
import { useJarvisAuth } from '../hooks/useJarvisAuth';
import './JarvisLogin.css'; // Import the CSS

const JarvisLogin = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useJarvisAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(usernameOrEmail, password);
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
               setError(err.response.data.message);
           } else {
             setError('Login failed. Please check your credentials.');
           }
    }
  };

  return (
    <div className="jarvis-login-container">
      <form className="jarvis-login-form" onSubmit={handleSubmit}>
        <h2>Jarvis Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email:</label>
          <input
            type="text"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            placeholder="Enter your username or email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default JarvisLogin;