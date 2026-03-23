import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  // Comprehensive default state based on backend schema
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    emailNotifications: { messages: true, updates: true, promotions: false },
    pushNotifications: { messages: true, mentions: true },
    privacy: { profileVisibility: 'public', showEmail: false },
    twoFactorAuth: false
  });
  const [loading, setLoading] = useState(false);

  // Apply theme to HTML root element for Tailwind Dark Mode
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const fetchSettings = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/settings", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      });
      if (res.data.success && res.data.settings) {
        // Merge fetched with defaults to ensure all keys exist
        setSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates) => {
    // Determine optimistic update logic (handling nested objects dynamically)
    const newSettings = { ...settings };
    
    for (const key in updates) {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
        newSettings[key] = { ...newSettings[key], ...updates[key] };
      } else {
        newSettings[key] = updates[key];
      }
    }
    
    try {
      setSettings(newSettings); // Optimistic UI update
      
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:4000/api/settings", newSettings, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      fetchSettings(); // Revert on failure
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [isAuthenticated]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
