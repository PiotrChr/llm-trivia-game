import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const Prompt = ({
  show,
  message,
  onApprove,
  onDecline,
  onCancel,
  yesLabel,
  noLabel,
  cancelLabel
}) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        {onApprove && (
          <Button variant="danger" onClick={onDecline}>
            {noLabel}
          </Button>
        )}
        {onDecline && (
          <Button variant="success" onClick={onApprove}>
            {yesLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

Prompt.defaultProps = {
  yesLabel: 'Yes',
  noLabel: 'No',
  cancelLabel: 'Cancel',
  onApprove: null,
  onDecline: null
};

Prompt.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onApprove: PropTypes.func,
  onDecline: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  yesLabel: PropTypes.string,
  noLabel: PropTypes.string,
  cancelLabel: PropTypes.string
};

export default Prompt;
