import React from 'react';
import { useTranslationContext } from './TranslationProvider';
import { Dropdown } from 'react-bootstrap';

const LanguageDropdown = () => {
  const { languages, currentLanguage, changeLanguage } =
    useTranslationContext();

  const handleImageError = (e) => {
    e.target.src = 'static/img/flags/placeholder.svg';
  };

  return (
    <Dropdown id="language-dropdown-menu">
      <Dropdown.Toggle
        variant="primary"
        id="language-dropdown"
        className="btn-sm btn-round mb-0 me-2 ms-2"
      >
        {currentLanguage}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {languages.map((language) => (
          <Dropdown.Item
            key={language.value}
            onClick={() => changeLanguage(language.value)}
            className="d-flex flex-row justify-content-center align-items-center"
          >
            <img
              className="flag-img"
              src={`static/img/flags/1x1/${language.value}.svg`}
              onError={handleImageError}
            />
            <span className="language-label">{language.label}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageDropdown;
