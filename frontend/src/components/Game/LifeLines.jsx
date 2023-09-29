import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBalanceScale,
  faTimes,
  faLightbulb,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';

const Lifelines = ({ show, lifelines }) => {
  if (!show) {
    return null;
  }

  const handle5050 = () => {
    console.log('5050');
  };

  const handleRemoveOne = () => {
    console.log('remove one');
  };

  const handleHint = () => {
    console.log('hint');
  };

  const handleStatsLookup = () => {
    console.log('stats lookup');
  };

  return (
    <div className="position-absolute d-flex lifelines justify-content-center justify-content-lg-start">
      <button className="lifeline-btn" onClick={handle5050}>
        <FontAwesomeIcon icon={faBalanceScale} />
      </button>

      <button className="lifeline-btn" onClick={handleRemoveOne}>
        <strong>-1</strong>
      </button>

      <button className="lifeline-btn" onClick={handleHint}>
        <FontAwesomeIcon icon={faLightbulb} />
      </button>

      <button className="lifeline-btn" onClick={handleStatsLookup}>
        <FontAwesomeIcon icon={faChartBar} />
      </button>
    </div>
  );
};

export default Lifelines;
