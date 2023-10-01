import React from 'react';
import { Card, Button } from 'react-bootstrap';

const GameModeTile = ({ mode, onSelect }) => {
  return (
    <Card style={{ width: '18rem' }} className="mb-4 game-mode-tile">
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{mode.label}</Card.Title>
        <Card.Text>{mode.description}</Card.Text>
        <Button variant="primary" onClick={() => onSelect(mode)}>
          Select
        </Button>
      </Card.Body>
    </Card>
  );
};

export default GameModeTile;
