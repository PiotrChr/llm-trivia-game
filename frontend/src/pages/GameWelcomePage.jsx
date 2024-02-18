import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function GameWelcomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();


  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Row>
        <Col md={{ span: 12 }}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">{ t('game_welcome.title') }</h2>
              <div className="game-actions">
                <Button
                  className="w-100 mt-3"
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    navigate('/game/host');
                  }}
                >
                  { t('navigation.play.create') }
                </Button>
                <Button
                  className="w-100 mt-3"
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    navigate('/game/join');
                  }}
                >
                  { t('navigation.play.join') }
                </Button>
                <Button
                  className="w-100 mt-3"
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    navigate('/game/list');
                  }}
                >
                  { t('navigation.play.browse') }
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default GameWelcomePage;
