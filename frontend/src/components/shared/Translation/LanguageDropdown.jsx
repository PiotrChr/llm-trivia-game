import React, { useState } from 'react';
import { useTranslationContext } from './TranslationProvider';
import { Dropdown } from 'react-bootstrap';

const LanguageDropdown = () => {
  const { languages, currentLanguage, changeLanguage } =
    useTranslationContext();
  const [filter, setFilter] = useState('');

  const handleImageError = (e) => {
    e.target.src = '/static/img/flags/placeholder.svg';
  };

  const filteredLanguages = languages.filter((language) =>
    language.label.toLowerCase().startsWith(filter.toLowerCase())
  );

  return (
    <Dropdown id="language-dropdown-menu">
      <Dropdown.Toggle
        variant="primary"
        id="language-dropdown"
        className="btn-sm btn-round mb-0 me-2 ms-2"
      >
        <img
          className="flag-img"
          src={`/static/img/flags/1x1/${currentLanguage}.svg`}
          onError={handleImageError}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="language-filter-input form-control-sm m-2 mb-3"
        />
        <div className="scrollable-area">
          {filteredLanguages.map((language) => (
            <Dropdown.Item
              key={language.value}
              onClick={() => changeLanguage(language.value)}
              className="d-flex flex-row justify-content-center align-items-center"
            >
              <img
                className="flag-img"
                src={`/static/img/flags/1x1/${language.value}.svg`}
                onError={handleImageError}
              />
              <span className="language-label">{language.label}</span>
            </Dropdown.Item>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageDropdown;
