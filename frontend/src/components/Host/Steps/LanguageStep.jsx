import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';

export const LanguageStep = ({
  setLanguage,
  language,
  languages,
  nextStep
}) => {
  const selectLanguage = (language) => {
    setLanguage(language);
    nextStep();
  };

  return (
    <Container className="host-game-step">
      <Row>
        <h3 className="text-center w-100 mb-5">Select Language</h3>
        <Form.Group controlId="formLanguage">
          <Form.Label>Language</Form.Label>
          <Select
            value={language}
            options={languages}
            onChange={(newValue) => selectLanguage(newValue)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please select a language.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
    </Container>
  );
};
