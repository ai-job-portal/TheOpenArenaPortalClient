import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JarvisSkills.css';

function JarvisSkills() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editSkillId, setEditSkillId] = useState(null);
  const [editSkillName, setEditSkillName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/skills/search?query=${searchQuery}`, {
        withCredentials: true
      });
      setSkills(response.data.content);
    } catch (err) {
      console.error("Failed to load skills:", err);
      setError("Failed to load skills. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [searchQuery]);

  const handleAddSkill = async (event) => {
    event.preventDefault();
    if (!newSkill.trim()) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/skills`, { name: newSkill.trim() }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      // Functional update for state
      setSkills(prevSkills => [...prevSkills, response.data]);
      setNewSkill('');
      setError(null);
    } catch (error) {
      console.error("Error adding skill:", error);
      setError(error.response?.data?.message || "Failed to add skill.");
    }
  };

  const handleEditSkill = (skill) => {
    setEditSkillId(skill.id);
    setEditSkillName(skill.name);
  };

  const handleUpdateSkill = async (event) => {
    event.preventDefault();
    if (!editSkillName.trim()) return;

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/skills/${editSkillId}`, { name: editSkillName }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

       // Use functional update for state:
      setSkills(prevSkills =>
        prevSkills.map(skill => (skill.id === editSkillId ? { ...skill, name: response.data.name } : skill))
      );

      setEditSkillId(null);
      setEditSkillName('');
      setError(null);
    } catch (error) {
      console.error("Error updating skill:", error);
      setError(error.response?.data?.message || 'Failed to update skill. Please try again.');
    }
  };


  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/skills/${skillId}`, { withCredentials: true });
      // Functional update for state
        setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
        setError(null);
    } catch (error) {
      console.error("Error deleting skill:", error);
      setError("Failed to delete skill. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading skills...</div>;
  }

    return (
        <div className="jarvis-skills-card">
            <h2>Manage Skills</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleAddSkill} className="add-skill-form">
                <label htmlFor="new-skill">Add Skill:</label>
                <input
                    type="text"
                    id="new-skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., Python, JavaScript"
                    required
                />
                <button type="submit">Add Skill</button>
            </form>

           <div className="search-form">
            <label htmlFor="search">Search Skills:</label>
            <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills..."
            />
            </div>

            <div className="skills-list">
                <h3>Skills</h3>
                <ul>
                    {skills.map(skill => (
                        <li key={skill.id}>
                            {editSkillId === skill.id ? (
                <form onSubmit={handleUpdateSkill}>
                  <input
                    type="text"
                    value={editSkillName}
                    onChange={(e) => setEditSkillName(e.target.value)}
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditSkillId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  {skill.name}
                  <button onClick={() => handleEditSkill(skill)}>Edit</button>
                  <button onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
                </>
              )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default JarvisSkills;