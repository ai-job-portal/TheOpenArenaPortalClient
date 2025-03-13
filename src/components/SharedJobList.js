import React, { useState, useEffect } from 'react';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useNavigate } from 'react-router-dom';
import JobListItem from './JobListItem';
import { useUI } from '../context/UIContext';
import './EmployerJobList.css';

function SharedJobList() {
    const [sharedJobs, setSharedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, logout } = useEmployerAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/employers/login');
            return;
        }
        fetchSharedJobs();
    }, [isAuthenticated, navigate, logout]);

    const fetchSharedJobs = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/shared-jobs`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch shared jobs');
            const data = await response.json();
            // Ensure uniqueness by job ID (though backend should handle this)
            const uniqueJobs = Array.from(new Map(data.map(job => [job.id, job])).values());
            setSharedJobs(uniqueJobs);
        } catch (err) {
            setError(err.message);
            showToast('Failed to fetch shared jobs', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading shared jobs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="employer-job-list">
            <h3>My Shared Jobs</h3>
            {sharedJobs.length === 0 ? (
                <p>No shared jobs available.</p>
            ) : (
                sharedJobs.map(job => (
                    <JobListItem key={job.id} job={job} /> // No delete option for shared jobs
                ))
            )}
        </div>
    );
}

export default SharedJobList;