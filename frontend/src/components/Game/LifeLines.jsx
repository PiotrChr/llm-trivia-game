import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBalanceScale,
  faTimes,
  faLightbulb,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const matchIcon = (name) => {
  switch (name) {
    case 'fiftyFifty':
      return faBalanceScale;
    case 'eliminateOne':
      return faTimes;
    case 'hint':
      return faLightbulb;
    case 'askStats':
      return faChartBar;
    default:
      return null;
  }
};

const Lifelines = ({
  show,
  lifelines,
  className,
  style,
  onLifelineSelected
}) => {
  if (!show) {
    return null;
  }
  const handleLifeline = (name) => {
    onLifelineSelected(name);
  };

  return (
    <div
      className={classNames(
        'position-absolute d-flex lifelines justify-content-center justify-content-lg-start',
        className
      )}
      style={style}
    >
      {lifelines.map((lifeline) => {
        console.log(lifeline);
        return (
          <button
            className={classNames(
              'lifeline-btn',
              lifeline.count === 0 ? 'inactive' : ''
            )}
            key={lifeline.id}
            onClick={
              lifeline.count > 0 ? () => handleLifeline(lifeline.name) : null
            }
          >
            <FontAwesomeIcon icon={matchIcon(lifeline.name)} />
            <span className="lifeline-amount">{lifeline.count}</span>
          </button>
        );
      })}
    </div>
  );
};

Lifelines.defaultProps = {
  lifelines: [],
  show: false,
  onLifelineSelected: () => {}
};

export default Lifelines;
