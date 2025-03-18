// client/src/components/SessionLogout.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SessionLogout.css';
import { LogOut } from 'react-feather';

function SessionLogout() {
  return (
  <div className="upper-found-container">
    <div className="session-logout-container">
      <LogOut size={48} className="logout-icon" /> {/* Add the icon */}
      <h2>Session Expired</h2>
      <p>Your session has timed out, or you have been logged out.</p>
      <span><Link to="/">Login again</Link></span>
    </div>
    </div>
  );
}

export default SessionLogout;