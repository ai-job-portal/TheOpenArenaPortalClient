import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JarvisCities.css';
import { useJarvisAuth } from '../hooks/useJarvisAuth';

function JarvisCities() {
    const [cities, setCities] = useState([]);
    const [newCityInput, setNewCityInput] = useState('');
    const [editCityId, setEditCityId] = useState(null);
    const [editCityName, setEditCityName] = useState('');
    const [editStateName, setEditStateName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false); // Track search state
    const { authFetch, logout, isAuthenticated } = useJarvisAuth(); 

    const fetchRecentCities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cities/recent`, {
                withCredentials: true
            });
            setCities(response.data);
            setIsSearchActive(false); // Reset search state
        } catch (err) {
            console.error("Failed to fetch recent cities:", err);
            setError("Failed to load recent cities. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cities/search?query=${searchQuery}`, {
                withCredentials: true
            });
            setCities(response.data.content);
            setIsSearchActive(true); // Set search state to true
        } catch (err) {
            console.error("Failed to search cities:", err);
            setError(err.response?.data?.message || "Failed to search cities. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentCities(); // Load recent cities on initial load
    }, []);


    const handleAddCity = async (event) => {
      event.preventDefault();
      if(!newCityInput.trim()) return;

      const cityPairs = newCityInput.split(';').map(pair => pair.trim()).filter(pair=> pair);
      const cityDTOs = [];

      for(const pair of cityPairs){
          const parts = pair.split(',').map(part => part.trim());
          if(parts.length !== 2){
              setError(`Invalid City/State format: "${pair}"`);
              return;
          }
          cityDTOs.push({name: parts[0], state: parts[1]});
      }

      try{
           const response = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/cities/bulk`,{ method : "POST" ,data:cityDTOs
        
          });
          setNewCityInput('');
          setError(null);
          //fetchRecentCities(); // Refresh the recent cities list

      }
      catch(error){
          console.error("Error adding cities", error);
          setError(error.response?.data?.message || "Failed to add cities.");
      }
    };


    const handleEditCity = (city) => {
        setEditCityId(city.id);
        setEditCityName(city.name);
        setEditStateName(city.state);
    };

    const handleUpdateCity = async (event) => {
    event.preventDefault();
    if (!editCityName.trim() || !editStateName.trim()) return;

    try {
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/cities/${editCityId}`, {
            name: editCityName,
            state: editStateName
        }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });

        setCities(prevCities =>
            prevCities.map(city => (city.id === editCityId ? response.data : city))
        );
        setEditCityId(null);
        setEditCityName('');
        setEditStateName('');
        setError(null);

    } catch (error) {
        console.error("Error updating city:", error);
        setError(error.response?.data?.message || 'Failed to update city. Please try again.');
    }
};

    const handleDeleteCity = async (cityId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cities/${cityId}`, { withCredentials: true });
            setCities(prevCities => prevCities.filter(city => city.id !== cityId));
            setError(null);
        } catch (error) {
            console.error("Error deleting city:", error);
            setError("Failed to delete city. Please try again.");
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            fetchSearchResults();
        } else {
            fetchRecentCities(); // If search query is empty, show recent cities
        }
    };

    if (loading) {
        return <div>Loading cities...</div>;
    }

    return (
        <div className="jarvis-cities-card">
            <h2>Manage Cities</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleAddCity} className="add-city-form">
                <label htmlFor="new-city">Add Cities (City, State; City, State):</label>
                <input
                    type="text"
                    id="new-city"
                    value={newCityInput}
                    onChange={(e) => setNewCityInput(e.target.value)}
                    placeholder="e.g., Mumbai, Maharashtra; Pune, Maharashtra"
                    required
                />
                <button type="submit">Add Cities</button>
            </form>

            <form onSubmit={handleSearch} className="search-form-cities">
                <label htmlFor="search">Search Cities:</label>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city or state..."
                />
                <button type="submit">Search</button>
            </form>

            <div className="cities-list">
                {/* Conditionally render the heading */}
                <h3>{isSearchActive ? `Search Results for "${searchQuery}"` : 'Top 10 Recently Added Cities'}</h3>
                <ul>
                   {cities.map(city => (
                        <li key={city.id}>
                            {editCityId === city.id ? (
                                <form onSubmit={handleUpdateCity}>
                                    <input
                                        type="text"
                                        value={editCityName}
                                        onChange={(e) => setEditCityName(e.target.value)}
                                        required
                                    />
                                     <input
                                        type="text"
                                        value={editStateName}
                                        onChange={(e) => setEditStateName(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => setEditCityId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <>
                                     <span className="city-name">{city.name}, {city.state}</span>
                                    <div className="button-container">
                                        <button onClick={() => handleEditCity(city)}>Edit</button>
                                        <button onClick={() => handleDeleteCity(city.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default JarvisCities;