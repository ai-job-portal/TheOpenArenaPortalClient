// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JobseekerRegister from './components/JobseekerRegister';
import JobseekerLogin from './components/JobseekerLogin';
import JarvisLogin from './components/JarvisLogin';
import JarvisDashboard from './components/JarvisDashboard';
import Home from './components/Home';
import JobseekerProfile from './components/JobseekerProfile';
import Header from './components/Header';
import EmployerLogin from './components/EmployerLogin';
import EmployerRegistration from './components/EmployerRegistration';
import EmployerDashboard from './components/EmployerDashboard';
import JobPost from './components/JobPost';
import JobList from './components/JobList';
import EmployerJobList from './components/EmployerJobList';
import JobDetail from './components/JobDetail';
import JobEdit from './components/JobEdit';
import EmployerProfile from './components/EmployerProfile';
import EmployerAccountSettings from './components/EmployerAccountSettings';
import DeletedJobsList from './components/DeletedJobsList';
import './App.css';
import { useUI } from './context/UIContext';
import Toast from './components/Toast';
import EmployerUserList from './components/EmployerUserList';
import SharedJobList from './components/SharedJobList';
import SessionLogout from './components/SessionLogout';
import NotFound from './components/NotFound';
import { useJobseekerAuth } from './hooks/useJobseekerAuth';
import { useEmployerAuth } from './hooks/useEmployerAuth';
import { useJarvisAuth } from './hooks/useJarvisAuth';
import JarvisCities from "./components/JarvisCities";
import JarvisSkills from "./components/JarvisSkills";
import JarvisQualifications from "./components/JarvisQualifications";

function App() {
  const { toast } = useUI();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/jobseeker" element={<JobseekerRegister />} />
        <Route path="/login/jobseeker" element={<JobseekerLogin />} />
        <Route path="/employers/login" element={<EmployerLogin />} />
        <Route path="/sessionlogout" element={<SessionLogout />} />
        <Route path="/employers/register" element={<EmployerRegistration />} />
        <Route path="/jarvis/login" element={<JarvisLogin />} />
        <Route path="/profile/jobseeker" element={<ProtectedRoute type="jobseeker"><JobseekerProfile /></ProtectedRoute>} />
        <Route path="/employer/dashboard" element={<ProtectedRoute type="employer"><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/employers/users" element={<ProtectedRoute type="employer"><EmployerUserList /></ProtectedRoute>} />
        <Route path="/employers/deleted-jobs" element={<ProtectedRoute type="employer"><DeletedJobsList /></ProtectedRoute>} />
        <Route path="/employers/profile" element={<ProtectedRoute type="employer"><EmployerProfile /></ProtectedRoute>} />
        <Route path="/employers/account" element={<ProtectedRoute type="employer"><EmployerAccountSettings /></ProtectedRoute>} />
        <Route path="/jarvis/dashboard" element={<ProtectedRoute type="jarvis"><JarvisDashboard /></ProtectedRoute>} />
        <Route path="/jarvis/cities" element={<ProtectedRoute type="jarvis"><JarvisCities /></ProtectedRoute>} />
        <Route path="/jarvis/skills" element={<ProtectedRoute type="jarvis"><JarvisSkills /></ProtectedRoute>} />
        <Route path="/jarvis/qualifications" element={<ProtectedRoute type="jarvis"><JarvisQualifications /></ProtectedRoute>} />
        <Route path="/jobs/new" element={<JobPost />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/jobs/edit/:id" element={<JobEdit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toast toast={toast} />
    </div>
  );
}

function ProtectedRoute({ children, type }) {
    const { isAuthenticated: jobseekerAuth, loading: jobseekerLoading } = useJobseekerAuth();
    const { isAuthenticated: employerAuth, loading: employerLoading } = useEmployerAuth();
    const { isAuthenticated: jarvisAuth, loading: jarvisLoading } = useJarvisAuth();
    const authStates = {
        jobseeker: { isAuthenticated: jobseekerAuth, loading: jobseekerLoading, loginPath: "/login/jobseeker" },
        employer: { isAuthenticated: employerAuth, loading: employerLoading, loginPath: "/employers/login" },
        jarvis: { isAuthenticated: jarvisAuth, loading: jarvisLoading, loginPath: "/jarvis/login" },
    };
    const { isAuthenticated, loading, loginPath } = authStates[type] || { isAuthenticated: false, loading: false, loginPath: '/' };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to={loginPath} />;
    }
    return children;
}

export default App;