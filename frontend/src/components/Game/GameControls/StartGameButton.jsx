import React from 'react'

export const StartGameButton = ({ handleStartGame }) => {
    return (
        <Button
            className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
            onClick={handleStartGame}
        >
            {/* {t('game.start_game')} */}
            <i className="bi-play-fill"></i>
        </Button>
    )
}

StartGameButton.propTypes = {
    handleStartGame: PropTypes.func
}