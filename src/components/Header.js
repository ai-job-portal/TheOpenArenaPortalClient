// Header.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react"; // Import useCallback
import { Link, useNavigate } from "react-router-dom";
import { useJobseekerAuth } from "../hooks/useJobseekerAuth";
import { useEmployerAuth } from "../hooks/useEmployerAuth";
import { useJarvisAuth } from '../hooks/useJarvisAuth';
import "./Header.css";
import { useUI } from "../context/UIContext";

const ROUTES = {
    JOBSEEKER_LOGIN: "/login/jobseeker",
    JOBSEEKER_PROFILE: "/profile/jobseeker",
    EMPLOYER_LOGIN: "/employers/login",
    EMPLOYER_DASHBOARD: "/employer/dashboard",
    EMPLOYER_JOBS: "/employers/jobs",
    JOB_NEW: "/jobs/new",
    EMPLOYER_TEMPLATES: "/employers/job-templates",
    EMPLOYER_APPLICANTS: "/employer-applicants",
    EMPLOYER_CANDIDATE_SEARCH: "/employers/candidate-search",
    EMPLOYER_DELETED_JOBS: "/employers/deleted-jobs",
    EMPLOYER_CANDIDATES: "/employers/candidates",
    EMPLOYER_REPORTS_JOB: "/employers/reports/job-performance",
    EMPLOYER_REPORTS_CANDIDATE: "/employers/reports/candidate",
    EMPLOYER_USERS: "/employers/users",
    EMPLOYER_PROFILE: "/employers/profile",
    EMPLOYER_BILLING: "/employers/billing",
    EMPLOYER_BRANDING: "/employers/branding",
    EMPLOYER_HELP: "/employers/help",
    EMPLOYER_CONTACT: "/employers/contact-support",
    EMPLOYER_REGISTER: "/employers/register",
    JARVIS_LOGIN: "/jarvis/login",
    JARVIS_DASHBOARD: "/jarvis/dashboard",
    JARVIS_CITIES: "/jarvis/cities",
    JARVIS_SKILLS: "/jarvis/skills",
    JARVIS_QUALIFICATIONS: "/jarvis/qualifications",
    JOBS: "/jobs",
    HOME: "/",
    REGISTER_JOBSEEKER: "/register/jobseeker",
};

