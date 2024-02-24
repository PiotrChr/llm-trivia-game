import React from 'react';

export const ResumeGameButton = ({ handleResumeGame }) => {
  <Button
    className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
    onClick={handleResumeGame}
  >
    {/* {t('game.resume_game')} */}
    <i className="bi-play-fill"></i>
  </Button>;
};

ResumeGameButton.propTypes = {
  handleResumeGame: PropTypes.func
};
