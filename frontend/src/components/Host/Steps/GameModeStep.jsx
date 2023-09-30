import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GameModeTile from '../GameModeTile';

export const GameModeStep = ({ setGameMode, gameMode, gameModes }) => {
  const handleSelect = (mode) => {
    setGameMode(mode);
  };

  return (
    <Container>
      <Row>
        {gameModes.map((mode, index) => (
          <Col md={4} key={index}>
            <GameModeTile
              mode={mode}
              onSelect={handleSelect}
              isSelected={mode === gameMode}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
