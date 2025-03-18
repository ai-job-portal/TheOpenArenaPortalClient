// src/components/JarvisDashboard.js
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useJarvisAuth } from '../hooks/useJarvisAuth'; // Import the auth context
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import './JarvisDashboard.css';
import { useUI } from '../context/UIContext';

function JarvisDashboard() {
    const [jobCount, setJobCount] = useState(0);
    const [employerCount, setEmployerCount] = useState(0);
    const [recruiterCount, setRecruiterCount] = useState(0);
    const [jobseekerCount, setJobseekerCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useUI();

    const { authFetch, logout, isAuthenticated } = useJarvisAuth(); // Get authFetch and isAuthenticated
    const navigate = useNavigate();


    const fetchData = useCallback(async () => { // Wrap fetchData in useCallback
        setLoading(true);
        setError(null);
        try {
            const [jobResponse, employerResponse, recruiterResponse, jobseekerResponse] = await Promise.all([
                authFetch('/jarvis/jobs/count'), // Use relative URLs
                authFetch('/jarvis/employers/count'),
                authFetch('/jarvis/recruiters/count'),
                authFetch('/jarvis/jobseekers/count')
            ]);

            setJobCount(jobResponse.data.count);
            setEmployerCount(employerResponse.data.count);
            setRecruiterCount(recruiterResponse.data.count);
            setJobseekerCount(jobseekerResponse.data.count);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError(error.response?.data?.message || "Failed to load dashboard data. Please try again later."); // More robust error handling
            showToast(error.response?.data?.message || 'Failed to load dashboard data', 'error'); 
            if (error.response && error.response.status === 401) {
                // No need to check local storage; authFetch + server handle it
                navigate('/'); // Redirect to login on 401
            }
        } finally {
            setLoading(false);
        }
    }, [authFetch, showToast, navigate]);  // authFetch and navigate are dependencies

    useEffect(() => {
        if (!isAuthenticated) { // Check authentication status
            navigate('/jarvis/login');
            return;  // Important:  Stop execution if not authenticated
        }

        fetchData(); // Call fetchData *only* if authenticated

    }, [isAuthenticated, fetchData, navigate]); // Add isAuthenticated, fetchData, and navigate


    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return (
              <div className="error-message">
                  <p>Error: {error}</p>
                <p>You have been logged out. Please <Link to="/login">log in again</Link>.</p>
              </div>
          );
      }

    return (
        <div className="jarvis-dashboard-card">
            <h2>Jarvis Dashboard</h2>
             <button onClick={logout}>Logout</button>
            <div className="jarvis-stats">
                <div className="jarvis-stat-item">
                    <span className="jarvis-stat-label">Total Jobs</span>
                    <span className="jarvis-stat-value">{jobCount}</span>
                </div>
                <div className="jarvis-stat-item">
                    <span className="jarvis-stat-label">Total Employers</span>
                    <span className="jarvis-stat-value">{employerCount}</span>
                </div>
                <div className="jarvis-stat-item">
                    <span className="jarvis-stat-label">Total Recruiters</span>
                    <span className="jarvis-stat-value">{recruiterCount}</span>
                </div>
                <div className="jarvis-stat-item">
                    <span className="jarvis-stat-label">Total Jobseekers</span>
                    <span className="jarvis-stat-value">{jobseekerCount}</span>
                </div>
            </div>
        </div>
    );
}

export default JarvisDashboard;