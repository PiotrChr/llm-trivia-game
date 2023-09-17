import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const Collapse = ({ title, children, forceCollapse, showChevron }) => {
  const [isCollapsed, setIsCollapsed] = useState(forceCollapse);

  useEffect(() => {
    if (forceCollapse !== undefined) {
      setIsCollapsed(forceCollapse);
    }
  }, [forceCollapse]);

  return (
    <div>
      {isCollapsed && showChevron ? (
        <Button
          variant="outline-secondary"
          className="d-flex justify-content-between w-100"
          onClick={() => setIsCollapsed(false)}
        >
          {title}
          <i className="bi bi-chevron-down"></i>
        </Button>
      ) : (
        <div className="mt-2 position-relative">
          {children}

          {showChevron && (
            <Button
              variant="outline-secondary"
              className="position-absolute btn-round top-0 end-0 m-2 p-1"
              onClick={() => setIsCollapsed(true)}
              aria-label="Collapse"
            >
              <i className="bi bi-chevron-up"></i>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Collapse;
