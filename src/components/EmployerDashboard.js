// client/src/components/EmployerDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useUI } from '../context/UIContext';
import './EmployerDashboard.css';
import axios from 'axios';

function EmployerDashboard() {
    const { employer, logout, isAuthenticated, loading } = useEmployerAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();
    const [profileViews, setProfileViews] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [timeframe, setTimeframe] = useState('6 months');
    const chartRef = useRef(null);
    const [isDataLoading, setIsDataLoading] = useState(false);

    // State for Dashboard Overview
    const [totalActiveJobs, setTotalActiveJobs] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);
    const [recentJobs, setRecentJobs] = useState([]);
    const [expiringJobs, setExpiringJobs] = useState([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [pendingActionsCount, setPendingActionsCount] = useState(0);

    const fetchDashboardData = async () => {
        setIsDataLoading(true);
        if (!employer) {
            setIsDataLoading(false);
            return;
        }
        try {
            // Fetch Overview Data
            const overviewResponse = await axios.get(`/api/employers/${employer.id}/dashboard-overview`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('employerToken')}` }
          });
            const overviewData = overviewResponse.data;

            setTotalActiveJobs(overviewData.totalActiveJobs);
            setTotalApplications(overviewData.totalApplications);
            setRecentJobs(overviewData.recentJobs);
            setExpiringJobs(overviewData.expiringJobs);
            setUnreadMessagesCount(overviewData.unreadMessagesCount);
            setPendingActionsCount(overviewData.pendingActionsCount);

            // Simulate fetching profile views (replace with actual API call)
            const mockProfileViews = [
                { month: 'Jan', views: 250 },
                { month: 'Feb', views: 300 },
                { month: 'Mar', views: 350 },
                { month: 'Apr', views: 400 },
                { month: 'May', views: 380 },
                { month: 'Jun', views: 390 },
            ];
            setProfileViews(mockProfileViews);

            // Simulate fetching notifications (Replace with actual API calls)
            const companyName = employer.company_name || 'Your Company';
            const mockNotifications = [
                { id: 1, message: `${companyName} received an application for Product Manager`, time: '2 hours ago' },
                { id: 2, message: `${companyName} received a message from a candidate`, time: '1 day ago' },
                { id: 3, message: `${companyName} shortlisted a resume for Software Engineer`, time: '3 days ago' },
            ];
            setNotifications(mockNotifications);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            showToast('Failed to load dashboard data.', 'error');
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/employers/login');
            return;
        }

        if (isAuthenticated) {
          fetchDashboardData();
        }
    }, [isAuthenticated, loading, navigate, employer, showToast]);

    const handleLogout = () => { //Not required.
        logout();
        showToast('You have been logged out.', 'info');
        navigate('/employers/login');
    };

      const metricCards = [
        { title: 'Posted Jobs', count: totalActiveJobs, icon: '📦', color: 'var(--primary-color)' },
        { title: 'Applications', count: totalApplications, icon: '📜', color: '#ff6b6b' },
        { title: 'Messages', count: unreadMessagesCount, icon: '📧', color: '#ffcc00' },
        { title: 'Pending Actions', count: pendingActionsCount, icon: '⏳', color: '#28a745' }
    ];

    // Get the width of the chart container dynamically
    const chartWidth = chartRef.current ? chartRef.current.offsetWidth : 0;
    const step = chartWidth / (profileViews.length - 1) || 1;

    if (loading || (isAuthenticated && !employer) || isDataLoading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="employer-dashboard-container">
            {/* Sidebar is now handled in Header.js */}
            <div className="main-content">
                <h2>Dashboard Home!</h2>
                <p className="welcome-message">Ready to jump back in?</p>

                <div className="metrics-grid">
                    {metricCards.map((card) => (
                        <div key={card.title} className="metric-card" style={{ backgroundColor: 'white', borderColor: card.color }}>
                            <span role="img" aria-label={card.title} style={{ color: card.color }}>{card.icon}</span>
                            <span className="metric-count">{card.count}</span>
                            <span className="metric-title">{card.title}</span>
                        </div>
                    ))}
                </div>

                {/* Recent and Expiring Jobs */}
                <div className="recent-expiring-jobs">
                    <div className="recent-jobs">
                        <h3>Recently Posted Jobs</h3>
                        {recentJobs.length > 0 ? (
                            <ul>
                                {recentJobs.map(job => (
                                    <li key={job.id}>
                                        <Link to={`/jobs/${job.id}`}>{job.title}</Link> - Applications: {job.applicationCount}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recently posted jobs.</p>
                        )}
                    </div>

                    <div className="expiring-jobs">
                        <h3>Jobs Expiring Soon</h3>
                        {expiringJobs.length > 0 ? (
                            <ul>
                                {expiringJobs.map(job => (
                                   <li key={job.id}>
                                        <Link to={`/jobs/${job.id}`}>{job.title}</Link> - Expires in {job.daysUntilExpiration} days
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No jobs expiring soon.</p>
                        )}
                    </div>
                </div>

                <div className="profile-views">
                    <h3>Your Profile Views</h3>
                    <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="timeframe-select">
                        <option value="6 months">Last 6 Months</option>
                        <option value="3 months">Last 3 Months</option>
                        <option value="1 month">Last Month</option>
                    </select>
                    <div className="chart-placeholder" ref={chartRef}>
                        {/* Simulated chart (replace with actual charting library like Chart.js) */}
                        <svg width="100%" height="200" className="line-chart">
                            {profileViews.map((pv, index) => (
                                <g key={pv.month}>
                                    <text x={index * step} y="220" textAnchor="middle" fill="var(--text-color)" fontSize="12">
                                        {pv.month}
                                    </text>
                                    <circle cx={index * step} cy={200 - (pv.views / 400) * 180} r="5" fill="var(--primary-color)" />
                                    {index < profileViews.length - 1 && (
                                        <line
                                            x1={index * step}
                                            y1={200 - (pv.views / 400) * 180}
                                            x2={(index + 1) * step}
                                            y2={200 - (profileViews[index + 1].views / 400) * 180}
                                            stroke="var(--primary-color)"
                                            strokeWidth="2"
                                        />
                                    )}
                                </g>
                            ))}
                            <line x1="0" y1="20" x2="0" y2="200" stroke="#ccc" strokeWidth="1" />
                            <line x1="0" y1="200" x2="100%" y2="200" stroke="#ccc" strokeWidth="1" />
                        </svg>
                    </div>
                </div>
                <div className="notifications">
                    <h3>Notifications</h3>
                    {notifications.map((notification) => (
                        <div key={notification.id} className="notification-item">
                            <span role="img" aria-label="Notification" className="notification-icon">🔔</span>
                            <span className="notification-message">{notification.message}</span>
                            <span className="notification-time">{notification.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EmployerDashboard;