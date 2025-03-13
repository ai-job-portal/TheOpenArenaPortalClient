// client/src/components/JobEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useUI } from '../context/UIContext'; // Import useUI

function JobEdit() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useEmployerAuth();
    const { showToast } = useUI(); // Use the hook

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/employers/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchJob = async () => {
            const token = localStorage.getItem('employerToken');

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Job not found");
                    } else if (response.status === 401) {
                        throw new Error("Unauthorized");
                    }
                    else {
                        throw new Error(`Failed to fetch job: ${response.status}`);
                    }
                }

                const data = await response.json();
                setTitle(data.title);
                setDescription(data.description);
                setSkills(data.skills);
                setLocation(data.location);
                setSalary(data.salary);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching job for editing:", error);
            } finally {
                setLoading(false);
            }
        };
       if(isAuthenticated){
        fetchJob();
       }

    }, [id, isAuthenticated]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        const token = localStorage.getItem('employerToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, skills, location, salary }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Job updated successfully:', data);
                showToast('Job updated successfully!', 'success'); // Success toast
                navigate('/employer-jobs');
            } else {
                const errorMessage = data.message || 'Job update failed';
                setError(errorMessage);
                showToast(errorMessage, 'error'); // Error toast
                console.error('Job update failed:', data);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            showToast('An unexpected error occurred.', 'error'); // Error toast
            console.error('Error updating job:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading job data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="form-container">
            <h2>Edit Job</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Job Title <span className="required">*</span></label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Job Description <span className="required">*</span></label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="skills">Skills (comma-separated) <span className="required">*</span></label>
                    <input
                        type="text"
                        id="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="salary">Salary</label>
                    <input
                        type="text"
                        id="salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Job'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default JobEdit;