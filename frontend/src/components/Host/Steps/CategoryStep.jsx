import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select, { components } from 'react-select';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CustomOption = (props) => {
  const { label, count } = props.data;
  return (
    <components.Option {...props}>
      <span className="me-3">{label}</span>
      <small>{count}</small>
    </components.Option>
  );
};

export const CategoryStep = ({
  setCategory,
  selectAll,
  allSelected,
  category,
  categories,
  nextStep
}) => {
  const { t } = useTranslation();

  return (
    <Container className="host-game-step my-lg-5 mt-0">
      <Row>
        <Form.Group controlId="formAllCategories" className="mb-5">
          <Form.Label>{t('common.all_categories')}</Form.Label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckAllCat"
              checked={allSelected}
              onChange={(e) => selectAll(e.target.checked)}
            />
          </div>
        </Form.Group>
        <Form.Group controlId="formLanguage">
          <Form.Label>{t('common.category')}</Form.Label>
          <Select
            components={{ Option: CustomOption }}
            value={category}
            options={categories}
            isDisabled={allSelected}
            onChange={(newValue) => setCategory(newValue)}
            required
          />
          <Form.Control.Feedback type="invalid">
            {t('game_host.select_category')}
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
