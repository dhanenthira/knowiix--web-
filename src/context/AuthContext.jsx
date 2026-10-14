import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      setError(err.response?.data?.detail || 'Invalid credentials');
      setLoading(false);
      return { success: false, error: err.response?.data?.detail };
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

  return (
    <AuthContext.Provider value={{ admin, login, register, logout, updateAdmin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
