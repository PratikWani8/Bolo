import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bolo_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authAPI.getMe();
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Auth token verification notice:', err.message);
        // Clean invalid token
        localStorage.removeItem('bolo_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('bolo_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      localStorage.setItem('bolo_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('bolo_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (updates) => {
    const res = await authAPI.updateProfile(updates);
    if (res.data.success) {
      setUser(res.data.user);
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isCitizen: user?.role === 'citizen',
        isVolunteer: user?.role === 'volunteer',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
