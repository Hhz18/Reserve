
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeColor } from '../types';
import { translations } from '../translations';
import { PALETTES } from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  globalTheme: ThemeColor;
  setGlobalTheme: (theme: ThemeColor) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or default
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('cl_language') as Language) || 'zh';
  });
  
  const [globalTheme, setGlobalThemeState] = useState<ThemeColor>(() => {
    return (localStorage.getItem('cl_theme') as ThemeColor) || 'amber';
  });

  useEffect(() => {
    localStorage.setItem('cl_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cl_theme', globalTheme);
    
    // Inject CSS Variables for Dynamic Theme
    const palette = PALETTES[globalTheme] || PALETTES['amber'];
    const root = document.documentElement;
    root.style.setProperty('--color-app-bg', palette.appBg);
    root.style.setProperty('--color-card-bg', palette.dark);
    root.style.setProperty('--color-accent', palette.light);
    root.style.setProperty('--color-border', palette.border);
    root.style.setProperty('--color-text', palette.text);
    
  }, [globalTheme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setGlobalTheme = (theme: ThemeColor) => {
    setGlobalThemeState(theme);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, globalTheme, setGlobalTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
