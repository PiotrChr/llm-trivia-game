import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from './i18n';
import { getLanguages } from '../../../services/api';

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const fetchLanguages = async () => {
      const result = await getLanguages();
      setLanguages(
        result.data.map((language) => ({
          label: language.name,
          value: language.iso_code
        }))
      );
    };

    fetchLanguages();
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <TranslationContext.Provider
      value={{ languages, currentLanguage, changeLanguage }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  return useContext(TranslationContext);
};
