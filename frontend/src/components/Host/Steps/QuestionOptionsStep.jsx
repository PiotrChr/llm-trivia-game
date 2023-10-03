import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

export const QuestionOptionsStep = ({
  setMaxQuestions,
  maxQuestions,
  setTimeLimit,
  timeLimit,
  setAutoStart,
  autoStart,
  lifelines,
  setSelectedLifeLines,
  selectedLifelines,
  nextStep
}) => {
  const setSelectedLifelineNumber = (lifeline, number) => {
    setSelectedLifeLines({
      ...selectedLifelines,
      [lifeline]: number
    });
  };

  console.log(selectedLifelines);

  return (
    <Container className="host-game-step">
      <Row>
        <h3 className="text-center w-100 mb-5">Question Options</h3>
        <Form.Group controlId="formMaxQuestions">
          <Form.Label>
            Max Questions: {maxQuestions !== 0 ? maxQuestions : 'Infinite'}
          </Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="1000"
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
            Time Limit: {timeLimit !== 0 ? `${timeLimit} seconds` : 'No limit'}
          </Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="60"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
          <Form.Text className="text-muted">
            Slide to adjust the time limit for each question. Slide to the
            minimum for no time limit.
          </Form.Text>
        </Form.Group>

        <div className="lifeline-select">
          <Form.Label>Lifelines</Form.Label>
          {lifelines.map((lifeline) => (
            <Form.Group key={lifeline.value} className="d-flex mb-2">
              <Form.Check
                id={`form${lifeline.label}`}
                type="switch"
                label={lifeline.label}
                checked={selectedLifelines[lifeline.value] !== undefined}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedLifeLines({
                      ...selectedLifelines,
                      [lifeline.value]: 0
                    });
                  } else {
                    setSelectedLifeLines({
                      ...selectedLifelines,
                      [lifeline.value]: undefined
                    });
                  }
                }}
              />
              <Form.Control
                id={`form${lifeline.label}Number`}
                type="range"
                min="1"
                max="100"
                disabled={selectedLifelines[lifeline.value] === undefined}
                value={
                  selectedLifelines[lifeline.value]
                    ? selectedLifelines[lifeline.value]
                    : 0
                }
                onChange={(e) =>
                  setSelectedLifelineNumber(lifeline.value, e.target.value)
                }
              />
            </Form.Group>
          ))}
        </div>

        <Form.Group controlId="formAutoStart" className="mt-4">
          <Form.Check
            type="switch"
            label="Auto-Start round"
            checked={autoStart}
            onChange={(e) => setAutoStart(e.target.checked)}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="mt-5 btn w-auto ms-auto me-5"
          onClick={nextStep}
        >
          Next
        </Button>
      </Row>
    </Container>
  );
};
