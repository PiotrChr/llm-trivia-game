import React, { useEffect } from 'react';
import classNames from 'classnames';

export const Jumbo = ({
  children,
  url,
  maskClasses,
  scrollToContent,
  className,
  scrollToDelay
}) => {
  useEffect(() => {
    setTimeout(() => {
      if (scrollToContent) {
        window.scrollTo({
          top: window.innerHeight - (window.innerHeight / 100) * 25,
          behavior: 'smooth'
        });
      }
    }, scrollToDelay);
  }, [scrollToDelay]);

  return (
    <div
      className={classNames(
        'jumbo-background p-5 text-center bg-image rounded-3 position-relative',
        className
      )}
      style={{
        backgroundImage: `url(${url})`,
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={classNames('mask', maskClasses)} style={{ opacity: 1 }}>
        <div className="d-flex justify-content-center align-content-center flex-wrap h-100">
          {children}
        </div>
      </div>
    </div>
  );
};

Jumbo.defaultProps = {
  url: '',
  maskClasses: '',
  srollToContent: false,
  scrollToDelay: 500
};
