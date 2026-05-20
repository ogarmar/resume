import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeToggle;