import React, { useState, useEffect } from 'react';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useNavigate } from 'react-router-dom';
import JobListItem from './JobListItem';
import ConfirmationModal from './ConfirmationModal';
import { useUI } from '../context/UIContext';
import './EmployerJobList.css';

function DeletedJobsList() {
    const [deletedJobs, setDeletedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPermDeleteOpen, setIsPermDeleteOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const { isAuthenticated, employer, logout } = useEmployerAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || employer?.role !== 'admin') {
            navigate('/employer-dashboard');
            return;
        }
        fetchDeletedJobs();
    }, [isAuthenticated, employer, navigate, logout]);

    const fetchDeletedJobs = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/jobs`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            const allJobs = [...data.my_posted_jobs, ...(data.recruiter_posted_jobs || [])];
            setDeletedJobs(allJobs.filter(job => !job.is_active));
        } catch (err) {
            setError(err.message);
            showToast('Failed to fetch deleted jobs', 'error');
        } finally {
            setLoading(false);
        }
    };
    const handlePermanentDelete = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs/${jobToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'permanent' }),
            });
            if (!response.ok) throw new Error('Failed to delete job');
            setDeletedJobs(prev => prev.filter(job => job.id !== jobToDelete));
            showToast('Job permanently deleted!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setIsPermDeleteOpen(false);
            setJobToDelete(null);
        }
    };

    if (loading) return <div>Loading deleted jobs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="employer-job-list">
            <h3>Deleted Jobs</h3>
            {deletedJobs.length === 0 ? (
                <p>No deleted jobs.</p>
            ) : (
                deletedJobs.map(job => (
                    <div key={job.id} className="job-item">
                        <JobListItem job={job} />
                        <button onClick={() => { setJobToDelete(job.id); setIsPermDeleteOpen(true); }} className="perm-delete-button">Permanent Delete</button>
                    </div>
                ))
            )}
            <ConfirmationModal
                isOpen={isPermDeleteOpen}
                message="Are you sure you want to permanently delete this job?"
                onConfirm={handlePermanentDelete}
                onCancel={() => setIsPermDeleteOpen(false)}
            />
        </div>
    );
}

export default DeletedJobsList;