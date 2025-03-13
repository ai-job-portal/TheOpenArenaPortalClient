// client/src/components/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobseekerAuth } from '../hooks/useJobseekerAuth';

function Home() {
  const { isAuthenticated } = useJobseekerAuth();
  const [searchQuery, setSearchQuery] = useState({
    titleKeywordsSkills: '',
    location: '',
    experience: 'Select Experience',
  });

  const handleSearch = (event) => {
    event.preventDefault();
    console.log('Search submitted:', searchQuery);
    // Add API call or navigation logic here (e.g., to /jobs with query params)
  };

  const handleChange = (field, value) => {
    setSearchQuery(prev => ({ ...prev, [field]: value }));
  };

  // Generate experience options from 1 to 50 years
  const experienceOptions = Array.from({ length: 50 }, (_, i) => ({
    value: `${i + 1} year${i + 1 === 1 ? '' : 's'}`,
    label: `${i + 1} year${i + 1 === 1 ? '' : 's'}`,
  }));

  return (
    <div className="home-container">
      <h1>Unlock a World of Opportunity: Discover Roles That Match Your Ambition and Drive</h1>
      <div className="search-bar-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-field">
            <input
              type="text"
              placeholder="title, keywords, or skills"
              value={searchQuery.titleKeywordsSkills}
              onChange={(e) => handleChange('titleKeywordsSkills', e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-field">
            <input
              type="text"
              placeholder="City or location"
              value={searchQuery.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="search-input location"
            />
          </div>
          <div className="search-field">
            <select
              value={searchQuery.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="search-field-select"
            >
              <option value="Select Experience" disabled>Select Experience</option>
              {experienceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="search-button">Find Jobs</button>
        </form>
      </div>
      <p className="popular-searches">Popular Searches: Designer, Developer, AI, Data Scientist, Engineer...</p>
      <div className="home-buttons">
        {isAuthenticated && (
          <Link to="/profile/jobseeker"><button className="profile-button">Profile</button></Link>
        )}
      </div>
    </div>
  );
}

export default Home;