import React from 'react';
import { useTranslationContext } from './TranslationProvider';

const LanguageDropdown = () => {
  const { languages, currentLanguage, changeLanguage } =
    useTranslationContext();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageDropdown;
