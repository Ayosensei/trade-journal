import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  darkNeon: {
    id: 'darkNeon',
    name: 'Dark Neon',
    colors: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#1a1a1a',
      bgTertiary: '#2a2a2a',
      accentPrimary: '#d4ff00',
      accentSecondary: '#00ff88',
      accentDanger: '#ff4444',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      textMuted: '#555555',
      borderPrimary: '#333333',
      borderSecondary: '#222222',
      gradientStart: '#d4ff00',
      gradientEnd: '#00ff88',
    }
  },
  oceanBlue: {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    colors: {
      bgPrimary: '#0a0e1a',
      bgSecondary: '#131b2e',
      bgTertiary: '#1a2942',
      accentPrimary: '#00d4ff',
      accentSecondary: '#0088ff',
      accentDanger: '#ff4466',
      textPrimary: '#e8f4ff',
      textSecondary: '#7da3c6',
      textMuted: '#4a6b8a',
      borderPrimary: '#2a4a6a',
      borderSecondary: '#1a3a5a',
      gradientStart: '#00d4ff',
      gradientEnd: '#0088ff',
    }
  },
  forestGreen: {
    id: 'forestGreen',
    name: 'Forest Green',
    colors: {
      bgPrimary: '#0a1a0a',
      bgSecondary: '#132613',
      bgTertiary: '#1a331a',
      accentPrimary: '#00ff88',
      accentSecondary: '#88ff00',
      accentDanger: '#ff5544',
      textPrimary: '#e8ffe8',
      textSecondary: '#7dc67d',
      textMuted: '#4a8a4a',
      borderPrimary: '#2a5a2a',
      borderSecondary: '#1a4a1a',
      gradientStart: '#00ff88',
      gradientEnd: '#88ff00',
    }
  },
  sunsetPurple: {
    id: 'sunsetPurple',
    name: 'Sunset Purple',
    colors: {
      bgPrimary: '#1a0a1a',
      bgSecondary: '#2a1326',
      bgTertiary: '#3a1a33',
      accentPrimary: '#ff00ff',
      accentSecondary: '#ff8800',
      accentDanger: '#ff4444',
      textPrimary: '#ffe8ff',
      textSecondary: '#c67dc6',
      textMuted: '#8a4a8a',
      borderPrimary: '#5a2a5a',
      borderSecondary: '#4a1a4a',
      gradientStart: '#ff00ff',
      gradientEnd: '#ff8800',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'darkNeon';
  });

  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    
    // Apply theme colors to CSS variables
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }, [currentTheme]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setCursorPosition({ x, y });
      
      document.documentElement.style.setProperty('--cursor-x', `${x}%`);
      document.documentElement.style.setProperty('--cursor-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const switchTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    switchTheme,
    cursorPosition,
    availableThemes: Object.values(themes),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
