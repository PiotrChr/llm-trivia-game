import React from 'react';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

export const CategoryStep = ({ setCategory, category, categories }) => {
  return (
    <div>
      <Form.Group controlId="formLanguage">
        <Form.Label>Category</Form.Label>
        <Select
          value={category}
          options={categories}
          onChange={(newValue) => setCategory(newValue)}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please select a category.
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};
