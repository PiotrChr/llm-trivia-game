import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

export const FinalStep = ({ startGame }) => {
  const { t } = useTranslation();

  return (
    <Container className="host-game-step">
      <Row>
        <Button
          variant="primary"
          type="submit"
          className="mt-5 btn w-auto ms-auto me-5"
          onClick={() => startGame}
        >
          {t('game_host.create_game')}
        </Button>
      </Row>
    </Container>
  );
};

FinalStep.defaultProps = {
  startGame: () => {}
};
