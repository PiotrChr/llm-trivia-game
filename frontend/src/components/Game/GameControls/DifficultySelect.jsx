import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

export const DifficultySelect = ({
  difficultyOptions,
  handleDifficultyChange,
  difficulty
}) => {
  return (
    <Select
      className="mx-2 flex-grow-1 mt-2 mt-lg-0"
      options={difficultyOptions}
      value={difficultyOptions[difficulty - 1]}
      onChange={handleDifficultyChange}
    />
  );
};

DifficultySelect.propTypes = {
  difficultyOptions: PropTypes.array,
  handleDifficultyChange: PropTypes.func,
  difficulty: PropTypes.number
};
