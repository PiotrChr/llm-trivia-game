import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

export const CategoryStep = ({
  setCategory,
  selectAll,
  allSelected,
  category,
  categories,
  nextStep
}) => {
  console.log(allSelected);

  return (
    <Container className="host-game-step my-lg-5 mt-0">
      <Row>
        <Form.Group controlId="formAllCategories" className="mb-5">
          <Form.Label>All Categories</Form.Label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              checked={allSelected}
              onChange={(e) => selectAll(e.target.checked)}
            />
          </div>
        </Form.Group>
        <Form.Group controlId="formLanguage">
          <Form.Label>Category</Form.Label>
          <Select
            value={category}
            options={categories}
            isDisabled={allSelected}
            onChange={(newValue) => setCategory(newValue)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please select a category.
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
