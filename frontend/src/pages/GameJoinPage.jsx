import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { joinGame } from '../services/api';
import { useAlert } from '../components/shared/Alert/AlertContext';
import { useTranslation } from 'react-i18next';
import { Jumbo } from '../components/Layout/Jumbo';

function GameJoinPage() {
  const [currentGameId, setGameId] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const { gameId } = useParams();

  useEffect(() => {
    if (gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        await joinGame(currentGameId, password);
      } catch (err) {
        showAlert(
          'Error',
          'Double check the password and game ID',
          err.message,
          {
            variant: 'danger',
            position: 'bottom'
          }
        );
        return;
      }

      showAlert('Joined', 'You have successfully joined the game!', null, {
        variant: 'success',
        position: 'bottom'
      });

      setTimeout(() => {
        navigate(`/game/${currentGameId}`);
      }, 2000);
    }

    setValidated(true);
  };

  return (
    <div>
      <Jumbo
        url="/static/img/jumbotron/join-game/2.jpg"
        scrollToContent={true}
      />
      <Container className="d-flex align-items-center justify-content-center">
        <Row>
          <Col md={{ span: 12 }}>
            <Card className="p-4">
              <Card.Body>
                <h2 className="text-center mb-4">{t('game_join.title')}</h2>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="formGameId">
                    <Form.Label>{t('common.game_id')}</Form.Label>
                    <Form.Control
                      type="input"
                      value={currentGameId}
                      onChange={(e) => setGameId(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid game ID.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password (Optional)</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    {t('common.join_game')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GameJoinPage;
