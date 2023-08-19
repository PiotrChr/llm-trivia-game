import React, { useMemo } from 'react';
import classNames from 'classnames';

const ResultBadge = ({ won }) => {
  const commonClassnames = useMemo(() => {
    return 'bi text-center';
  }, []);

  const commonStyles = useMemo(() => {
    return {
      fontSize: '10rem'
    };
  }, []);

  if (won === null) {
    return;
  }

  return (
    <>
      {won ? (
        <i
          className={classNames(
            commonClassnames,
            'bi-check-circle-fill text-success'
          )}
          style={commonStyles}
          aria-hidden="true"
        ></i>
      ) : (
        <i
          className={classNames(
            commonClassnames,
            'bi-x-circle-fill text-danger'
          )}
          style={commonStyles}
          aria-hidden="true"
        ></i>
      )}
    </>
  );
};

ResultBadge.defaultProps = {
  won: false
};

export default ResultBadge;
