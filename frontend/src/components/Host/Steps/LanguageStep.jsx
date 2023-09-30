import React from 'react';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

export const LanguageStep = ({ setLanguage, language, languages }) => {
  return (
    <div>
      <Form.Group controlId="formLanguage">
        <Form.Label>Language</Form.Label>
        <Select
          value={language}
          options={languages}
          onChange={(newValue) => setLanguage(newValue)}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please select a language.
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};
