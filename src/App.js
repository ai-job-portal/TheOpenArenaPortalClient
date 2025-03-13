import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JobseekerRegister from './components/JobseekerRegister';
import JobseekerLogin from './components/JobseekerLogin';
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
import { useJobseekerAuth } from './hooks/useJobseekerAuth';
import { useEmployerAuth } from './hooks/useEmployerAuth';
import { useUI } from './context/UIContext';
import Toast from './components/Toast';
import EmployerUserList from './components/EmployerUserList';
import SharedJobList from './components/SharedJobList';
import SessionLogout from './components/SessionLogout';
import NotFound from './components/NotFound';

function App() {
  const { isAuthenticated: jobseekerAuthenticated, loading: jobseekerLoading } = useJobseekerAuth();
  const { isAuthenticated: employerAuthenticated, loading: employerLoading } = useEmployerAuth();
  const { toast } = useUI();

  if (jobseekerLoading || employerLoading) {
    return <div className="loading">Loading...</div>; // Show loading while auth initializes
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register/jobseeker" element={<JobseekerRegister />} />
          <Route path="/login/jobseeker" element={<JobseekerLogin />} />
          <Route path="/employers/login" element={<EmployerLogin />} />
          <Route path="/sessionlogout" element={<SessionLogout />} />
          <Route path="/employers/register" element={<EmployerRegistration />} />
          <Route
            path="/profile/jobseeker"
            element={jobseekerAuthenticated ? <JobseekerProfile /> : <Navigate to="/sessionlogout" />}
          />
          <Route
            path="/employer-dashboard"
            element={employerAuthenticated ? <EmployerDashboard /> : <Navigate to="/employers/login" />}
          />
          <Route
            path="/employers/users"
            element={employerAuthenticated ? <EmployerUserList /> : <Navigate to="/employers/login" />}
          />
          <Route
            path="/employers/deleted-jobs"
            element={employerAuthenticated ? <DeletedJobsList /> : <Navigate to="/employers/login" />}
          />
          <Route path="/jobs/new" element={<JobPost />} />
          <Route path="/jobs" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail employerIsAuthenticated={employerAuthenticated} />} />
          <Route path="/jobs/edit/:id" element={<JobEdit />} />
          <Route
            path="/employers/profile"
            element={employerAuthenticated ? <EmployerProfile /> : <Navigate to="/employers/login" />}
          />
          <Route
            path="/employers/account"
            element={employerAuthenticated ? <EmployerAccountSettings /> : <Navigate to="/employers/login" />}
          />
           {/* Catch-all route *MUST* be last */}
           <Route path="*" element={<NotFound />} />
        </Routes>
        <Toast toast={toast} />
      </div>
    </Router>
  );
}

export default App;