import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const setSelectedLifelineNumber = (lifelineName, count) => {
    console.log(lifelineName, count);
    setSelectedLifeLines([
      ...selectedLifelines.filter((lifeline) => lifeline.name !== lifelineName),
      { name: lifelineName, count: count }
    ]);
  };

  return (
    <Container className="host-game-step">
      <Row className="d-flex flex-column">
        <h3 className="text-center w-100 mb-5">
          {t('game_host.question_options')}
        </h3>
        <Form.Group controlId="formMaxQuestions">
          <Form.Label>
            {t('common.max_questions')}:{' '}
            {maxQuestions !== 0 ? maxQuestions : 'Infinite'}
          </Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="100
"
            value={maxQuestions}
            onChange={(e) => setMaxQuestions(e.target.value)}
          />
          <Form.Text className="text-muted">
            {t('game_host.max_questions_label')}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formTimeLimit">
          <Form.Label>
            {t('common.time_limit')}:{' '}
            {timeLimit !== 0 ? `${timeLimit} seconds` : 'No limit'}
          </Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="60"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
          <Form.Text className="text-muted">
            {t('game_host.time_limit_label')}
          </Form.Text>
        </Form.Group>

        <div className="lifeline-select">
          <Form.Label>{t('common.lifelines')}</Form.Label>
          {lifelines.map((lifeline) => {
            const selectedLifeLine = selectedLifelines.filter(
              (sLifeline) => sLifeline.name === lifeline.label
            )[0];

            return (
              <Form.Group key={lifeline.value} className="d-flex mb-2">
                <Form.Check
                  id={`form-${lifeline.label}`}
                  type="switch"
                  label={`${t('lifelines.' + lifeline.label + '.name')}: (${
                    selectedLifeLine.count
                  })`}
                  checked={selectedLifeLine.count !== 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLifelineNumber(lifeline.label, 1);
                    } else {
                      setSelectedLifelineNumber(lifeline.label, 0);
                    }
                  }}
                />
                <Form.Control
                  id={`form-${lifeline.label}Number`}
                  type="range"
                  min="1"
                  max="100"
                  disabled={selectedLifeLine.count === 0}
                  value={selectedLifeLine.count}
                  onChange={(e) =>
                    setSelectedLifelineNumber(lifeline.label, e.target.value)
                  }
                />
              </Form.Group>
            );
          })}
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
          className="mt-5 btn w-auto ms-auto me-5"
          onClick={nextStep}
        >
          {t('common.next')}
        </Button>
      </Row>
    </Container>
  );
};
