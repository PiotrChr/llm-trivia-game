import React from 'react'
import { Button } from 'react-bootstrap'

export const StepControls = ({nextStep, previousStep, submit, t}) => {
    return (
        <div className="d-flex mt-5">
          { previousStep && <Button
            variant="primary"
            className="btn w-auto me-auto"
            onClick={previousStep}
          >
            {t('common.back')}
          </Button> }
          { nextStep && <Button
            variant="primary"
            className="btn w-auto ms-auto"
            onClick={nextStep}
          >
            {t('common.next')}
          </Button> }
          { submit && <Button
            variant="primary"
            type="submit"
            className="btn w-auto ms-auto"
          >
            {t('game_host.create_game')}
          </Button> }
        </div>
    )
}
