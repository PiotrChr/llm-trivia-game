import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export const FinalStep = () => {
  return (
    <Container className="host-game-step">
      <Row>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Host Game
        </Button>
      </Row>
    </Container>
  );
};
