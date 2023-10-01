import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';

export const CategoryStep = ({
  setCategory,
  selectAll,
  allSelected,
  category,
  categories
}) => {
  return (
    <Container className="host-game-step">
      <Row>
        <Form.Group controlId="formAllCategories">
          <Form.Label>All Categories</Form.Label>
          <Form.Control
            type="checkbox"
            value="all"
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formLanguage">
          <Form.Label>Category</Form.Label>
          <Select
            value={category}
            options={categories}
            disabled={allSelected}
            onChange={(newValue) => setCategory(newValue)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please select a category.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
    </Container>
  );
};
