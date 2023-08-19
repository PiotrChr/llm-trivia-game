import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const Countdown = ({ secondsLeft, title, showProgressBar, secondsTotal }) => {
  return (
    <div>
      <h2>{title}</h2>
      {secondsLeft > 0 && <p>Question will start in {secondsLeft} seconds</p>}
      {showProgressBar && <ProgressBar now={secondsLeft} max={secondsTotal} />}
    </div>
  );
};

Countdown.defaultProps = {
  title: 'Loading...',
  secondsTotal: 10
};

export default Countdown;
