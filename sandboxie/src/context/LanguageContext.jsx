import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('il'); // 'il' for Ilocano, 'en' for English

  const toggleLanguage = () => {
    setLang(prevLang => prevLang === 'il' ? 'en' : 'il');
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
