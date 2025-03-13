// Header.jsx
import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJobseekerAuth } from "../hooks/useJobseekerAuth";
import { useEmployerAuth } from "../hooks/useEmployerAuth";
import "./Header.css";
import { useUI } from "../context/UIContext";

function Header() {
  const { isAuthenticated: jobseekerIsAuthenticated, logout: jobseekerLogout } =
    useJobseekerAuth();
  const {
    isAuthenticated: employerIsAuthenticated,
    logout: employerLogout,
    employer,
  } = useEmployerAuth();
  const navigate = useNavigate();

  const jobseekerDropdownRef = useRef(null);
  const employerDropdownRef = useRef(null);
  const employerAccountDropdownRef = useRef(null);
  const dashboardDropdownRef = useRef(null);
  const jobsAppsDropdownRef = useRef(null);
  const candidatesDropdownRef = useRef(null);
  const reportsDropdownRef = useRef(null);
  const recruiterMgmtDropdownRef = useRef(null);

  const { showToast } = useUI();

  const handleJobseekerLogout = () => {
    jobseekerLogout();
    showToast("You have been logged out.", "info");
    navigate("/login/jobseeker");
  };

  const handleEmployerLogout = () => {
    employerLogout();
    showToast("You have been logged out.", "info");
    navigate("/employers/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        jobseekerDropdownRef.current &&
        !jobseekerDropdownRef.current.contains(event.target)
      ) {
      }
      if (
        employerDropdownRef.current &&
        !employerDropdownRef.current.contains(event.target)
      ) {
      }
      if (
        employerAccountDropdownRef.current &&
        !employerAccountDropdownRef.current.contains(event.target)
      ) {
      }
      if (
        dashboardDropdownRef.current &&
        !dashboardDropdownRef.current.contains(event.target)
      ) {
      }
      if (
        jobsAppsDropdownRef.current &&
        !jobsAppsDropdownRef.current.contains(event.target)
      ) {
      }
      if (
        candidatesDropdownRef.current &&
        !candidatesDropdownRef.current.contains(event.target)
      ) {
      }
      if (
        reportsDropdownRef.current &&
        !reportsDropdownRef.current.contains(event.target)
      ) {
      }
      if (
        recruiterMgmtDropdownRef.current &&
        !recruiterMgmtDropdownRef.current.contains(event.target)
      ) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dashboardMenuItems = [
    { path: "/employer-dashboard", label: "Overview" },
  ];
  const jobsAppsMenuItems = [
    { path: "/employers/jobs", label: "Manage Jobs" },
    { path: "/jobs/new", label: "Post a New Job" },
    { path: "/employers/job-templates", label: "Job Templates" },
    { path: "/employer-applicants", label: "View All Applications" },
    { path: "/employers/candidate-search", label: "Candidate Search" },
    { path: "/employers/deleted-jobs", label: "Deleted Jobs" },
  ];
  const candidatesMenuItems = [
    { path: "/employers/candidates", label: "Candidate Database" },
  ];
  const reportsMenuItems = [
    { path: "/employers/reports/job-performance", label: "Job Performance" },
    { path: "/employers/reports/candidate", label: "Candidate Reports" },
  ];
  const recruiterMgmtMenuItems = [
    { path: "/employers/users", label: "Manage Recruiters" },
  ];

  const accountMenuItems = [
    {
      title: "Account & Settings",
      items: [
        { path: "/employers/profile", label: "Company Profile" },
        { path: "/employers/billing", label: "Billing & Payments" },
        { path: "/employers/branding", label: "Company Branding" },
      ],
    },
    {
      title: "Support/Help",
      items: [
        { path: "/employers/help", label: "Knowledge Base" },
        { path: "/employers/contact-support", label: "Contact Support" },
      ],
    },
    {
      title: "Actions",
      items: [{ label: "Logout", onClick: handleEmployerLogout, path: "/" }],
    },
  ];

  const nonAdminAccountMenuItems = [
    {
      title: "Support/Help",
      items: [
        { path: "/employers/help", label: "Knowledge Base" },
        { path: "/employers/contact-support", label: "Contact Support" },
      ],
    },
    {
      title: "Actions",
      items: [{ label: "Logout", onClick: handleEmployerLogout, path: "/" }],
    },
  ];

  const renderMenuItems = (items) => (
    <div className="dropdown-content">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.path || "#"}
          onClick={item.onClick}
          className="header-link dropdown-item-employer"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );

  const renderAccountMenu = () => (
    <div className="account-dropdown-content">
      <div className="account-columns">
        {accountMenuItems.map((group) => (
          <div key={group.title} className="account-column">
            <h3 className="column-title">{group.title}</h3>
            <ul className="column-items">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path || "#"}
                    onClick={item.onClick}
                    className="header-link dropdown-item-employer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const rendernonAdminAccountMenu = () => (
    <div className="account-dropdown-content">
      <div className="account-columns">
        {nonAdminAccountMenuItems.map((group) => (
          <div key={group.title} className="account-column">
            <h3 className="column-title">{group.title}</h3>
            <ul className="column-items">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path || "#"}
                    onClick={item.onClick}
                    className="header-link dropdown-item-employer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <header className="header">
      <div className="header-all">
        <div className="header-left">
          <Link to="/" className="logo-link">
          <div className="logo-container">
          <span className="logo-text-open">openhireindia</span>
          </div>
          </Link>
          
        </div>
        <div className="header-right">
          <div className="header-right-left">
            {!employerIsAuthenticated && (
              <Link to="/jobs" className="header-link">
                Browse Jobs
              </Link>
            )}

            {jobseekerIsAuthenticated ? (
              <>
                <Link to="/profile/jobseeker" className="header-link">
                  Profile
                </Link>
                <button
                  onClick={handleJobseekerLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              !employerIsAuthenticated && (
                <div className="dropdown" ref={jobseekerDropdownRef}>
                  <button className="header-link dropdown-button">
                    For Candidate
                  </button>
                  <div className="dropdown-content">
                    <Link to="/login/jobseeker" className="header-link dropdown-item">
                      Login
                    </Link>
                    <Link to="/register/jobseeker" className="header-link dropdown-item">
                      Create Your Profile
                    </Link>
                  </div>
                </div>
              )
            )}

            {employerIsAuthenticated && employer && (
              <>
                <div className="dropdown" ref={dashboardDropdownRef}>
                  <button className="header-link dropdown-button employer-dropdown-button">
                    Dashboard
                  </button>
                  {renderMenuItems(dashboardMenuItems)}
                </div>

                <div className="dropdown" ref={jobsAppsDropdownRef}>
                  <button className="header-link dropdown-button employer-dropdown-button">
                    Jobs & Applications
                  </button>
                  {renderMenuItems(jobsAppsMenuItems)}
                </div>

                <div className="dropdown" ref={candidatesDropdownRef}>
                  <button className="header-link dropdown-button employer-dropdown-button">
                    Candidates
                  </button>
                  {renderMenuItems(candidatesMenuItems)}
                </div>

                <div className="dropdown" ref={reportsDropdownRef}>
                  <button className="header-link dropdown-button employer-dropdown-button">
                    Reports & Analytics
                  </button>
                  {renderMenuItems(reportsMenuItems)}
                </div>

                {employerIsAuthenticated &&
                  employer &&
                  employer.role === "admin" && (
                    <div className="dropdown" ref={recruiterMgmtDropdownRef}>
                      <button className="header-link dropdown-button employer-dropdown-button">
                        Recruiter Management
                      </button>
                      {renderMenuItems(recruiterMgmtMenuItems)}
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="header-right-right">
            {employerIsAuthenticated ? (
              <>
                {employerIsAuthenticated &&
                  employer &&
                  employer.role === "admin" && (
                    <div
                      className="dropdown account-dropdown"
                      ref={employerAccountDropdownRef}
                    >
                      <button className="header-link dropdown-button employer-dropdown-button">
                        <span className="material-symbols-outlined account-icon">
                          for_you
                        </span>
                      </button>
                      {renderAccountMenu()}
                    </div>
                  )}

                {employerIsAuthenticated &&
                  employer &&
                  employer.role !== "admin" && (
                    <div
                      className="dropdown account-dropdown"
                      ref={employerAccountDropdownRef}
                    >
                      <button className="header-link dropdown-button employer-dropdown-button">
                        <span className="material-symbols-outlined account-icon">
                          for_you
                        </span>
                      </button>
                      {rendernonAdminAccountMenu()}
                    </div>
                  )}
              </>
            ) : (
              !jobseekerIsAuthenticated && (
                <div className="dropdown" ref={employerDropdownRef}>
                  <button className="header-link dropdown-button employer-dropdown-button">
                    For Employers
                  </button>
                  <div className="dropdown-content">
                    <Link
                      to="/employers/login"
                      className="header-link dropdown-item-employer"
                    >
                      Login
                    </Link>
                    <Link
                      to="/employers/register"
                      className="header-link dropdown-item-employer"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
