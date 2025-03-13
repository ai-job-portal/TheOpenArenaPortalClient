// client/src/components/JobList.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUI } from "../context/UIContext";
import "./JobList.css";
import JobCard from "./JobCard";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Matches Dice's pageSize
  const [totalJobs, setTotalJobs] = useState(0);
  const { showToast } = useUI();
  const navigate = useNavigate();
  const locationHook = useLocation();
  const searchInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const [postedDate, setPostedDate] = useState("");
  const [employmentType, setEmploymentType] = useState({
    fulltime: false,
    parttime: false,
    contract: false,
    thirdparty: false,
  });
  const [experience, setExperience] = useState(0);
  const [salaryRange, setSalaryRange] = useState("");
  const [jobType, setJobType] = useState({
    permanent: false,
    contractual: false,
  });
  const [workMode, setWorkMode] = useState({
    remote: false,
    hybrid: false,
    onsite: false,
  });

  useEffect(() => {
    // Parse URL params on mount to sync with filters
    const params = new URLSearchParams(locationHook.search);
    setTitle(params.get("q") || "");
    setLocation(params.get("location") || "");
    setSkills(params.get("skills") || "");
    setPage(parseInt(params.get("page")) || 1);
    fetchJobsFromParams(params);
  }, [locationHook.search, pageSize]);

  const fetchJobsFromParams = async (params) => {
    setLoading(true);
    setError(null);

    let queryString = "?";
    if (params.get("q"))
      queryString += `title=${encodeURIComponent(params.get("q"))}&`;
    if (params.get("location"))
      queryString += `location=${encodeURIComponent(params.get("location"))}&`;
    if (params.get("skills"))
      queryString += `skills=${encodeURIComponent(params.get("skills"))}&`;
    queryString += `page=${params.get("page") || 1}&pageSize=${pageSize}`;
    queryString = queryString.replace(/&$/, ""); // Remove trailing &

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/jobs${queryString}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setJobs(data.jobs || data); // Adjust based on your API response structure
      setTotalJobs(data.total || jobs.length); // Assume API returns total
    } catch (error) {
      setError(error.message);
      console.error("Error fetching jobs:", error);
      showToast("Failed to fetch jobs.", "error");
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState({
    titleKeywordsSkills: "",
    location: "",
    experience: "Select Experience",
  });

  const handleChange = (field, value) => {
    setSearchQuery((prev) => ({ ...prev, [field]: value }));
  };

  // Generate experience options from 1 to 50 years
  const experienceOptions = Array.from({ length: 50 }, (_, i) => ({
    value: `${i + 1} year${i + 1 === 1 ? "" : "s"}`,
    label: `${i + 1} year${i + 1 === 1 ? "" : "s"}`,
  }));

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams({
      q: title,
      location,
      skills,
      page: "1",
      postedDate,
      employmentType: Object.keys(employmentType)
        .filter((key) => employmentType[key])
        .join(","),
      salaryRange,
      jobType: Object.keys(jobType)
        .filter((key) => jobType[key])
        .join(","), // Convert checked job types to comma-separated string
      experience: experience.toString(),
      workMode: Object.keys(workMode)
        .filter((key) => workMode[key])
        .join(","), // Convert checked work modes to comma-separated string
    });
    navigate(`?${params.toString()}`);
  };

  const handleEmploymentTypeChange = (type) => {
    setEmploymentType({ ...employmentType, [type]: !employmentType[type] });
  };

  const handleExperienceChange = (level) => {
    setExperience({ ...experience, [level]: !experience[level] });
  };

  const handleJobTypeChange = (type) => {
    setJobType({ ...jobType, [type]: !jobType[type] });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(locationHook.search);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  const handleWorkModeChange = (mode) => {
    setWorkMode({ ...workMode, [mode]: !workMode[mode] });
  };
  const totalPages = Math.ceil(totalJobs / pageSize);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  const getIconSize = (ref) => {
    if (ref.current) {
      return ref.current.offsetHeight;
    }
    return 24; // Default size if input is not rendered yet
  };

  const getRangeText = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalJobs);
    return `${start}-${end} of ${totalJobs} jobs`;
  };

  return (
    <div className="job-list-container">
      <div className="search-job-list-container-outer">
        <div className="search-job-list-container">
          <div className="search-bar-container-joblist">
            <form onSubmit={handleSearch} className="search-form-browsejobs">
              <div className="search-field-joblist">
                <svg
                  className="search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={getIconSize(searchInputRef)}
                  height={getIconSize(searchInputRef)}
                >
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Skills"
                  value={searchQuery.titleKeywordsSkills}
                  onChange={(e) =>
                    handleChange("titleKeywordsSkills", e.target.value)
                  }
                  className="search-input-joblist"
                />
              </div>
              <div className="search-field-joblist">
                <svg
                  className="location-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={getIconSize(locationInputRef)}
                  height={getIconSize(locationInputRef)}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Location"
                  value={searchQuery.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="search-input-joblist location"
                />
              </div>
              <div className="search-field-joblist">
                <select
                  value={searchQuery.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="search-field-select-joblist"
                >
                  <option value="Select Experience" disabled>
                    Select Experience
                  </option>
                  {experienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="search-button-joblist">
                Find Jobs
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="job-list-container-inner">
        <div className="job-list-content">
          {/* Filter Sidebar */}
            <div className="filter-sidebar">
              <h3>All Filters</h3>

              <div className="filter-group">
                <label className="filter-group-header">Posted Date:</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="radio"
                      value=""
                      checked={postedDate === ""}
                      onChange={() => setPostedDate("")}
                    />
                    &nbsp;&nbsp;Any Date
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="1"
                      checked={postedDate === "1"}
                      onChange={() => setPostedDate("1")}
                    />
                    &nbsp;&nbsp;Today
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="3"
                      checked={postedDate === "3"}
                      onChange={() => setPostedDate("3")}
                    />
                    &nbsp;&nbsp;Last 3 Days
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="7"
                      checked={postedDate === "7"}
                      onChange={() => setPostedDate("7")}
                    />
                    &nbsp;&nbsp;Last 7 Days
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-group-header">Salary Range:</label>
                <select
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="0-3">0-3 Lakhs</option>
                  <option value="3-6">3-6 Lakhs</option>
                  <option value="6-10">6-10 Lakhs</option>
                  <option value="10-15">10-15 Lakhs</option>
                  <option value="15-20">15-20 Lakhs</option>
                  <option value="20-25">20-25 Lakhs</option>
                  <option value="25-35">25-35 Lakhs</option>
                  <option value="35-1000">35+ Lakhs</option>
                  {/* Add more salary range options as needed */}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-group-header">Work Mode:</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={workMode.remote}
                      onChange={() => handleWorkModeChange("remote")}
                    />
                    &nbsp;&nbsp;Remote
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={workMode.hybrid}
                      onChange={() => handleWorkModeChange("hybrid")}
                    />
                    &nbsp;&nbsp;Hybrid
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={workMode.onsite}
                      onChange={() => handleWorkModeChange("onsite")}
                    />
                    &nbsp;&nbsp;On-site
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-group-header">Job Type:</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={jobType.permanent}
                      onChange={() => handleJobTypeChange("permanent")}
                    />
                    &nbsp;&nbsp;Permanent
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={jobType.contractual}
                      onChange={() => handleJobTypeChange("contractual")}
                    />
                    &nbsp;&nbsp;Contractual
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-group-header">Employment Type:</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={employmentType.fulltime}
                      onChange={() => handleEmploymentTypeChange("fulltime")}
                    />
                    &nbsp;&nbsp;Full-time
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={employmentType.parttime}
                      onChange={() => handleEmploymentTypeChange("parttime")}
                    />
                    &nbsp;&nbsp;Part-time
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={employmentType.contract}
                      onChange={() => handleEmploymentTypeChange("contract")}
                    />
                    &nbsp;&nbsp;Contract
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={employmentType.thirdparty}
                      onChange={() => handleEmploymentTypeChange("thirdparty")}
                    />
                    &nbsp;&nbsp;Third Party
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-group-header">Experience:</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={experience}
                  onChange={(e) => setExperience(parseInt(e.target.value))}
                />
                <span>
                  {experience} year{experience !== 1 ? "s" : ""}
                </span>
            </div>
          </div>

          {/* Job Listings */}
          <div className="job-listings">
            {jobs.length === 0 ? (
              <p>No jobs found.</p>
            ) : (
              <>
                <div
                  className="jobs-range-info"
                  style={{ marginBottom: "10px" }}
                >
                  Showing {getRangeText()}
                </div>
                <div style={{ display: "grid", gap: "20px" }}>
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      style={{ padding: "5px 10px", margin: "0 5px" }}
                    >
                      Previous
                    </button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      style={{ padding: "5px 10px", margin: "0 5px" }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobList;
