import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export const FinalStep = () => {
  return (
    <Container className="host-game-step">
      <Row>
        <Button
          variant="primary"
          type="submit"
          className="mt-5 btn w-auto ms-auto me-5"
          onClick={() => {}}
        >
          { t('game_host.create_game') }
        </Button>
      </Row>
    </Container>
  );
};
