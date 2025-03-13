// client/src/components/JobListItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import './JobListItem.css';

function JobListItem({ job, onDelete }) { // Receive job and onDelete as props

    const handleDelete = () => {
        onDelete(job.id)
    }

    return (
        <div className="job-list-item">
            <h3>{job.title}</h3>
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
            <p><strong>Description:</strong> {job.description.length > 100 ? `${job.description.substring(0, 100)}... ` : job.description}
                {job.description.length > 100 && <Link to={`/jobs/${job.id}`}>Read More</Link>}
            </p>
            <div className="job-list-item-actions">
                <Link to={`/jobs/edit/${job.id}`} className="edit-button">Edit</Link>
                <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default JobListItem;