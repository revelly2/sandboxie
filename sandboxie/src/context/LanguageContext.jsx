import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('sandboxie-lang') || 'il';
  }); // 'il' for Ilocano, 'en' for English

  const toggleLanguage = () => {
    setLang(prevLang => {
      const newLang = prevLang === 'il' ? 'en' : 'il';
      localStorage.setItem('sandboxie-lang', newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
