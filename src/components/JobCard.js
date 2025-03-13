// client/src/components/JobCard.js
import React from "react";
import "./JobCard.css"; // Create this CSS file
import feather from "feather-icons";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  const handleApplyClick = (event) => {
    event.preventDefault(); // Prevent default link behavior
    // Add your apply logic here (e.g., open a modal, redirect to an external link)
    console.log("Apply clicked for job:", job.id);
  };

  const handleSaveClick = (event) => {
    event.preventDefault(); // Prevent default link behavior
    // Add your save logic here (e.g., send API request to save job)
    console.log('Save clicked for job:', job.id);
  };

  const handleFlagClick = (event) => {
    event.preventDefault(); // Prevent default link behavior
    // Add your flag logic here (e.g., send API request to flag job)
    console.log('Flag clicked for job:', job.id);
  };

  const skillsArray =
    typeof job.skills === "string" ? job.skills.split(",") : job.skills;
  const formatSalaryRange = (salaryRange) => {
    console.log(salaryRange);
    if (!salaryRange) {
      return "Not disclosed";
    }

    const [min, max] = salaryRange.replace(" INR", "").split("-").map(Number); // Split and convert to numbers

    const formatSalary = (salary) => {
      if (salary >= 10000000) {
        return `${(salary / 10000000).toFixed(1)} Cr`;
      } else if (salary >= 100000) {
        return `${(salary / 100000).toFixed(1)} Lakhs`;
      } else if (salary >= 1000) {
        return `${(salary / 1000).toFixed(1)} Thousands`;
      } else {
        return salary;
      }
    };

    return `${formatSalary(min)} - ${formatSalary(max)}`;
  };

  return (
    <Link to={`/jobs/${job.id}`} className="job-card-link">
      <div className="job-card">
        <div className="job-card-header">
          <div className="job-title-bookmark">
            <h3 className="job-title">{job.title}</h3>
            <span className="bookmark-icon">
              {/* Replace with bookmark icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-bookmark"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
          </div>
          <div className="company-logo">
            {/* Replace with actual logo if available */}
            <img src="color.png" alt="Company Logo" />
          </div>
        </div>
        <p className="company-name">{job.company_name}</p>
        <div className="job-details">
          <div className="detail-item">
            {/* Replace with briefcase icon */}
            <span
              dangerouslySetInnerHTML={{
                __html: feather.icons["feather"].toSvg(),
              }}
            />
            <span>{job.experience_level} years</span>
            {/* Replace with rupee icon (you'll need to find/import one) */}
            <span
              className="detail-item-icon-span"
              dangerouslySetInnerHTML={{
                __html: feather.icons["credit-card"].toSvg(),
              }}
            />
            <span>{formatSalaryRange(job.salary_range)}</span>{" "}
            {/* Use the formatSalary function */}
          </div>
          <div className="detail-item">
            {/* Replace with map-pin icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-map-pin"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{job.location}</span>
          </div>
        </div>
        <div className="job-badges">
          <button className="badge quick-apply" onClick={handleApplyClick}>Apply</button>
        </div>
        {skillsArray && skillsArray.length > 0 && (
          <div className="job-skills">
            {skillsArray.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill.trim()}
              </span> // Trim whitespace
            ))}
          </div>
        )}
        <p className="posted-date">Posted {job.post_date}</p>
        <div className="save-flag-icons">
          {" "}
          {/* New container for icons */}
          <span className="icon-button" onClick={handleSaveClick}>
            <span
              dangerouslySetInnerHTML={{
                __html: feather.icons["heart"].toSvg(),
              }}
            />
          </span>
          <span className="icon-button" onClick={handleFlagClick}> 
            <span
              dangerouslySetInnerHTML={{
                __html: feather.icons["flag"].toSvg(),
              }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default JobCard;
