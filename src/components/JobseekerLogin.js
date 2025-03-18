// src/components/JobseekerLogin.js
import React, { useState } from 'react';
import { useJobseekerAuth } from '../hooks/useJobseekerAuth'; // Import

function JobseekerLogin() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setError] = useState('');
    const { login } = useJobseekerAuth(); // Use the hook

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
        //Your existing form UI code (no changes needed here)
         <div className="login-form-container login-form">
         <h2>Log into your account</h2>
         {loginError && <div className="error-message">{loginError}</div>}
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <label htmlFor="usernameOrEmail">Email address or username <span className="required">*</span></label>
               <input
                  type="text"
                  id="usernameOrEmail" // Changed ID
                  value={usernameOrEmail} // Changed value
                  onChange={(e) => setUsernameOrEmail(e.target.value)} // Changed setter
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
               <button type="submit" className="submit-button submit-button-jobseeker">Login</button>
            </div>
         </form>
      </div>
    );
}

export default JobseekerLogin;