import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

export const GameOptionsStep = ({
  setGamePassword,
  gamePassword,
  nextStep,
  language,
  setLanguage,
  languages
}) => {
  const { t } = useTranslation();

  const selectLanguage = (language) => {
    setLanguage(language);
  };

  return (
    <Container className="host-game-step">
      <h3 className="text-center w-100 mb-5">{t('game_host.game_options')}</h3>
      <Row>
        <Form.Group controlId="formGamePassword">
          <Form.Label>{t('game_host.game_password')}</Form.Label>
          <Form.Control
            type="password"
            value={gamePassword}
            onChange={(e) => {
              setGamePassword(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            {t('game_host.errors.invalid_game_password')}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLanguage" className="mt-3">
          <Form.Label>{t('common.language')}</Form.Label>
          <Select
            value={language}
            options={languages}
            onChange={(newValue) => selectLanguage(newValue)}
            required
          />
          <Form.Control.Feedback type="invalid">
            {t('game_host.select_language')}
          </Form.Control.Feedback>
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
