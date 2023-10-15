import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Jumbo } from '../components/Layout/Jumbo';
import { useTranslation } from 'react-i18next';

function ErrorPage() {
  const { errorId } = useParams();
  const [background, setBackground] = useState('bg-danger');
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    switch (errorId) {
      case '404':
        setBackground('404/1.png');
        setError(t('common.errors.404.description'));
        break;
      case '500':
        setBackground('500/1.png');
        setError(t('common.errors.500.description'));
        break;
      case 'unable-to-join-game':
        setBackground('unable-to-join/2.png');
        setError(t('common.errors.unable-to-join-game.description'));
        break;
      default:
        setBackground('unknown-error/1.png');
        setError(t('common.errors.other.description'));
        break;
    }
  }, []);

  return (
    <div>
      <Jumbo url={`/static/img/jumbotron/${background}`}>
        <Container className="d-flex align-items-center justify-content-center">
          <Row>
            <Col md={{ span: 12 }}>
              <Card
                className="p-4"
                style={{ background: 'rgba(255,255,255,0.98)' }}
              >
                <Card.Body>
                  <h2 className="text-center mb-4">
                    {t('common.errors.error')}
                  </h2>
                  <p>{error}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Jumbo>
    </div>
  );
}

export default ErrorPage;
