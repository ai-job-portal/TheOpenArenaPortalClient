import React, { useState, useEffect } from 'react';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal'; // New import
import { useUI } from '../context/UIContext';
import './EmployerUserList.css';
import { Link } from 'react-router-dom';

function EmployerUserList() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [newInvitationCode, setNewInvitationCode] = useState('');
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const { isAuthenticated, employer } = useEmployerAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || employer.role !== 'admin') {
            navigate('/employer-dashboard');
            return;
        }
        fetchRecruiters();
    }, [isAuthenticated, employer, navigate]);

    const fetchRecruiters = async () => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch recruiters');
            const data = await response.json();
            setRecruiters(data);
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData) => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create recruiter');
            setRecruiters([...recruiters, {
                id: data.id,
                username: data.username,
                email: data.email,
                name: data.name || '-',
                mobile: data.mobile || '-',
                role: data.role
            }]);
            setNewInvitationCode(data.invitation_code); // Store the code
            setIsCreateOpen(false);
            setIsSuccessOpen(true); // Show success modal
            showToast('Recruiter created successfully!', 'success'); // Still show toast for confirmation
        } catch (err) {
            showToast(err.message, 'error');
        }
    };
    

    const handleEdit = async (formData) => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/users/${selectedRecruiter.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update recruiter');
            setRecruiters(recruiters.map(r => (r.id === data.id ? data : r)));
            setIsEditOpen(false);
            showToast('Recruiter updated successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleDelete = async (mode) => {
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/users/${selectedRecruiter.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mode }),
            });
            if (!response.ok) throw new Error('Failed to delete recruiter');
            setRecruiters(recruiters.filter(r => r.id !== selectedRecruiter.id));
            setIsDeleteOpen(false);
            showToast(`Recruiter ${mode} deleted successfully!`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="employer-user-list">
            <h2>Recruiter Management</h2>
            <div className="button-group">
                <button onClick={() => setIsCreateOpen(true)} className="create-button">Create Recruiter</button>
                <Link to="/employers/deleted-users" className="create-button deleted-recruiters-button">Deleted Recruiters</Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recruiters.map(recruiter => (
                        <tr key={recruiter.id}>
                            <td>{recruiter.id}</td>
                            <td>{recruiter.username}</td>
                            <td>{recruiter.email}</td>
                            <td>{recruiter.name}</td>
                            <td>{recruiter.role}</td>
                            <td>
                                <button onClick={() => { setSelectedRecruiter(recruiter); setIsEditOpen(true); }}>Edit</button>
                                <button onClick={() => { setSelectedRecruiter(recruiter); setIsDeleteOpen(true); }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isCreateOpen && (
                <RecruiterModal
                    onClose={() => setIsCreateOpen(false)}
                    onSubmit={handleCreate}
                    title="Create New Recruiter"
                />
            )}
            {isEditOpen && selectedRecruiter && (
                <RecruiterModal
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={handleEdit}
                    title="Edit Recruiter"
                    initialData={selectedRecruiter}
                />
            )}
            {isDeleteOpen && selectedRecruiter && (
                <DeleteConfirmationModal
                    isOpen={isDeleteOpen}
                    username={selectedRecruiter.username}
                    onTemporaryDelete={() => handleDelete('temporary')}
                    onPermanentDelete={() => handleDelete('permanent')}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message="Recruiter created successfully!"
                invitationCode={newInvitationCode}
            />
        </div>
    );
}

function RecruiterModal({ onClose, onSubmit, title, initialData = {} }) {
    const [formData, setFormData] = useState({
        username: initialData.username || '',
        email: initialData.email || '',
        password: initialData.password || '',
        name: initialData.name || '',
        mobile: initialData.mobile || '',
        role: initialData.role || 'recruiter'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content form-container"> {/* Add form-container */}
                <h3>{title}</h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Username <span className="required">*</span></label>
                        <input
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required={!initialData.username}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email <span className="required">*</span></label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required={!initialData.email}
                        />
                    </div>
                    {!initialData.username && (
                        <div className="form-group">
                            <label>Password <span className="required">*</span></label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mobile</label>
                        <input
                            name="mobile"
                            type="text"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Role <span className="required">*</span></label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="recruiter">Recruiter</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="confirm-button">Save</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteConfirmationModal({ isOpen, username, onTemporaryDelete, onPermanentDelete, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Are you sure you want to delete {username}?</p>
                <div className="modal-buttons">
                    <button onClick={onTemporaryDelete} className="temp-delete-button">Temporary Delete</button>
                    <button onClick={onPermanentDelete} className="perm-delete-button">Permanent Delete</button>
                    <button onClick={onCancel} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default EmployerUserList;