import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export const GameOptionsStep = ({ setGamePassword, gamePassword }) => {
  return (
    <Container className="host-game-step">
      <h3 className="text-center w-100 mb-5">Game Options</h3>
      <Row>
        <Form.Group controlId="formGamePassword">
          <Form.Label>Game Password</Form.Label>
          <Form.Control
            type="password"
            value={gamePassword}
            onChange={(e) => setGamePassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
    </Container>
  );
};
