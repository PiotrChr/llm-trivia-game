import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  FormGroup,
  FormLabel,
  FormControl,
  Button
} from 'react-bootstrap';
import { getCategories, submitCategory } from '../services/api';
import { Jumbo } from '../components/Layout/Jumbo';
import { useAlert } from '../components/shared/Alert/AlertContext';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const CategorySubmissionPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [language, setLanguage] = useState(null);
  const [languages, setLanguages] = useState([]);
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = (await getCategories()).data;
        setCategories(
          fetchedCategories.map((cat) => ({ value: cat.id, label: cat.name }))
        );
      } catch (error) {
        showAlert(
          t('common.errors.error_fetching_data'),
          t('common.errors.error_fetching_data'),
          error.message,
          {
            variant: 'danger',
            position: 'top'
          }
        );
      }
    };

    const fetchLanguages = async () => {
      try {
        const fetchedLanguages = (await getLanguages()).data;
        setLanguages(
          fetchedLanguages.map((lang) => ({ value: lang.id, label: lang.name }))
        );
      } catch (error) {
        showAlert(
          t('common.errors.error_fetching_data'),
          t('common.errors.error_fetching_data'),
          error.message,
          {
            variant: 'danger',
            position: 'top'
          }
        );
      }
    };

    fetchLanguages();
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await submitCategory({
        name: newCategoryName,
        language: language
      });
      showAlert('Category submitted successfully', 'success');
      setNewCategoryName('');
    } catch (error) {
      showAlert('Error submitting category', 'danger');
    }
  };

  return (
    <div>
      <Jumbo
        url="static/img/jumbotron/category-submission/3.jpg"
        scrollToContent={true}
      ></Jumbo>
      <section>
        <div
          className="container card mt-6 p-4"
          style={{ minWidth: '60vw', background: 'rgba(255,255,255,0.9)' }}
        >
          <Row>
            <Col sm={4}>
              <FormGroup>
                <FormLabel>Existing Categories</FormLabel>
                <Select options={categories} isDisabled={true} />
              </FormGroup>
            </Col>
            <Col sm={8}>
              <FormGroup>
                <FormLabel>
                  {t('category_submission.new_category_name')}
                </FormLabel>
                <FormControl
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Button variant="primary" onClick={handleSubmit}>
                {t('common.submit')}
              </Button>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default CategorySubmissionPage;
