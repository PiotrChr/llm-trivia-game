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

  return (
    <>
      <button className="lifeline-btn" onClick={your5050Function}>
        <FontAwesomeIcon icon={faBalanceScale} />
      </button>

      <button className="lifeline-btn" onClick={yourRemoveOneFunction}>
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <button className="lifeline-btn" onClick={yourHintFunction}>
        <FontAwesomeIcon icon={faLightbulb} />
      </button>

      <button className="lifeline-btn" onClick={yourStatisticsLookupFunction}>
        <FontAwesomeIcon icon={faChartBar} />
      </button>
    </>
  );
};

export default Lifelines;
