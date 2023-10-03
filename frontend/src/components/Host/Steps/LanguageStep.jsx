import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

export const LanguageStep = ({
  setLanguage,
  language,
  languages,
  nextStep
}) => {
  const selectLanguage = (language) => {
    setLanguage(language);
  };

  return (
    <Container className="host-game-step my-5 my-lg-5">
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