function Header() {
    const { user: jobseeker, isAuthenticated: jobseekerIsAuthenticated, logout: jobseekerLogout } = useJobseekerAuth();
    const { user: employer, isAuthenticated: employerIsAuthenticated, loading: employerLoading, logout: employerLogout } = useEmployerAuth();
    const { isAuthenticated: jarvisIsAuthenticated, logout: jarvisLogout } = useJarvisAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    const [openDropdown, setOpenDropdown] = useState(null);

    // Determine user role based on authentication status.  More robust.
    const userRole = useMemo(() => {
        if (jarvisIsAuthenticated) return "jarvis";
        if (jobseekerIsAuthenticated) return "jobseeker";
        if (employerIsAuthenticated) return "employer";
        return "guest";
    }, [jarvisIsAuthenticated, jobseekerIsAuthenticated, employerIsAuthenticated]);

    // Logout handlers (using useCallback for performance and to avoid dependency issues)
    const handleJobseekerLogout = useCallback(async () => {
        try {
            await jobseekerLogout();
            showToast("You have been logged out.", "info");
        } catch (error) {
            showToast("Logout failed. Please try again.", "error");
        }
    }, [jobseekerLogout, showToast]);

    const handleEmployerLogout = useCallback(async () => {
        try {
            await employerLogout();
            showToast("You have been logged out.", "info");
        } catch (error) {
            showToast("Logout failed. Please try again.", "error");
        }
    }, [employerLogout, showToast]);

    const handleJarvisLogout = useCallback(async () => {
        try {
            await jarvisLogout();
            showToast("You have been logged out.", "info");
        } catch (error) {
            showToast("Logout failed. Please try again.", "error");
        }
    }, [jarvisLogout, showToast]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown")) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    const dashboardMenuItems = [{ path: ROUTES.EMPLOYER_DASHBOARD, label: "Overview" }];
    const jobsAppsMenuItems = [
        { path: ROUTES.EMPLOYER_JOBS, label: "Manage Jobs" },
        { path: ROUTES.JOB_NEW, label: "Post a New Job" },
        { path: ROUTES.EMPLOYER_TEMPLATES, label: "Job Templates" },
        { path: ROUTES.EMPLOYER_APPLICANTS, label: "View All Applications" },
        { path: ROUTES.EMPLOYER_CANDIDATE_SEARCH, label: "Candidate Search" },
        { path: ROUTES.EMPLOYER_DELETED_JOBS, label: "Deleted Jobs" }
    ];
    const candidatesMenuItems = [{ path: ROUTES.EMPLOYER_CANDIDATES, label: "Candidate Database" }];
    const reportsMenuItems = [
        { path: ROUTES.EMPLOYER_REPORTS_JOB, label: "Job Performance" },
        { path: ROUTES.EMPLOYER_REPORTS_CANDIDATE, label: "Candidate Reports" }
    ];
    const recruiterMgmtMenuItems = [{ path: ROUTES.EMPLOYER_USERS, label: "Manage Recruiters" }];

    const accountMenuItems = [
        {
            title: "Account & Settings",
            items: [
                { path: ROUTES.EMPLOYER_PROFILE, label: "Company Profile" },
                { path: ROUTES.EMPLOYER_BILLING, label: "Billing & Payments" },
                { path: ROUTES.EMPLOYER_BRANDING, label: "Company Branding" }
            ]
        },
        {
            title: "Support/Help",
            items: [
                { path: ROUTES.EMPLOYER_HELP, label: "Knowledge Base" },
                { path: ROUTES.EMPLOYER_CONTACT, label: "Contact Support" }
            ]
        },
        {
            title: "Actions",
            items: [{ label: "Logout", onClick: handleEmployerLogout, path: ROUTES.HOME }]
        }
    ];

const nonAdminAccountMenuItems = [
    {
        title: "Support/Help",
        items: [
            { path: ROUTES.EMPLOYER_HELP, label: "Knowledge Base" },
            { path: ROUTES.EMPLOYER_CONTACT, label: "Contact Support" },
        ],
    },
    {
        title: "Actions",
        items: [{ label: "Logout", onClick: handleEmployerLogout, path: ROUTES.HOME }],
    },
];

    const jarvisMenuItems = [
        { path: ROUTES.JARVIS_DASHBOARD, label: "Dashboard" },
        { path: ROUTES.JARVIS_CITIES, label: "Cities" },
        { path: ROUTES.JARVIS_SKILLS, label: "Skills" },
        { path: ROUTES.JARVIS_QUALIFICATIONS, label: "Qualifications" },
        { label: "Logout", onClick: handleJarvisLogout, path: ROUTES.HOME  }
    ];

    const renderMenuItems = (items) => (
        <div className="dropdown-content">
            {items.map((item) => (
                <Link
                    key={`${item.path || item.label}-${item.label}`}
                    to={item.path || "#"}
                    onClick={(e) => {
                        if (item.onClick) {
                            item.onClick(e); // Correctly call onClick
                        }
                        setOpenDropdown(null);
                    }}
                    className="header-link dropdown-item-employer"
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
  const renderAccountMenu = (items) => (
        <div className="account-dropdown-content">
            <div className="account-columns">
                {items.map((group) => (
                    <div key={group.title} className="account-column">
                        <h3 className="column-title">{group.title}</h3>
                        <ul className="column-items">
                            {group.items.map((item) => (
                                <li key={`${item.path || item.label}-${item.label}`}>
                                    <Link
                                        to={item.path || "#"}
                                        onClick={(e) => {
                                            if (item.onClick) {
                                                item.onClick(e);
                                            }
                                            setOpenDropdown(null);
                                        }}
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

    if (employerLoading) {
      return <div>Loading...</div>;
    }

    return (
        <header className="header">
            <div className="header-all">
                <div className="header-left">
                    <Link to={ROUTES.HOME} className="logo-link">
                        <div className="logo-container">
                            <span className="logo-text-open">openhireindia</span>
                        </div>
                    </Link>
                </div>
                <div className="header-right">
                    <div className="header-right-left">

                        {userRole === "jarvis" && jarvisIsAuthenticated && (
                            <div className="dropdown">
                                <button className="header-link dropdown-button" onClick={() => toggleDropdown("jarvis")}>
                                    Jarvis
                                </button>
                                {openDropdown === "jarvis" && renderMenuItems(jarvisMenuItems)}
                            </div>
                        )}

                        {userRole === "jobseeker" && jobseekerIsAuthenticated && (
                            <>
                                <Link to={ROUTES.JOBSEEKER_PROFILE} className="header-link">Profile</Link>
                                <button onClick={handleJobseekerLogout} className="logout-button">Logout</button>
                            </>
                        )}

                        {userRole === "employer" && employerIsAuthenticated && (  // Simplified condition
                            <>
                                <div className="dropdown">
                                    <button className="header-link dropdown-button employer-dropdown-button" onClick={() => toggleDropdown('dashboard')}>
                                        Dashboard
                                    </button>
                                    {openDropdown === 'dashboard' && renderMenuItems(dashboardMenuItems)}
                                </div>

                                <div className="dropdown">
                                    <button className="header-link dropdown-button employer-dropdown-button" onClick={() => toggleDropdown('jobsApps')}>
                                        Jobs & Applications
                                    </button>
                                    {openDropdown === 'jobsApps' && renderMenuItems(jobsAppsMenuItems)}
                                </div>

                                <div className="dropdown">
                                     <button className="header-link dropdown-button employer-dropdown-button" onClick={() => toggleDropdown("candidates")}>
                                        Candidates
                                     </button>
                                    {openDropdown === 'candidates' && renderMenuItems(candidatesMenuItems)}
                                </div>

                                <div className="dropdown">
                                    <button className="header-link dropdown-button employer-dropdown-button"  onClick={() => toggleDropdown('reports')}>
                                        Reports & Analytics
                                    </button>
                                    {openDropdown === 'reports' && renderMenuItems(reportsMenuItems)}
                                </div>

                                {employer.role === "employer" && (
                                    <div className="dropdown">
                                        <button className="header-link dropdown-button employer-dropdown-button" onClick={() => toggleDropdown('recruiterMgmt')}>
                                            Recruiter Management
                                        </button>
                                        {openDropdown === 'recruiterMgmt' && renderMenuItems(recruiterMgmtMenuItems)}
                                    </div>
                                )}
                                 <div className="dropdown account-dropdown">
                                    <button className="header-link dropdown-button employer-dropdown-button" onClick={()=> toggleDropdown('account')}>
                                         <span className="material-symbols-outlined account-icon">for_you</span>
                                     </button>
                                     {openDropdown === 'account' &&
                                        renderAccountMenu(employer?.role === "employer" ? accountMenuItems : nonAdminAccountMenuItems)
                                      }
                                   </div>
                            </>
                        )}

                        {userRole === "guest" && (
                            <>
                                <Link to={ROUTES.JOBS} className="header-link">Browse Jobs</Link>
                                <div className="dropdown">
                                    <button className="header-link dropdown-button"  onClick={() => toggleDropdown('jobseeker')}>For Candidate</button>
                                        {openDropdown === 'jobseeker' &&(
                                         <div className="dropdown-content">
                                            <Link to={ROUTES.JOBSEEKER_LOGIN} className="header-link dropdown-item">Login</Link>
                                            <Link to={ROUTES.REGISTER_JOBSEEKER} className="header-link dropdown-item">Create Your Profile</Link>
                                         </div>
                                       )}
                                </div>
                                <div className="dropdown">
                                        <button className="header-link dropdown-button employer-dropdown-button" onClick={() => toggleDropdown('employer')}>For Employers</button>
                                        {openDropdown === 'employer' &&(
                                         <div className="dropdown-content">
                                           <Link to={ROUTES.EMPLOYER_LOGIN} className="header-link dropdown-item-employer">Login</Link>
                                           <Link to={ROUTES.EMPLOYER_REGISTER} className="header-link dropdown-item-employer">Register</Link>
                                        </div>
                                      )}
                                </div>
                                    <Link to={ROUTES.JARVIS_LOGIN} className="header-link">
                                       Jarvis Login
                                    </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;