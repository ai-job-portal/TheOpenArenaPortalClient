// client/src/components/JobPost.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployerAuth } from '../hooks/useEmployerAuth';
import { useUI } from '../context/UIContext';
import './SubmitButton.css';
import './JobPost.css';
import Loader from './Loader.js';

function JobPost() {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [workplaceType, setWorkplaceType] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [locations, setLocations] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [postDate, setPostDate] = useState('');
    const [totalOpenings, setTotalOpenings] = useState('');
    const [experienceMin, setExperienceMin] = useState('');
    const [experienceMax, setExperienceMax] = useState('');
    const [educationInput, setEducationInput] = useState('');
    const [educations, setEducations] = useState([]);
    const [educationSuggestions, setEducationSuggestions] = useState([]);
    const [showEducationSuggestions, setShowEducationSuggestions] = useState(false);
    const [skillsInput, setSkillsInput] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillsSuggestions, setSkillsSuggestions] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [aboutCompany, setAboutCompany] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const educationInputRef = useRef(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useEmployerAuth();
    const { showToast } = useUI();
    const [degreeTypes, setDegreeTypes] = useState();
    const [selectedDegreeType, setSelectedDegreeType] = useState(null);
    const [specialisations, setSpecialisations] = useState();
    const [selectedSpecialisation, setSelectedSpecialisation] = useState(null);
    const [subtypes, setSubtypes] = useState();
    const [selectedSubtype, setSelectedSubtype] = useState(null);
    const [showQualifications, setShowQualifications] = useState(false);
  

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/employers/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch location suggestions
    useEffect(() => {
        if (locationInput.length > 1) {
            const fetchSuggestions = async () => {
                try {
                    const token = localStorage.getItem('employerToken');
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jarvis/api/cities?q=${locationInput}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    const data = await response.json();
                    setLocationSuggestions(data.filter(suggestion => 
                        !locations.some(loc => loc.id === suggestion.id)
                    ));
                } catch (err) {
                    console.error('Error fetching location suggestions:', err);
                }
            };
            fetchSuggestions();
        } else {
            setLocationSuggestions([]);
        }
    }, [locationInput, locations]);

    

    useEffect(() => {
        const fetchDegreeTypes = async () => {
            try {
                const token = localStorage.getItem('employerToken');
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jarvis/api/qualifications/jobpost`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                setDegreeTypes(data);
            } catch (err) {
                console.error('Error fetching degree types:', err);
            }
        };
        fetchDegreeTypes();
    },[educationInput]);

    const fetchSpecialisations = async (degreeType) => {
        try {
            Loader.show("Fetching Specializations...");
            const token = localStorage.getItem('employerToken');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jarvis/api/qualifications/jobpost?degree_type=${degreeType}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.length === 0) {
                setSpecialisations(null);
                setEducations([...educations, { id: degreeType.id, name: `${degreeType}` }]);
            } else {
                setSpecialisations(data);
            }
        } catch (err) {
            console.error('Error fetching specialisations:', err);
        } finally {
            Loader.hide(); // Hide loader regardless of success or failure
        }
    };

    const handleDegreeTypeChange = (e) => {
        const degreeType = e.target.value;
        setSelectedSpecialisation(null);
        setSelectedSubtype(null);
        if (degreeType) {
            if (educations.some(edu => edu.name === `${degreeType}`)) {
                showToast('Qualification already selected.', 'error');
                return; // Prevent adding the duplicate
            }
            fetchSpecialisations(degreeType);
        } else {
            setSpecialisations(null);
        }
    };

    const fetchSubtypes = async (specialisationType) => {
        try {
            Loader.show("Fetching SubTypes...");
            const token = localStorage.getItem('employerToken');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jarvis/api/qualifications/jobpost?degree_type=${selectedDegreeType}&specialisation=${specialisationType}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if(data.length === 0) {
                setSubtypes(null);
                setEducations([...educations, { id: specialisationType.id, name: `${specialisationType}` }]);                    
            } else{
            setSubtypes(data);
            }
        } catch (err) {
            console.error('Error fetching subtypes:', err);
        } finally {
            Loader.hide(); // Hide loader regardless of success or failure
        }
    };

    const handleSpecializationTypeChange = (e) => {
        const specialisationType = e.target.value;
        setSelectedSubtype(null);
        if (specialisationType) {
            if (educations.some(edu => edu.name === `${specialisationType}`)) {
                showToast('Qualification already selected.', 'error');
                return; // Prevent adding the duplicate
            }
            fetchSubtypes(specialisationType);
        } else {
            setSubtypes(null);
        }
    };

    const handleSubTypeChange = (e) => {
        const subType = e.target.value;
        setSelectedSubtype(null);
        if (subType) {
            // Check if the education already exists
            if (educations.some(edu => edu.name === `${subType}`)) {
                showToast('Qualification already selected.', 'error');
                return; // Prevent adding the duplicate
            }
            setEducations([...educations, { id: subType.id, name: `${subType}` }]);
        }
    };
    

    // Fetch skills suggestions
    useEffect(() => {
        if (skillsInput.length > 1) {
            const fetchSuggestions = async () => {
                try {
                    const token = localStorage.getItem('employerToken');
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jarvis/api/skills?q=${skillsInput}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    const data = await response.json();
                    setSkillsSuggestions(data.filter(suggestion => 
                        !skills.some(skill => skill.id === suggestion.id)
                    ));
                } catch (err) {
                    console.error('Error fetching skills suggestions:', err);
                }
            };
            fetchSuggestions();
        } else {
            setSkillsSuggestions([]);
        }
    }, [skillsInput, skills]);

    const handleNext = () => {
        if (locations.length === 0) {
            setError('Please select at least one location.');
            return;
        }
        setError(null);
        setStep(2);
        setShowQualifications(true); // Show qualifications on step 2
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleLocationSelect = (suggestion) => {
        setLocations([...locations, suggestion]);
        setLocationInput('');
        setLocationSuggestions([]);
    };


    const handleLocationRemove = (id) => {
        setLocations(locations.filter(loc => loc.id !== id));
    };


    const handleEducationRemove = (name) => {
        setEducations(educations.filter(edu => edu.name !== name));
    };

    const handleSkillSelect = (suggestion) => {
        setSkills([...skills, suggestion]);
        setSkillsInput('');
        setSkillsSuggestions([]);
    };

    const handleSkillRemove = (id) => {
        setSkills(skills.filter(skill => skill.id !== id));
    };
  

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const token = localStorage.getItem('employerToken');
        if (!token) {
            setError('Not logged in.');
            setLoading(false);
            return;
        }

        if (skills.length === 0) {
            setError('Please select at least one skill.');
            setLoading(false);
            return;
        }

        const jobData = {
            title,
            company_name: companyName,
            experience_level: `${experienceMin}-${experienceMax}`,
            salary_range: `${salaryMin}-${salaryMax} INR`,
            workplace_type: workplaceType,
            employment_type: employmentType,
            location: locations.map(loc => loc.name).join(', '),
            educational_qualifications: educations.map(edu => edu.name).join(', '),
            skills: skills.map(skill => skill.name).join(', '),
            about_company: aboutCompany,
            post_date: postDate || new Date().toISOString().split('T')[0],
            total_openings: totalOpenings,
            description,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(jobData),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Job posted successfully!', 'success');
                navigate('/employer-jobs');
            } else {
                const errorMessage = data.message || 'Job posting failed';
                setError(errorMessage);
                showToast(errorMessage, 'error');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            showToast('An unexpected error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="registration-container">
            <div className="quote-container">
                <p className="quote">
                    Connect with top talent—post your job today and build your dream team!
                </p>
            </div>
            <div className="form-container register-form wide-form">
                <h2>Post a New Job</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="step-indicator">
                    <span className={step === 1 ? 'active-step' : ''}>Step 1: Job Details</span>
                    <span className={step === 2 ? 'active-step' : ''}>Step 2: Additional Information</span>
                </div>
                {step === 1 && (
                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <h3>Job Details</h3>
                        <p className="form-info-text">
                            Provide the essential details of the job you’re posting.
                        </p>
                        <div className="form-group">
                            <label htmlFor="title"><strong>Job Title</strong> <span className="required">*</span></label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Senior Test Analyst"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description"><strong>Job Description</strong> <span className="required">*</span></label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="workplaceType"><strong>Workplace Type</strong> <span className="required">*</span></label>
                            <select
                                id="workplaceType"
                                value={workplaceType}
                                onChange={(e) => setWorkplaceType(e.target.value)}
                                required
                            >
                                <option value="">Select</option>
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="employmentType"><strong>Employment Type</strong> <span className="required">*</span></label>
                            <select
                                id="employmentType"
                                value={employmentType}
                                onChange={(e) => setEmploymentType(e.target.value)}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label><strong>Salary Range (INR)</strong> <span className="required">*</span></label>
                            <div className="range-input">
                                <input
                                    type="number"
                                    value={salaryMin}
                                    onChange={(e) => setSalaryMin(e.target.value)}
                                    placeholder="Min"
                                    min="0"
                                    required
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    value={salaryMax}
                                    onChange={(e) => setSalaryMax(e.target.value)}
                                    placeholder="Max"
                                    min={salaryMin || 0}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="locations"><strong>Location(s)</strong> <span className="required">*</span>{locations.length === 0 && <small>Select at least one location</small>}</label>
                            <div className="selected-items" style={{ marginBottom: '5px' }}>
                                {locations.map(loc => (
                                    <div key={loc.id} className="selected-item">
                                        {loc.name}
                                        <span className="remove-item" onClick={() => handleLocationRemove(loc.id)}>×</span>
                                    </div>
                                ))}
                            </div>
                            
                            <input
                                type="text"
                                id="locations"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                placeholder="Type to search cities"
                            />
                            {locationSuggestions.length > 0 && (
                                <ul className="suggestions-dropdown">
                                    {locationSuggestions.map(suggestion => (
                                        <li
                                            key={suggestion.id}
                                            onClick={() => handleLocationSelect(suggestion)}
                                            className="suggestion-item"
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="postDate"><strong>Post Date</strong></label>
                            <input
                                type="date"
                                id="postDate"
                                value={postDate}
                                onChange={(e) => setPostDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="totalOpenings"><strong>Total Openings</strong></label>
                            <input
                                type="number"
                                id="totalOpenings"
                                value={totalOpenings}
                                onChange={(e) => setTotalOpenings(e.target.value)}
                                placeholder="e.g., 5"
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={loading} className="submit-button submit-button-employer">
                                {loading ? 'Next...' : 'Next'}
                            </button>
                        </div>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleSubmit}>
                        <h3>Additional Information</h3>
                        <p className="form-info-text">
                            Add qualifications, skills, and company details to complete your job posting.
                        </p>
                        <div className="form-group">
                            <label><strong>Experience Level (Years)</strong> <span className="required">*</span></label>
                            <div className="range-input">
                                <input
                                    type="number"
                                    value={experienceMin}
                                    onChange={(e) => setExperienceMin(e.target.value)}
                                    placeholder="Min"
                                    min="0"
                                    required
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    value={experienceMax}
                                    onChange={(e) => setExperienceMax(e.target.value)}
                                    placeholder="Max"
                                    min={experienceMin || 0}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="education"><strong>Educational Qualifications</strong><small>Leave blank if not required</small></label>
                            <div className="selected-items" style={{ marginBottom: '5px' }}>
                                {educations.map(edu => (
                                    <div key={edu.name} className="selected-item">
                                        {edu.name}
                                        <span className="remove-item" onClick={() => handleEducationRemove(edu.name)}>×</span>
                                    </div>
                                ))}
                            </div>
                            <div> {/* Wrap the dropdowns in a div for better styling */}
                                <select value={selectedDegreeType || ""} onChange={(e) => {
                                    setSelectedDegreeType(e.target.value);
                                    handleDegreeTypeChange(e);
                                }}>
                                    <option value="">Select Degree Type</option>
                                    {degreeTypes.map(degree => (
                                        <option key={degree.id} value={degree.name}>{degree.name}</option>
                                    ))}
                                </select>

                                {selectedDegreeType && ( specialisations!==null && specialisations!==undefined) && (
                                    <select value={selectedSpecialisation || ""} onChange={(e) => {
                                        setSelectedSpecialisation(e.target.value);
                                        handleSpecializationTypeChange(e);
                                    }
                                    }>
                                        <option value="">Select Specialisation</option>
                                        {(specialisations || []).map(spec => (
                                            <option key={spec.id} value={spec.name}>{spec.name}</option>
                                        ))}
                                    </select>
                                )}

                                {selectedSpecialisation && ( subtypes!==null && subtypes!==undefined) && (
                                    <select value={selectedSubtype || ""} onChange={(e) => {
                                        setSelectedSubtype(e.target.value);
                                        handleSubTypeChange(e);
                                    }
                                    }>
                                        <option value="">Select Subtype</option>
                                        {(subtypes || []).map(sub => (
                                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="skills"><strong>Skills and Competencies</strong> <span className="required">*</span>{skills.length === 0 && <small>Select at least one skill</small>}</label>
                            <div className="selected-items" style={{ marginBottom: '5px' }}>
                                {skills.map(skill => (
                                    <div key={skill.id} className="selected-item">
                                        {skill.name}
                                        <span className="remove-item" onClick={() => handleSkillRemove(skill.id)}>×</span>
                                    </div>
                                ))}
                            </div>                            
                            <input
                                type="text"
                                id="skills"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                placeholder="Type to search skills"
                            />
                            {skillsSuggestions.length > 0 && (
                                <ul className="suggestions-dropdown">
                                    {skillsSuggestions.map(suggestion => (
                                        <li
                                            key={suggestion.id}
                                            onClick={() => handleSkillSelect(suggestion)}
                                            className="suggestion-item"
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="companyName"><strong>Company Name</strong> <span className="required">*</span></label>
                            <input
                                type="text"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="aboutCompany"><strong>About Company</strong></label>
                            <textarea
                                id="aboutCompany"
                                value={aboutCompany}
                                onChange={(e) => setAboutCompany(e.target.value)}
                                placeholder="Brief description of the company"
                            />
                        </div>
                        <div className="form-group button-group">
                            <button type="button" onClick={handleBack} className="submit-button submit-button-employer back-button">
                                Back
                            </button>
                            <button type="submit" disabled={loading} className="submit-button submit-button-employer">
                                {loading ? 'Posting...' : 'Post Job'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default JobPost;