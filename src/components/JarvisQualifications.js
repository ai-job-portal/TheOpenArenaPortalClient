import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JarvisQualifications.css';

function JarvisQualifications() {
  const [qualifications, setQualifications] = useState([]);
  const [newQualification, setNewQualification] = useState({ degreeType: '', specialisation: '', subtype: '' });
  const [editQualificationId, setEditQualificationId] = useState(null);
  const [editQualification, setEditQualification] = useState({ degreeType: '', specialisation: '', subtype: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQualifications = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/qualifications/search?query=${searchQuery}`, {
        withCredentials: true
      });
      setQualifications(response.data.content); // Access the 'content' property
    } catch (err) {
      console.error("Failed to fetch qualifications:", err);
      setError("Failed to load qualifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, [searchQuery]);


  const handleAddQualification = async (event) => {
    event.preventDefault();
    if (!newQualification.degreeType.trim()) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/qualifications`, newQualification, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      // Use functional update for state
      setQualifications(prevQualifications => [...prevQualifications, response.data]);
      setNewQualification({ degreeType: '', specialisation: '', subtype: '' });
      setError(null);

    } catch (error) {
      console.error("Error adding qualification:", error);
      setError(error.response?.data?.message || "Failed to add qualification.");
    }
  };

    const handleEditQualification = (qualification) => {
        setEditQualificationId(qualification.id);
        setEditQualification({
            degreeType: qualification.degreeType,
            specialisation: qualification.specialisation || '', // Handle null
            subtype: qualification.subtype || '',                // Handle null
        });
    };

  const handleUpdateQualification = async (event) => {
    event.preventDefault();
    if (!editQualification.degreeType.trim()) return;

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/qualifications/${editQualificationId}`, editQualification, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      // Update local state using functional update
      setQualifications(prevQualifications =>
        prevQualifications.map(q => (q.id === editQualificationId ? response.data : q))
      );
      setEditQualificationId(null);
      setEditQualification({ degreeType: '', specialisation: '', subtype: '' });
      setError(null);
    } catch (error) {
      console.error("Error updating qualification:", error);
      setError(error.response?.data?.message || 'Failed to update qualification.');

    }
  };



  const handleDeleteQualification = async (qualificationId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/qualifications/${qualificationId}`, { withCredentials: true });
       // Use functional update for state
      setQualifications(prevQualifications => prevQualifications.filter(q => q.id !== qualificationId));
      setError(null);

    } catch (error) {
      console.error("Error deleting qualification:", error);
      setError("Failed to delete qualification. Please try again.");
    }
  };



  if (loading) {
    return <div>Loading qualifications...</div>;
  }

  return (
    <div className="jarvis-qualifications-card">
      <h2>Manage Qualifications</h2>
        {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddQualification} className="add-qual-form">
        <label htmlFor="new-degreeType">Degree Type:</label>
        <input
          type="text"
          id="new-degreeType"
          value={newQualification.degreeType}
          onChange={(e) => setNewQualification({ ...newQualification, degreeType: e.target.value })}
          required
          placeholder="e.g., Graduate"
        />
        <label htmlFor="new-specialisation">Specialisation:</label>
        <input
          type="text"
          id="new-specialisation"
          value={newQualification.specialisation}
          onChange={(e) => setNewQualification({ ...newQualification, specialisation: e.target.value })}
          placeholder="e.g., Bachelor of Science (BSc)"
        />
        <label htmlFor="new-subtype">Subtype:</label>
        <input
          type="text"
          id="new-subtype"
          value={newQualification.subtype}
          onChange={(e) => setNewQualification({ ...newQualification, subtype: e.target.value })}
          placeholder="e.g., BSc in Computer Science"
        />
        <button type="submit">Add Qualification</button>
      </form>

      <div className="search-form">
        <label htmlFor="search">Search Qualifications:</label>
            <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search qualifications..."
            />
       </div>

      <div className="qualifications-list">
        <h3>Qualifications</h3>
        <ul>
          {qualifications.map(qualification => (
            <li key={qualification.id}>
              {editQualificationId === qualification.id ? (
                <form onSubmit={handleUpdateQualification}>
                  <input
                    type="text"
                    value={editQualification.degreeType}
                    onChange={(e) => setEditQualification({ ...editQualification, degreeType: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    value={editQualification.specialisation}
                    onChange={(e) => setEditQualification({ ...editQualification, specialisation: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editQualification.subtype}
                    onChange={(e) => setEditQualification({ ...editQualification, subtype: e.target.value })}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditQualificationId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                   {qualification.degreeType}
                  {qualification.specialisation && ` - ${qualification.specialisation}`}
                  {qualification.subtype && ` - ${qualification.subtype}`}

                  <button onClick={() => handleEditQualification(qualification)}>Edit</button>
                  <button onClick={() => handleDeleteQualification(qualification.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default JarvisQualifications;