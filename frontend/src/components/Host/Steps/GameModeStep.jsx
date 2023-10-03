import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GameModeTile from '../GameModeTile';

export const GameModeStep = ({
  setGameMode,
  gameMode,
  gameModes,
  nextStep
}) => {
  const handleSelect = (mode) => {
    setGameMode(mode);

    nextStep();
  };

  return (
    <Container className="host-game-step">
      <Row>
        <h3 className="text-center w-100 mb-5">Select Game Mode</h3>
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

GameModeTile.defaultProps = {
  gameMode: null,
  gameModes: [],
  setGameMode: () => {}
};
