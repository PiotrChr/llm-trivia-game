import React from 'react'

export const StopGameButton = ({ handleStopGame }) => {
    return (
        <Button
            className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
            onClick={handleStopGame}
        >
            {/* {t('game.stop_game')} */}
            <i className="bi-stop-fill"></i>
        </Button>
    )
}

StopGameButton.propTypes = {
    handleStopGame: PropTypes.func
}
