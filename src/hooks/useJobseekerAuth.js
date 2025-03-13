// client/src/hooks/useJobseekerAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const JobseekerAuthContext = createContext(null);

export const JobseekerAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [jobseeker, setJobseeker] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshAccessToken = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Good practice, even for empty body
                },
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                // Successfully refreshed.  The server has set the new access token cookie.
                // We don't need to do anything here *except* update the authenticated state.
                setIsAuthenticated(true);
                return true;
            } else {
                console.error('Refresh token failed:', response.status, response.statusText);
                logout(); // Logout if refresh fails.
                return false;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout(); // Logout on network error
            return false;
        }
    };

    // Initial authentication check (using /api/users/me)
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                // Use /api/users/me to check authentication status *and* get user data
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/me`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setJobseeker(data); // Set the user data
                } else {
                    setIsAuthenticated(false);
                    setJobseeker(null);
                }
            } catch (error) {
                // Network errors or server errors
                console.error("Error checking auth:", error);
                setIsAuthenticated(false);
                setJobseeker(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []); // Run only on mount



  const login = () => {
    //We just need to set the is Authenticated true, no need to use Cookie.
    //Cookies will be manged by browser
     setIsAuthenticated(true);

  };

  const logout = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Send cookies
      });

      if (response.ok) {
          //  Update state: user is logged out
          setIsAuthenticated(false);
          setJobseeker(null);
          // Cookies are cleared by the server, so we don't need to do it here.
        } else {
           // Even if backend fails, clear frontend.
            console.error("Logout failed", response.status);
             setIsAuthenticated(false);
              setJobseeker(null);
        }
    } catch(error){
       //Even if backend fails, clear frontend.
        console.error("Logout failed", error);
        setIsAuthenticated(false);
        setJobseeker(null);
    }
  };

    //  make authenticated requests, handling token refresh
    const authFetch = async (url, options = {}) => {
        // We don't need to get the accessToken from a cookie here!  The browser
        // will automatically include it because of `credentials: 'include'`.

        const defaultHeaders = {
            'Content-Type': 'application/json',
            // NO Authorization header here!
        };

        const headers = { ...defaultHeaders, ...options.headers };
        const fetchOptions = { ...options, headers, credentials: 'include' }; // Keep credentials

        let response = await fetch(url, fetchOptions);

        if (response.status === 401) {
            // Attempt to refresh the token
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry the original request.  Again, the browser sends the new cookie automatically.
                response = await fetch(url, fetchOptions); // Use the SAME options
            } else {
                // Refresh failed
                throw new Error('Session Expired. Please login again.');
            }
        }

        return response;
    };


    return (
        <JobseekerAuthContext.Provider value={{ isAuthenticated, jobseeker, login, logout, authFetch, loading }}>
            {children}
        </JobseekerAuthContext.Provider>
    );
};

export const useJobseekerAuth = () => useContext(JobseekerAuthContext);