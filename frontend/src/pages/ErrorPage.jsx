import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

function ErrorPage() {
  const { errorId } = useParams();

  const getErrorMessage = () => {
    switch (errorId) {
      case '404':
        return 'The page you are looking for could not be found.';
      case '500':
        return 'There was a server error. Please try again later.';
      case 'unable-to-join-game':
        return 'You are unable to join this game.';
      default:
        return 'An unknown error occurred.';
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Error</h2>
              <p>{getErrorMessage()}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorPage;
