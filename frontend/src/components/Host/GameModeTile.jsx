import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const GameModeTile = ({ mode, name, description, onSelect }) => {
  const { t } = useTranslation();

  return (
    <Card style={{ width: '18rem' }} className="mb-4 game-mode-tile">
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="primary" onClick={() => onSelect(mode)}>
          {t('common.select')}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default GameModeTile;
