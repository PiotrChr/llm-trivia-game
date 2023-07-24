import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function GameWelcomePage() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col md={{ span: 12 }}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Welcome to the Trivia Game</h2>
              <div className="game-actions">
                <Button className="w-100 mt-3" variant="primary" size="lg" onClick={() => { navigate('/game/host') }}>Host a Game</Button>
                <Button className="w-100 mt-3" variant="primary" size="lg" onClick={() => { navigate('/game/join') }}>Join a Game</Button>
                <Button className="w-100 mt-3" variant="primary" size="lg" onClick={() => { navigate('/game/list') }}>List Games</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default GameWelcomePage;