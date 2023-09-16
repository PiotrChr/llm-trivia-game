import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const Collapse = ({
  title,
  children,
  defaultCollapsed = true,
  forceCollapse
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    if (forceCollapse !== undefined) {
      setIsCollapsed(forceCollapse);
    }
  }, [forceCollapse]);

  return (
    <div>
      {isCollapsed ? (
        <Button
          variant="outline-secondary"
          className="d-flex justify-content-between w-100"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {title}
          <i className="bi bi-chevron-down"></i>
        </Button>
      ) : (
        <div className="mt-2 position-relative">
          {children}

          <Button
            variant="outline-secondary"
            className="position-absolute top-0 end-0 m-2 p-1"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse"
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Collapse;
