import { useState, useEffect, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const EmployerAuthContext = createContext();

export const EmployerAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to clear authentication state and localStorage
  const clearAuth = () => {
    localStorage.removeItem('employerToken');
    localStorage.removeItem('employerEmail');
    localStorage.removeItem('employerCompanyName'); // Ensure company_name is cleared
    setIsAuthenticated(false);
    setEmployer(null);
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth on mount, token:', localStorage.getItem('employerToken')); // Debug log
      const token = localStorage.getItem('employerToken');
      if (token && isTokenValid(token)) {
        const decoded = jwtDecode(token);
        await fetchEmployerDetails(decoded.sub || decoded.identity, token);
      } else {
        clearAuth();
      }
    };
    checkAuth().finally(() => setLoading(false));
  }, []);

  const login = async (token, email) => {
    try {
      localStorage.setItem('employerToken', token);
      localStorage.setItem('employerEmail', email);
      setIsAuthenticated(true);
      const decoded = jwtDecode(token);
      await fetchEmployerDetails(decoded.sub || decoded.identity, token);
      console.log('Login successful, employer state updated:', { email, token }); // Debug log
    } catch (error) {
      console.error('Error during login:', error);
      clearAuth();
      throw error;
    }
  };

  const fetchEmployerDetails = async (recruiterId, token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employers/my-role`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.role) {
        setEmployer({
          email: localStorage.getItem('employerEmail'),
          id: recruiterId || data.id || 'default-id', // Fallback if id is missing
          role: data.role,
          company_name: data.company_name || localStorage.getItem('employerCompanyName') || 'Your Company', // Fallback
        });
        setIsAuthenticated(true);
        console.log('Employer details fetched:', data); // Debug log
      } else {
        throw new Error(data.message || 'Failed to fetch employer details');
      }
    } catch (error) {
      console.error('Error fetching employer details:', error);
      clearAuth();
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const isTokenValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp >= currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  return (
    <EmployerAuthContext.Provider value={{ isAuthenticated, employer, login, logout, loading }}>
      {children}
    </EmployerAuthContext.Provider>
  );
};

export const useEmployerAuth = () => {
  return useContext(EmployerAuthContext);
};