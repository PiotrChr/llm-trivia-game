import React from 'react';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

export const GameOptionsStep = ({ setGamePassword, gamePassword }) => {
  return (
    <div>
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
    </div>
  );
};
