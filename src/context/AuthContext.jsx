import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.timeout = 10000;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('codearena_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (admin?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [admin]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      const isAdminAttempt = email.toLowerCase().includes('admin');
      if (isAdminAttempt) {
        try {
          response = await axios.post('/api/v1/auth/admin/login', { email, password });
        } catch (adminErr) {
          response = await axios.post('/api/v1/auth/login', { email, password });
        }
      } else {
        response = await axios.post('/api/v1/auth/login', { email, password });
      }
      const { access_token, user } = response.data;
      const userData = { ...user, token: access_token };
      setAdmin(userData);
      localStorage.setItem('codearena_admin', JSON.stringify(userData));
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      let errMsg = err.response?.data?.detail;
      if (!errMsg) {
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errMsg = 'Connection timed out. The backend server took too long to respond.';
        } else if (err.message === 'Network Error') {
          errMsg = 'Cannot reach backend server. Please check if FastAPI is running on port 8000.';
        } else {
          errMsg = 'Invalid email or password. Please verify your credentials.';
        }
      }
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/auth/register', userData);
      const { access_token, user } = response.data;
      const registeredUser = { ...user, token: access_token };
      setAdmin(registeredUser);
      localStorage.setItem('codearena_admin', JSON.stringify(registeredUser));
      setLoading(false);
      return { success: true, user: registeredUser };
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Registration failed. Please check your details.';
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('codearena_admin');
  };

  const updateAdmin = (updatedFields) => {
    setAdmin(prev => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('codearena_admin', JSON.stringify(next));
      return next;
    });
  };

  const loginWithSession = (userData) => {
    setAdmin(userData);
    localStorage.setItem('codearena_admin', JSON.stringify(userData));
    if (userData?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, register, logout, updateAdmin, loginWithSession, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
