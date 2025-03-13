import React, { useState, useEffect } from 'react';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useNavigate,Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import { useUI } from '../context/UIContext';
import './DeletedRecruiterList.css';

function DeletedRecruiterList() {
    const [deletedRecruiters, setDeletedRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isRestoreOpen, setIsRestoreOpen] = useState(false); // New state for restore confirmation
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const { isAuthenticated, employer } = useEmployerAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || employer.role !== 'admin') {
            navigate('/employer-dashboard');
            return;
        }
        fetchDeletedRecruiters();
    }, [isAuthenticated, employer, navigate]);

    const fetchDeletedRecruiters = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/deleted-users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch deleted recruiters');
            const data = await response.json();
            setDeletedRecruiters(data);
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePermanentDelete = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/deleted-users/${selectedRecruiter.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to permanently delete recruiter');
            setDeletedRecruiters(deletedRecruiters.filter(r => r.id !== selectedRecruiter.id));
            setIsDeleteOpen(false);
            showToast('Recruiter permanently deleted!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleRestore = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/deleted-users/${selectedRecruiter.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to restore recruiter');
            }
            setDeletedRecruiters(deletedRecruiters.filter(r => r.id !== selectedRecruiter.id));
            setIsRestoreOpen(false);
            showToast('Recruiter restored successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="deleted-recruiter-list">
            <h2>Deleted Recruiters</h2>
            <div className="button-group">
                <Link to="/employers/users" className="back-button">Back to Recruiter Management</Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Deleted At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {deletedRecruiters.map(recruiter => (
                        <tr key={recruiter.id}>
                            <td>{recruiter.id}</td>
                            <td>{recruiter.username}</td>
                            <td>{recruiter.email}</td>
                            <td>{recruiter.name || '-'}</td>
                            <td>{recruiter.role}</td>
                            <td>{new Date(recruiter.deleted_at).toLocaleString()}</td>
                            <td>
                                <div className="action-buttons">
                                    <button onClick={() => { setSelectedRecruiter(recruiter); setIsRestoreOpen(true); }} className="restore-button">Restore</button>
                                    <button onClick={() => { setSelectedRecruiter(recruiter); setIsDeleteOpen(true); }} className="perm-delete-button">Permanent Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ConfirmationModal
                isOpen={isDeleteOpen}
                message={`Are you sure you want to permanently delete ${selectedRecruiter?.username}?`}
                onConfirm={handlePermanentDelete}
                onCancel={() => setIsDeleteOpen(false)}
            />
            <ConfirmationModal
                isOpen={isRestoreOpen}
                message={`Are you sure you want to restore ${selectedRecruiter?.username}?`}
                onConfirm={handleRestore}
                onCancel={() => setIsRestoreOpen(false)}
            />
        </div>
    );
}

export default DeletedRecruiterList;