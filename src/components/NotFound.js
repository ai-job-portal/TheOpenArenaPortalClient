// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Import the CSS


function NotFound() {
  return (
    <div className="upper-found-container">
      <div className="not-found-container">
          <Link to="/"> <img src="/404.png" alt="404 Not Found" className="not-found-image" /></Link>
          {/* ... rest of your content ... */}
      </div>
      </div >
  );
}

export default NotFound;