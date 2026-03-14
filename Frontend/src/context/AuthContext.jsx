import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastPath, setLastPath] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedPath = localStorage.getItem('lastPath');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    if (storedPath) {
      setLastPath(storedPath);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setLastPath(null);
    localStorage.removeItem('user');
    localStorage.removeItem('lastPath');
    localStorage.removeItem("token");
  };

  const updateLastPath = (path) => {
    setLastPath(path);
    localStorage.setItem('lastPath', path);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateLastPath,
    lastPath,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
