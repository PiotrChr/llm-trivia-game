import React, { useEffect } from 'react';
import classNames from 'classnames';

const Alert = ({
  message,
  details,
  title,
  onClose,
  duration = 5000,
  dismissible = true,
  position = 'top',
  variant = 'primary',
  style,
  transition
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const transitionStyles = {
    fade: {
      transition: 'opacity 0.3s',
      opacity: 0
    }
  };

  const defaultStyle = {
    position: 'fixed',
    zIndex: 1000,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem',
    ...style,
    ...transitionStyles[transition]
  };

  if (position === 'top') defaultStyle.top = '1rem';
  if (position === 'bottom') defaultStyle.bottom = '1rem';

  return (
    <div
      className={classNames(
        'alert text-white',
        'alert-dismissible' && dismissible,
        'alert-' + (variant || 'primary')
      )}
      style={defaultStyle}
      role="alert"
    >
      <div className="d-flex flex-row align-items-center">
        <span className="alert-text">
          {title && <strong>{title}: </strong>}
          <small>{message}</small>
          {details && (
            <>
              <br />
              <small style={{ fontSize: '0.7rem' }}>{details}</small>
            </>
          )}
        </span>
        {dismissible && (
          <button
            type="button"
            className="btn-close ms-5 mb-2"
            data-bs-dismiss="alert"
            aria-label="Close"
            style={{ background: 'none' }}
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
