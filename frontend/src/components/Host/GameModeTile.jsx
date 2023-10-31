import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const GameModeTile = ({
  mode = null,
  name = '',
  description = '',
  onSelect = () => {},
  variant = 1
}) => {
  const { t } = useTranslation();

  return (
    <Card
      style={{
        width: '18rem'
      }}
      className="mb-4 game-mode-tile"
    >
      <Card.Body className="d-flex flex-column justify-content-between">
        <div
          style={{ zIndex: 2 }}
          className="d-flex flex-column justify-content-between flex-grow-1"
        >
          <Card.Title className="mb-5">{name}</Card.Title>
          {/* <Card.Text className="mb-5">{description}</Card.Text> */}
          <Button variant="primary" onClick={() => onSelect(mode)}>
            {t('common.select')}
          </Button>
        </div>

        <img
          src={`/static/img/game-modes/${name.toLowerCase()}_${variant}.png`}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '15px',
            zIndex: 1,
            opacity: 0.2
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default GameModeTile;
