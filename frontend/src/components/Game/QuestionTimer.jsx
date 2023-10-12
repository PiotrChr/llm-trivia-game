import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const QuestionTimer = ({ show, timeLimit, elapsed }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="position-absolute d-flex lifelines justify-content-start">
      <button className="lifeline-btn question-counter p-0" onClick={() => {}}>
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
                {remainingTime}
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
