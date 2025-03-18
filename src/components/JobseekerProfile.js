// src/components/JobseekerProfile.js

import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useNavigate, Link } from 'react-router-dom';
import { useJobseekerAuth } from '../hooks/useJobseekerAuth';
import { useUI } from '../context/UIContext';

function JobseekerProfile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authFetch, isAuthenticated, logout} = useJobseekerAuth();
    const navigate = useNavigate();
    const { showToast } = useUI();


    const fetchProfile = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
          const [response] = await Promise.all([authFetch('/jobseekers/profile')]); // Use relative URL
          setProfileData(response.data);
      } catch (error) {
          console.error('Profile fetch error:', error);
          setError(error.response?.data?.message || error.message || 'An unexpected error occurred.');
          showToast(error.response?.data?.message || 'Failed to fetch profile.', 'error');          
            if (error.response && error.response.status === 401) {
                navigate('/login/jobseeker');
            }

      } finally {
          setLoading(false);
      }
  }, [authFetch, showToast, navigate]); // authFetch, showToast, and navigate are dependencies


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login/jobseeker'); // Redirect if not authenticated
            return; // Very important:  Stop execution if not logged in
        }
            fetchProfile();
    }, [isAuthenticated, fetchProfile, navigate]); // Add fetchProfile

    // Wait for both authentication loading and local loading
    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
      return (
            <div>
                <p>Error: {error}</p>
              <p>You have been logged out. Please <Link to="/login">log in again</Link>.</p>
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
          <p>Resume URL: <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer">{profileData.resumeUrl}</a></p>
            <button className="logout-button" onClick={logout}>
                Log Out
            </button>
        </div>
    );
}

export default JobseekerProfile;