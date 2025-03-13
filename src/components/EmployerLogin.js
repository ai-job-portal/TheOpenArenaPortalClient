// client/src/components/EmployerLogin.js
import React, { useState, useEffect } from 'react'; // Added useEffect import
import { useNavigate } from 'react-router-dom';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import './SubmitButton.css';
import { useUI } from '../context/UIContext';

function EmployerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, employer } = useEmployerAuth(); // Ensure we get employer state
  const { showToast } = useUI();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/employer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token, email); // Update employer state with token and email
        localStorage.setItem('employerEmail', email); // Persist email in localStorage
        showToast('Login successful!', 'success');
        navigate('/employer-dashboard'); // Navigate after setting state
      } else {
        const errorMessage = data.message || 'Employer Login failed';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Debug: Check if employer state updates after login
  useEffect(() => {
    if (employer) {
      console.log('Employer authenticated:', employer);
    }
  }, [employer]);

  return (
    <div className="login-form-container login-form">
      <h2>Employer Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password <span className="required">*</span></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading} className="submit-button-employer submit-button">
            {loading ? 'Logging In...' : 'Employer Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployerLogin;