import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Auto-login on mount if session exists
  useEffect(() => {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (session) {
      try {
        const userData = JSON.parse(session);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user session:', error);
        localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      }
    }
  }, []);

  const login = (username = 'Trader') => {
    const userData = {
      username,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
