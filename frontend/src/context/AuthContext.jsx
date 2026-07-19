import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const resData = await response.json();
          setUser(resData.data.user);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        // Do not remove token immediately on network failure, just reset user
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Handle user login.
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Login failed. Please try again.');
      }

      // Assuming the backend returns { token, user } or just user data
      const token = resData.data.token || resData.token;
      const userObj = resData.data.user || resData.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(userObj);
      return userObj;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Handle user registration.
   * @param {Object} userData - Registration details
   */
  const signup = async (userData) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Registration failed. Please try again.');
      }

      localStorage.setItem('token', resData.data.token);
      setUser(resData.data.user);
      return resData.data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Handle user logout.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
