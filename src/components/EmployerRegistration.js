// client/src/components/EmployerRegistration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubmitButton.css';
import { useUI } from '../context/UIContext';

function EmployerRegistration() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState(''); // Company email
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [location, setLocation] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState(''); // Admin's email
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useUI();

  const companySizeOptions = [
    { value: '', label: 'Select Company Size' },
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1001-5000', label: '1001-5000 employees' },
    { value: '5000+', label: '5000+ employees' },
  ];

  const industryOptions = [
    { value: '', label: 'Select Industry' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Media', label: 'Media' },
    { value: 'Telecommunications', label: 'Telecommunications' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Government', label: 'Government' },
    { value: 'Non-Profit', label: 'Non-Profit' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Hospitality', label: 'Hospitality' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Aerospace', label: 'Aerospace' },
    { value: 'Biotechnology', label: 'Biotechnology' },
    { value: 'Pharmaceuticals', label: 'Pharmaceuticals' },
    { value: 'Other', label: 'Other' },
  ];

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/employer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyName,
          email,
          website,
          description,
          industry,
          companySize: companySize,
          location,
          adminUsername: adminUsername,
          adminEmail: adminEmail,
          adminPassword: adminPassword,
          adminName: adminName,
          adminMobile: adminMobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Employer and admin registration successful:', data);
        showToast('Registration successful! Please log in.', 'success');
        navigate('/employers/login');
      } else {
        const errorMessage = data.message || 'Employer registration failed';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Employer registration failed:', data);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      showToast('An unexpected error occurred.', 'error');
      console.error('Error during employer registration:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="quote-container">
        <p className="quote">
          Elevate your workforce with top talent—join our portal to build a thriving, dynamic team!
        </p>
      </div>
      <div className="form-container register-form wide-form">
        <h2>Employer Registration</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="step-indicator">
          <span className={step === 1 ? 'active-step' : ''}>Step 1: Company Information</span>
          <span className={step === 2 ? 'active-step' : ''}>Step 2: Admin Information</span>
        </div>
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <h3>Company Information</h3>
            <p className="form-info-text">
              Provide details about your company to get started.
            </p>
            <div className="form-group">
              <label htmlFor="companyName">Company Name <span className="required">*</span></label>
              <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Company Email Address <span className="required">*</span></label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="website">Website <span className="required">*</span></label>
              <input type="url" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="industry">Industry <span className="required">*</span></label>
              <select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required>
                {industryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="companySize">Company Size <span className="required">*</span></label>
              <select id="companySize" value={companySize} onChange={(e) => setCompanySize(e.target.value)} required>
                {companySizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Location <span className="required">*</span></label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="form-group">
              <button type="submit" disabled={loading} className="submit-button submit-button-employer">
                {loading ? 'Next...' : 'Next'}
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h3>Admin Information</h3>
            <p className="form-info-text">
              You are registering as the administrator for this company. You will be able to invite additional recruiters to your company later.
            </p>
            <div className="form-group">
              <label htmlFor="adminUsername">Username <span className="required">*</span></label>
              <input type="text" id="adminUsername" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="adminEmail">Email <span className="required">*</span></label>
              <input type="email" id="adminEmail" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="adminPassword">Password <span className="required">*</span></label>
              <input type="password" id="adminPassword" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="adminName">Full Name</label>
              <input type="text" id="adminName" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="adminMobile">Mobile Number</label>
              <input type="tel" id="adminMobile" value={adminMobile} onChange={(e) => setAdminMobile(e.target.value)} />
            </div>
            <div className="form-group button-group">
              <button type="button" onClick={handleBack} className="submit-button submit-button-employer back-button">
                Back
              </button>
              <button type="submit" disabled={loading} className="submit-button submit-button-employer">
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmployerRegistration;