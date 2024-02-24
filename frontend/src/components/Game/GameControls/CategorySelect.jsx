import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

export const CategorySelect = ({
  categories,
  category,
  handleCategoryChange
}) => {
  const { t } = useTranslation();

  return (
    <Select
      className="mx-2 flex-grow-1 mt-2 mt-lg-0"
      options={categories}
      value={{ label: category.name, value: category.id }}
      onChange={props.handleCategoryChange}
      onCreateOption={handleCategoryChange}
      formatCreateLabel={(inputValue) => `${t('common.add')} "${inputValue}"`}
      isSearchable
      isClearable
    />
  );
};

CategorySelect.propTypes = {
  categories: PropTypes.array,
  category: PropTypes.object,
  handleCategoryChange: PropTypes.func
};
