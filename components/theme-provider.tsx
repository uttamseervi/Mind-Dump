'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  // Initialize theme based on local storage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Apply theme to html element
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, [prefersDark]);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // We expose the theme and toggle function through window for other components to use
  useEffect(() => {
    window.toggleTheme = toggleTheme;
    window.currentTheme = theme;
  }, [theme]);

  return <>{children}</>;
}