import React from 'react';

export const PauseGameButton = ({ handlePauseGame }) => {
  return (
    <Button
      className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
      onClick={handlePauseGame}
    >
      {/* {t('game.pause_game')} */}
      <i className="bi-pause-fill"></i>
    </Button>
  );
};

PauseGameButton.propTypes = {
  handlePauseGame: PropTypes.func
};
