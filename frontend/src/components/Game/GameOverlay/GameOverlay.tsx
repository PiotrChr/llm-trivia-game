import React from 'react'
import { Modal as ReactModal, Button } from 'react-bootstrap';

export const GameOverlay = ({ show, content, onClose }) => {
    if (!show) return null

    return (
        <ReactModal
            show={show}
            onHide={onClose}
            className="d-flex align-items-center"
        >
            <ReactModal.Header closeButton />
            {content}
        </ReactModal>
    )
}

GameOverlay.defaultProps = {
    show: false,
    content: null,
    onClose: () => { }
}