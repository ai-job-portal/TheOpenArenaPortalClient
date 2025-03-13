import React, { useState, useEffect } from 'react';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

function EmployerProfile() {
    const { isAuthenticated, employer, logout } = useEmployerAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { showToast } = useUI();

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('employerToken');

            if (!token) {
                setError('Not logged in');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/my-profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                } else if (response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    logout();
                    navigate('/employers/login');
                } else {
                    setError('Failed to fetch profile');
                    showToast('Failed to fetch profile', 'error');
                }
            } catch (err) {
                setError('An error occurred while fetching the profile.');
                showToast('An error occurred while fetching the profile.', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfileData();
        } else {
            navigate('/employers/login');
        }
    }, [isAuthenticated, logout, navigate, showToast]);

    if (loading) {
        return <div>Loading employer profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profileData) {
        return <div>No employer profile data found.</div>;
    }

    const isAdmin = employer?.role === 'admin'; // Check if current user is admin

    return (
        <div className="profile-container">
            <h2>Employer Profile</h2>
            <h3>Company Details</h3>
            <p><strong>Company Name:</strong> {profileData.company_name}</p>
            {isAdmin && ( // Only show full details to admins
                <>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Website:</strong> {profileData.website || 'Not provided'}</p>
                    <p><strong>Description:</strong> {profileData.description || 'Not provided'}</p>
                    <p><strong>Industry:</strong> {profileData.industry}</p>
                    <p><strong>Company Size:</strong> {profileData.company_size}</p>
                    <p><strong>Location:</strong> {profileData.location}</p>
                </>
            )}
            <h3>Recruiter Details</h3>
            <p><strong>Username:</strong> {profileData.recruiter.username}</p>
            <p><strong>Email:</strong> {profileData.recruiter.email}</p>
            <p><strong>Name:</strong> {profileData.recruiter.name || 'Not provided'}</p>
            <p><strong>Mobile:</strong> {profileData.recruiter.mobile || 'Not provided'}</p>
            <p><strong>Role:</strong> {profileData.recruiter.role.charAt(0).toUpperCase() + profileData.recruiter.role.slice(1)}</p>
        </div>
    );
}

export default EmployerProfile;