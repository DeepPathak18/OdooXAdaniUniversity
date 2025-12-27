import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');
  const [isSystemTheme, setIsSystemTheme] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
      setIsSystemTheme(false);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      setIsSystemTheme(true);
      localStorage.setItem('theme', systemTheme);
      applyTheme(systemTheme);
    }
    
    setIsLoaded(true);
  }, []);

  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${newTheme}`);
    
    // Also set a data attribute on body for additional styling
    document.body.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Add smooth transition
    document.documentElement.classList.add('theme-transition');
    
    // Update state and storage
    setTheme(newTheme);
    setIsSystemTheme(false);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme
    applyTheme(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
    
    return newTheme;
  };

  const setSystemTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    
    setTheme(systemTheme);
    setIsSystemTheme(true);
    localStorage.removeItem('theme'); // Remove saved theme to use system preference
    
    applyTheme(systemTheme);
    
    return systemTheme;
  };

  const setCustomTheme = (newTheme) => {
    setTheme(newTheme);
    setIsSystemTheme(false);
    localStorage.setItem('theme', newTheme);
    
    applyTheme(newTheme);
    
    return newTheme;
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (isSystemTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  return {
    theme,
    isSystemTheme,
    toggleTheme,
    setSystemTheme,
    setCustomTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isLoaded
  };
};
