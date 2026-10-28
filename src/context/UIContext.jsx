import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyGlobalTheme } from '../theme';

const UIContext = createContext({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  setSidebarOpen: () => {},
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('knowiix_theme') || 'dark';
  });
  const location = useLocation();

  // Apply theme to html, body, and CSS tokens
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);

    root.classList.remove('dark', 'light');
    root.classList.add(theme);

    body.classList.remove('dark', 'light');
    body.classList.add(theme);

    root.style.colorScheme = theme;
    localStorage.setItem('knowiix_theme', theme);
    applyGlobalTheme(theme);
  }, [theme]);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const setTheme = (newTheme) => setThemeState(newTheme === 'light' ? 'light' : 'dark');

  return (
    <UIContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar, closeSidebar, theme, toggleTheme, setTheme }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
