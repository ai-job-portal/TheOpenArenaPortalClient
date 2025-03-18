// client/src/components/JobseekerRegister.js
import React, { useState } from 'react';
import './SubmitButton.css';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';

function JobseekerRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [registrationError, setRegistrationError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useUI();
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();

        setRegistrationError(null);
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/jobseeker/register`, { // Changed endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    username,
                    password,
                    mobile,
                    skills: '',  //  empty for now
                    resume_url: '' //  empty for now
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                showToast('Registration successful! You can now log in.', 'success');
                navigate('/login/jobseeker');  // Redirect to login after successful registration
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Registration failed';
                setRegistrationError(errorMessage);
                showToast(errorMessage, 'error');
                console.error('Registration failed:', errorData);
            }
        } catch (error) {
            setRegistrationError('An unexpected error occurred.');
            showToast('An unexpected error occurred.', 'error');
            console.error('Error during registration:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="form-container register-form">
            <h2>Register for free</h2>
            {registrationError && <div className="error-message">{registrationError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile Number <span className="required">*</span></label>
                    <input
                        type="text"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username <span className="required">*</span></label>
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
                    <button type="submit" disabled={loading} className='submit-button submit-button-jobseeker'>
                        {loading ? 'Registering...' : 'Register Now'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default JobseekerRegister;