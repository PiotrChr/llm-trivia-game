import React from 'react'
import { ProgressBar } from 'react-bootstrap';

const Countdown = ({ secondsLeft, title, showProgressBar }) => {
    return (
      <div>
        <h2>{ title }</h2>
        { secondsLeft > 0 && <p>Question will start in {secondsLeft} seconds</p> }
        { showProgressBar && <ProgressBar now={secondsLeft} max={10} /> }
      </div>
    );
};

Countdown.defaultProps = {
title: 'Loading...'
};

export default Countdown;