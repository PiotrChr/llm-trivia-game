import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export const QuestionOptionsStep = ({
  setMaxQuestions,
  maxQuestions,
  setTimeLimit,
  timeLimit,
  setAutoStart,
  autoStart
}) => {
  return (
    <Container className="host-game-step">
      <Row>
        <h3 className="text-center w-100 mb-5">Question Options</h3>
        <Form.Group controlId="formMaxQuestions">
          <Form.Label>
            Max Questions: {maxQuestions !== '' ? maxQuestions : 'Infinite'}
          </Form.Label>
          <Form.Control
            type="range"
            min="1"
            max="100"
            value={maxQuestions}
            onChange={(e) => setMaxQuestions(e.target.value)}
          />
          <Form.Text className="text-muted">
            Slide to the right to increase the number of questions, or slide to
            the left to decrease. Leave it at the minimum for an infinite number
            of questions.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formTimeLimit">
          <Form.Label>
            Time Limit: {timeLimit !== '' ? `${timeLimit} seconds` : 'No limit'}
          </Form.Label>
          <Form.Control
            type="range"
            min="10"
            max="600"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
          <Form.Text className="text-muted">
            Slide to adjust the time limit for each question. Slide to the
            minimum for no time limit.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formAutoStart" className="mt-4">
          <Form.Check
            type="switch"
            label="Auto-Start round"
            checked={autoStart}
            onChange={(e) => setAutoStart(e.target.checked)}
          />
        </Form.Group>
      </Row>
    </Container>
  );
};
