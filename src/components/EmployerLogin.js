// client/src/components/EmployerLogin.js
import React, { useState } from 'react';
import { useEmployerAuth } from '../hooks/useEmployerAuth';

function EmployerLogin() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const { login } = useEmployerAuth();

    const handleSubmit = async (event) => {
      setFormLoading(true); // Start loading
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
          }finally {
            setFormLoading(false); // Stop loading
          }
    };  

    return (
      <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Employer Login</h2>
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
        <button type="submit" disabled={formLoading} className="submit-button submit-button-employer">
        {formLoading ? 'Logging in...' : 'Login'}
      </button>
      </form>
    </div>
  );
}

export default EmployerLogin;