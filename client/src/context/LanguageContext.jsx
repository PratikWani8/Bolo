import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../utils/constants';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('bolo_lang') || 'mr';
  });

  useEffect(() => {
    localStorage.setItem('bolo_lang', currentLang);
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const activeLanguageObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Translation helper function
  const t = (key) => {
    const langDict = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS['mr'] || UI_TRANSLATIONS['en'];
    return langDict[key] || UI_TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage: setCurrentLang,
        activeLanguageObj,
        languages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
