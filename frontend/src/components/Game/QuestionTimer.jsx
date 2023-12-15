import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import classNames from 'classnames';

const QuestionTimer = ({ show, timeLimit, elapsed, disabled }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="position-absolute d-flex lifelines justify-content-start">
      <button
        className={classNames(
          'lifeline-btn question-counter p-0',
          disabled ? 'inactive' : ''
        )}
        onClick={() => {}}
        disabled={disabled}
      >
        <CountdownCircleTimer
          colors={['#82d616', '#eace25']}
          colorsTime={[timeLimit, 0]}
          duration={timeLimit}
          elapsedTime={elapsed}
          isPlaying
          size={48}
          strokeWidth={5}
        >
          {({ remainingTime }) => (
            <>
              <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                {disabled ? '∞' : remainingTime}
              </p>
            </>
          )}
        </CountdownCircleTimer>
      </button>
    </div>
  );
};

QuestionTimer.defaultProps = {
  timeLimit: 0,
  show: false
};

export default QuestionTimer;
