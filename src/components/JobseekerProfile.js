// client/src/components/JobseekerProfile.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJobseekerAuth } from '../hooks/useJobseekerAuth';
import { useUI } from '../context/UIContext';

function JobseekerProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true); // Local loading state
  const [error, setError] = useState(null);
  const { authFetch, isAuthenticated, logout, loading: authLoading } = useJobseekerAuth(); // Get authLoading
  const navigate = useNavigate();
  const { showToast } = useUI();

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            setLoading(true); // Set loading to true at the start
            setError(null);
            const response = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/jobseekers/profile`);

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
            } else if (response.status === 401) {
              logout();
              showToast('Session expired. Please log in again.', 'info');
              return; // Stop execution
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to fetch profile.';
                setError(errorMessage);
                showToast(errorMessage, 'error');
                console.error('Profile fetch failed:', response.status, response.statusText, errorData);
            }
        } catch (error) {
            setError(error.message || 'An unexpected error occurred.');
            showToast(error.message || 'An unexpected error occurred.', 'error');
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

     if (isAuthenticated) { // Only fetch if authenticated
        fetchProfile();
    }

  }, [authFetch, navigate, showToast, isAuthenticated, logout]); // Correct dependencies

  const handleLogout = () => {
    logout();
    navigate('/login/jobseeker');
  };


  // Wait for both auth loading *and* local loading to finish
  if (authLoading || loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
      return (
          <div>
              <p>Error: {error}</p>
              <p>You have been logged out. Please <Link to="/login">login again</Link>.</p>
          </div>
      );
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Username: {profileData.username}</p>
      <p>Email: {profileData.email}</p>
      <p>Name: {profileData.name}</p>
      <p>Mobile: {profileData.mobile}</p>
      <p>Skills: {profileData.skills}</p>
      <p>Resume URL: {profileData.resumeUrl}</p>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default JobseekerProfile;