import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  clearTokens,
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUserApi
} from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const userData = await getCurrentUserApi();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    const handleLogoutEvent = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password, rememberMe) => {
    const data = await loginApi(email, password, rememberMe);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, confirmPassword, rememberMe) => {
    const data = await registerApi(name, email, password, confirmPassword, rememberMe);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
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
