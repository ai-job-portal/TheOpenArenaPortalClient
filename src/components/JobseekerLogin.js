// src/components/JobseekerLogin.js (also needs credentials: 'include')

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobseekerAuth } from '../hooks/useJobseekerAuth'; // Import
import './SubmitButton.css';

function JobseekerLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();
    const { login } = useJobseekerAuth(); // Use the hook
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError(null);
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // *** INCLUDE CREDENTIALS ***
            });

            if (response.ok) {
              const data = await response.json();
              login(data.accessToken); // Call login.
              navigate('/'); // Redirect after successful login
            } else {
                const errorData = await response.json(); // Get error details
                setLoginError(errorData.message || 'Login failed'); // Set error message
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError('An unexpected error occurred.');
        } finally {
           setLoading(false);
        }
    };

    return (
        //Your existing form UI code (no changes needed here)
         <div className="login-form-container login-form">
         <h2>Log into your account</h2>
         {loginError && <div className="error-message">{loginError}</div>}
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <label htmlFor="username">Email address or username <span className="required">*</span></label>
               <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  required
               />
            </div>
            <div className="form-group">
               <button type="submit" disabled={loading} className="submit-button submit-button-jobseeker">
                  {loading ? 'Logging In...' : 'LOG IN'}
               </button>
            </div>
         </form>
      </div>
    );
}

export default JobseekerLogin;