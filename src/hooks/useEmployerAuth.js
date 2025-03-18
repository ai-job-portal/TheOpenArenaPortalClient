import { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployerAuthContext = createContext(null);

export const EmployerAuthProvider = ({ children }) => {
    const [employerUser, setEmployerUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

    // Add state to cache the CSRF token
    const [csrfToken, setCsrfToken] = useState(null);

    // Fetch CSRF token only when needed
    const fetchCsrfToken = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/securemyself/v1/secure/csrf`, {
                withCredentials: true
            });
            if (response.status === 200) {
                const token = response.data.token; // Adjust based on your API response structure
                setCsrfToken(token);
                return token;
            }
            return null;
        } catch (error) {
            console.error("Error fetching CSRF token:", error);
            setCsrfToken(null);
            return null;
        }
    }, [API_BASE_URL]);

    // Get CSRF token, using cached value if available
    const getCsrfToken = useCallback(async () => {
        if (csrfToken) {
            return csrfToken;
        }
        return await fetchCsrfToken();
    }, [csrfToken, fetchCsrfToken]);

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: API_BASE_URL,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });

        instance.interceptors.request.use(
            async (config) => {
                if (config.url !== '/securemyself/v1/secure/csrf') {
                    const token = await getCsrfToken();
                    if (token) {
                        config.headers['X-XSRF-TOKEN'] = token;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 403 && csrfToken) {
                    setCsrfToken(null);
                    const token = await fetchCsrfToken();
                    if (token) {
                        error.config.headers['X-XSRF-TOKEN'] = token;
                        return instance(error.config);
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [API_BASE_URL, getCsrfToken, fetchCsrfToken, csrfToken]);

    // Fetch CSRF token on initial load
    useEffect(() => {
        if (!csrfToken && !loading) {
            fetchCsrfToken();
        }
    }, [fetchCsrfToken, csrfToken, loading]);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setEmployerUser(null);
            setIsAuthenticated(false);
            setCsrfToken(null); // Clear CSRF token on logout
            navigate('/employers/login');
        }
    }, [navigate, api]);

    const refreshAccessToken = useCallback(async () => {
        try {
            console.log("Attempting token refresh");
            const response = await api.post('/auth/refresh');
            if (response.status === 200) {
                if (response.data && response.data.username) {
                    setEmployerUser(prevUser => ({
                        ...prevUser,
                        username: response.data.username,
                        role: response.data.role
                    }));
                }
                return true;
            }
            throw new Error('Token refresh failed');
        } catch (err) {
            console.error("Refresh token error:", err);
            setError(err.response?.data?.message || err.message || 'Refresh token failed');
            await logout();
            return false;
        }
    }, [api, logout]);

    const authFetch = useCallback(async (url, options = {}) => {
        try {
            const response = await api(url, options);
            return response;
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    return api(url, options);
                }
                throw new Error('Authentication failed after token refresh');
            }
            throw err;
        }
    }, [api, refreshAccessToken]);

    const checkAuth = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authFetch('/users/me');
            if (response.status === 200 && 
                (response.data.role === 'employer' || response.data.role === 'recruiter')) {
                setEmployerUser(response.data);
                setIsAuthenticated(true);
            } else {
                throw new Error('Invalid role or authentication');
            }
        } catch (err) {
            console.error("Auth check error:", err);
            setError(err.response?.data?.message || err.message || 'Authentication check failed');
            setEmployerUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(async (usernameOrEmail, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/employer/login', {
                usernameOrEmail,
                password
            });

            if (response.status === 200 && 
                (response.data.role === 'employer' || response.data.role === 'recruiter')) {
                setEmployerUser(response.data);
                setIsAuthenticated(true);
                navigate('/employer/dashboard');
                return true;
            }
            throw new Error('Invalid role or login failed');
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || err.message || 'Login failed');
            setEmployerUser(null);
            setIsAuthenticated(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, [api, navigate]);

    const value = {
        user: employerUser,
        isAuthenticated,
        login,
        logout,
        loading,
        error,
        authFetch,
        checkAuth
    };

    return (
        <EmployerAuthContext.Provider value={value}>
            {children}
        </EmployerAuthContext.Provider>
    );
};

export const useEmployerAuth = () => {
    const context = useContext(EmployerAuthContext);
    if (!context) {
        throw new Error('useEmployerAuth must be used within an EmployerAuthProvider');
    }
    return context;
};