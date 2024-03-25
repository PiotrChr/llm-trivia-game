import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

export const LanguageSelect = ({
  languages,
  language,
  handleLanguageChange
}) => {
  return (
    <Select
      className="mx-2 flex-grow-1 mt-2 mt-lg-0"
      options={languages}
      value={{
        label: language.name,
        value: language.iso_code
      }}
      onChange={handleLanguageChange}
      isSearchable
      defaultValue={{ label: 'English', value: 'en' }}
    />
  );
};

LanguageSelect.propTypes = {
  languages: PropTypes.array,
  language: PropTypes.object,
  handleLanguageChange: PropTypes.func
};
