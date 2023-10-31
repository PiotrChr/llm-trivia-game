import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GameModeTile from '../GameModeTile';
import { useTranslation } from 'react-i18next';

export const GameModeStep = ({
  setGameMode,
  gameMode,
  gameModes,
  nextStep
}) => {
  const { t } = useTranslation();

  const handleSelect = (mode) => {
    setGameMode(mode);

    nextStep();
  };

  return (
    <Container className="host-game-step">
      <Row>
        <h3 className="text-center w-100 mb-5">
          {t('game_host.select_game_mode')}
        </h3>
        {gameModes.map((mode, index) => (
          <Col
            md={4}
            key={index}
            className="d-flex align-items-center justify-content-center"
          >
            <GameModeTile
              mode={mode}
              name={t('game_modes.' + mode.label + '.name')}
              description={t('game_modes.' + mode.label + '.description')}
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
