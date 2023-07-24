import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card, Container, Row, Col } from 'react-bootstrap';

function GameJoinPage() {
  const [gameId, setGameId] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // logic to join game
      navigate('/game'); // replace with actual game route
    }

    setValidated(true);
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col md={{ span: 12}}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Join a Game</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formGameId">
                  <Form.Label>Game ID</Form.Label>
                  <Form.Control type="input" value={gameId} onChange={e => setGameId(e.target.value)} required />
                  <Form.Control.Feedback type="invalid">Please provide a valid game ID.</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Join Game
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default GameJoinPage;