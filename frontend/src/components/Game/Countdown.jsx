import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Countdown = ({ secondsLeft, title, showProgressBar, secondsTotal }) => {
  return (
    <div>
      {showProgressBar && (
        <CountdownCircleTimer
          // initialRemainingTime={secondsLeft}
          colors={['#82d616', '#eace25']}
          colorsTime={[secondsTotal, 0]}
          duration={secondsTotal}
          isPlaying
        >
          {({ remainingTime }) => (
            <>
              {title && <p>{title}</p>}
              <p>{remainingTime}</p>
            </>
          )}
        </CountdownCircleTimer>
      )}
    </div>
  );
};

Countdown.defaultProps = {
  title: 'Loading...',
  secondsTotal: 1,
  showProgressBar: false,
  secondsLeft: 0
};

export default Countdown;
