import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getToken, setToken, getUser, setUser } from '../utils/getToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setCurrentUser] = useState(getUser());
  const [token, setCurrentToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setCurrentUser(res.data.user);
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setCurrentToken(res.data.token);
      setCurrentUser(res.data.user);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setCurrentToken(res.data.token);
      setCurrentUser(res.data.user);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setCurrentToken(null);
    setCurrentUser(null);
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);