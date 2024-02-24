import React from 'react'

export const ReadyButton = ({handleReady, isReady}) => {
    return (
        <Button
            variant="none"
            onClick={handleReady}
            className={
                'btn-sm mb-0 me-2 mt-2 mt-lg-0 ' +
                (isReady()
                    ? 'disabled btn-success'
                    : 'btn-outline-success'
                )
            }
            >
            {t('game.ready')}
        </Button>
    )
}

ReadyButton.propTypes = {
    handleReady: PropTypes.func,
    isReady: PropTypes.func
}