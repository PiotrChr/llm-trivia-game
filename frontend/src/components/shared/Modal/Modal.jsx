import React from 'react';
import PropTypes from 'prop-types';
import { Modal as ReactModal, Button } from 'react-bootstrap';

const Modal = ({
  show,
  title,
  content,
  showFooter,
  footerButtons,
  onClose
}) => {
  return (
    <ReactModal show={show} onHide={onClose}>
      <ReactModal.Header closeButton>
        <ReactModal.Title>{title}</ReactModal.Title>
      </ReactModal.Header>
      <ReactModal.Body>{content}</ReactModal.Body>
      {showFooter && (
        <ReactModal.Footer>
          {footerButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
          <Button variant="secondary" onClick={onClose}>
            'Close'
          </Button>
        </ReactModal.Footer>
      )}
    </ReactModal>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  showFooter: PropTypes.bool,
  footerButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.string,
      onClick: PropTypes.func
    })
  )
};

Modal.defaultProps = {
  footerButtons: [],
  showFooter: false
};

export default Modal;
