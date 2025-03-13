// client/src/components/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './JobDetail.css';

function JobDetail({ employerIsAuthenticated }) { // Receive the prop
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Job not found');
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }

                const data = await response.json();
                setJob(data);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return <div>Loading job details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!job) {
        return <div>Job not found.</div>;
    }

    return (
        <div className="job-detail-container">
            <h2>{job.title}</h2>
            <p><strong>Company:</strong> {job.company_name}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Skills:</strong> {job.skills}</p>
            <p><strong>Salary Range:</strong> {job.salary_range}</p>
            <p><strong>Experience Level:</strong> {job.experience_level}</p>
            <p><strong>Workplace Type:</strong> {job.workplace_type}</p>
            <p><strong>Employment Type:</strong> {job.employment_type}</p>
            <p><strong>Educational Qualifications:</strong> {job.educational_qualifications}</p>
            <p><strong>About Company:</strong> {job.about_company}</p>
            <p><strong>Post Date:</strong> {job.post_date}</p>
            <p><strong>Total Openings:</strong> {job.total_openings}</p>
            <p><strong>Description:</strong> {job.description}</p>

            {/* Conditionally render the "Back" button */}
            <Link to={employerIsAuthenticated ? "/employer-dashboard" : "/jobs"}>
                Back to {employerIsAuthenticated ? "My Posted Jobs" : "Job List"}
            </Link>
        </div>
    );
}

export default JobDetail;