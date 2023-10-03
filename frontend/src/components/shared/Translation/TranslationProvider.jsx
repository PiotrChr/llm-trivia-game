import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
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

    i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        lng: currentLanguage,
        fallBackLng: 'en',
        interpolation: {
          escapeValue: false
        }
      });
  }, [currentLanguage]);

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
