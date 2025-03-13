import React, { useState, useEffect } from 'react';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useNavigate } from 'react-router-dom';
import JobListItem from './JobListItem';
import ConfirmationModal from './ConfirmationModal';
import { useUI } from '../context/UIContext';
import { jwtDecode } from 'jwt-decode';
import './EmployerJobList.css';

function EmployerJobList() {
    const [myJobs, setMyJobs] = useState([]);
    const [recruiterJobs, setRecruiterJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [recruiters, setRecruiters] = useState([]);
    const { isAuthenticated, employer, logout } = useEmployerAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !employer) {
            navigate('/employers/login');
            return;
        }
        fetchJobs();
        fetchRecruiters();
    }, [isAuthenticated, employer, navigate, logout]);

    const fetchJobs = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/jobs`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);
            const data = await response.json();
            console.log('Fetched jobs:', data);
            setMyJobs(data.my_posted_jobs || []);
            if (employer?.role === 'admin') {
                setRecruiterJobs(data.recruiter_posted_jobs || []);
            }
        } catch (err) {
            console.error('Fetch jobs error:', err);
            setError(err.message);
            showToast('Failed to fetch jobs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecruiters = async () => {
        const token = localStorage.getItem('employerToken');
        const decoded = jwtDecode(token);
        const currentUserId = decoded.identity;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/users`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch recruiters');
            const data = await response.json();
            console.log('Fetched recruiters:', data);
            console.log('Current user ID from employer:', employer?.id);
            console.log('Current user ID from token:', currentUserId);

            const filteredRecruiters = data.filter(r => {
                const isCurrentUser = r.id === (employer?.id || currentUserId);
                console.log(`Recruiter ID: ${r.id}, Is current user: ${isCurrentUser}`);
                return !isCurrentUser;
            });
            setRecruiters(filteredRecruiters);
        } catch (err) {
            console.error('Fetch recruiters error:', err);
            setRecruiters([]);
            showToast('Unable to fetch recruiters', 'error');
        }
    };

    const handleDeleteTrigger = (jobId) => {
        setJobToDelete(jobId);
        setIsDeleteOpen(true);
    };

    const handleDelete = async (mode) => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs/${jobToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete job');
            if (mode === 'temporary') {
                setMyJobs(prev => prev.map(job => job.id === jobToDelete ? { ...job, is_active: false } : job));
                setRecruiterJobs(prev => prev.map(job => job.id === jobToDelete ? { ...job, is_active: false } : job));
            } else {
                setMyJobs(prev => prev.filter(job => job.id !== jobToDelete));
                setRecruiterJobs(prev => prev.filter(job => job.id !== jobToDelete));
            }
            showToast(data.message || 'Job deleted successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setIsDeleteOpen(false);
            setJobToDelete(null);
        }
    };

    const handleCheckboxChange = (jobId) => {
        setSelectedJobs(prev =>
            prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );
    };

    const handleShare = async (selectedRecruiterIds) => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/share-jobs`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_ids: selectedJobs, recruiter_ids: selectedRecruiterIds }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to share jobs');
            setSelectedJobs([]);
            setIsShareOpen(false);
            showToast(data.message, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const getAvailableRecruiters = () => {
        if (!employer) return [];
        if (employer.role === 'admin') {
            const postedByIds = recruiterJobs
                .filter(job => selectedJobs.includes(job.id))
                .map(job => job.posted_by)
                .filter(id => id && id !== employer.id);
            return recruiters.filter(r => r.id !== employer.id && !postedByIds.includes(r.id));
        }
        return recruiters; // Non-admin: already excludes self
    };

    const availableRecruiters = getAvailableRecruiters();
    const canShare = selectedJobs.length > 0 && availableRecruiters.length > 0;

    if (loading) return <div>Loading jobs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="employer-job-list">
            <h3>My Posted Jobs</h3>
            {selectedJobs.length > 0 && (
                canShare ? (
                    <button onClick={() => setIsShareOpen(true)} className="share-button">Share Selected Jobs</button>
                ) : (
                    <p className="no-recruiters-message">No recruiters available for sharing.</p>
                )
            )}
            {myJobs.length === 0 ? (
                <p>No jobs posted yet.</p>
            ) : (
                myJobs.map(job => (
                    <div key={job.id} className="job-item">
                        <input
                            type="checkbox"
                            checked={selectedJobs.includes(job.id)}
                            onChange={() => handleCheckboxChange(job.id)}
                        />
                        <JobListItem job={job} onDelete={handleDeleteTrigger} />
                    </div>
                ))
            )}

            {employer?.role === 'admin' && (
                <>
                    <h3>Recruiter Posted Jobs</h3>
                    {recruiterJobs.length === 0 ? (
                        <p>No jobs posted by recruiters.</p>
                    ) : (
                        recruiterJobs.map(job => (
                            <div key={job.id} className="job-item">
                                <input
                                    type="checkbox"
                                    checked={selectedJobs.includes(job.id)}
                                    onChange={() => handleCheckboxChange(job.id)}
                                />
                                <JobListItem job={job} onDelete={handleDeleteTrigger} />
                            </div>
                        ))
                    )}
                </>
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                jobId={jobToDelete}
                jobs={[...myJobs, ...recruiterJobs]}
                onTemporaryDelete={() => handleDelete('temporary')}
                onPermanentDelete={() => handleDelete('permanent')}
                onCancel={() => setIsDeleteOpen(false)}
            />
            {isShareOpen && (
                <ShareModal
                    recruiters={availableRecruiters}
                    onClose={() => setIsShareOpen(false)}
                    onShare={handleShare}
                />
            )}
        </div>
    );
}

function DeleteConfirmationModal({ isOpen, jobId, jobs, onTemporaryDelete, onPermanentDelete, onCancel }) {
    const [shareCount, setShareCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { showToast } = useUI();

    useEffect(() => {
        if (isOpen && jobId) {
            const fetchShareCount = async () => {
                const token = localStorage.getItem('employerToken');
                setLoading(true);
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs/${jobId}/shares`, {
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || 'Failed to fetch share count');
                    setShareCount(data.share_count);
                } catch (err) {
                    showToast(err.message, 'error');
                } finally {
                    setLoading(false);
                }
            };
            fetchShareCount();
        }
    }, [isOpen, jobId, showToast]);

    if (!isOpen || !jobId) return null;

    const job = jobs.find(j => j.id === jobId);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Are you sure you want to delete "{job?.title}"?</p>
                {loading ? (
                    <p>Loading share info...</p>
                ) : shareCount > 0 ? (
                    <p>This job is shared with {shareCount} recruiter(s).</p>
                ) : (
                    <p>This job is not shared with any recruiters.</p>
                )}
                <div className="modal-buttons">
                    <button onClick={onTemporaryDelete} className="temp-delete-button">Temporary Delete</button>
                    <button onClick={onPermanentDelete} className="perm-delete-button">Permanent Delete</button>
                    <button onClick={onCancel} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
}

function ShareModal({ recruiters, onClose, onShare }) {
    const [selectedRecruiters, setSelectedRecruiters] = useState([]);

    const handleCheckboxChange = (recruiterId) => {
        setSelectedRecruiters(prev =>
            prev.includes(recruiterId) ? prev.filter(id => id !== recruiterId) : [...prev, recruiterId]
        );
    };

    const handleSubmit = () => {
        if (selectedRecruiters.length === 0) {
            alert('Please select at least one recruiter.');
            return;
        }
        onShare(selectedRecruiters);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content form-container">
                <h3>Share Jobs</h3>
                {recruiters.map(recruiter => (
                    <div key={recruiter.id} className="form-group">
                        <input
                            type="checkbox"
                            id={`recruiter-${recruiter.id}`}
                            checked={selectedRecruiters.includes(recruiter.id)}
                            onChange={() => handleCheckboxChange(recruiter.id)}
                        />
                        <label htmlFor={`recruiter-${recruiter.id}`}>{recruiter.username}</label>
                    </div>
                ))}
                <div className="modal-buttons">
                    <button onClick={handleSubmit} className="confirm-button">Share</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default EmployerJobList;