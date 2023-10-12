import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const LanguageStep = ({
  setLanguage,
  language,
  languages,
  nextStep
}) => {
  const { t } = useTranslation();

  const selectLanguage = (language) => {
    setLanguage(language);
  };

  return (
    <Container className="host-game-step my-5 my-lg-5">
      <Row>
        <h3 className="text-center w-100 mb-5">
          {t('game_host.select_language')}
        </h3>
        <Form.Group controlId="formLanguage">
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
