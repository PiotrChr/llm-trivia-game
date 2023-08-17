import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { createGame, getCategories, getLanguages } from '../services/api';
import { useAlert } from '../components/shared/Alert/AlertContext';

const GameHostPage = () => {
  const [gamePassword, setGamePassword] = useState('');
  const [maxQuestions, setMaxQuestions] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [language, setLanguage] = useState(null);
  const [categories, setCategories] = useState([
    { label: 'Sports', value: 'sports' },
    { label: 'History', value: 'history' }
  ]);
  const [languages, setLanguages] = useState([]);
  const [category, setCategory] = useState(null);
  const [validated, setValidated] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(
        result.data.map((category) => ({
          label: category.name,
          value: category.id
        }))
      );
    };
    const fetchLanguages = async () => {
      const result = await getLanguages();
      setLanguages(
        result.data.map((language) => ({
          label: language.name,
          value: language.iso_code
        }))
      );
    };

    fetchCategories();
    fetchLanguages();
  }, []);

  const handleCategoryChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      setCategories([...categories, newValue]);
    }
    setCategory(newValue);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const game = await createGame(
          gamePassword,
          category.value,
          timeLimit,
          maxQuestions,
          language.value,
          autoStart
        );

        if (!game) {
          showAlert('Error', 'Something went wrong', null, {
            variant: 'danger',
            position: 'bottom'
          });
          return;
        }

        navigate('/game/' + game.data.id);
      } catch (err) {
        showAlert('Error', 'Something went wrong', err.message, {
          variant: 'danger',
          position: 'bottom'
        });
        return;
      }
    }

    setValidated(true);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Row>
        <Col md={{ span: 12 }}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Host a Game</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formGamePassword">
                  <Form.Label>Game Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={gamePassword}
                    onChange={(e) => setGamePassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formMaxQuestions">
                  <Form.Label>
                    Max Questions (leave empty for infinite)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={maxQuestions}
                    onChange={(e) => setMaxQuestions(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formTimeLimit">
                  <Form.Label>Time Limit (leave empty for no limit)</Form.Label>
                  <Form.Control
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                  />
                </Form.Group>

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

                <Form.Group controlId="formCategory">
                  <Form.Label>Initial Category</Form.Label>
                  <Select
                    isClearable
                    isSearchable
                    options={categories}
                    onChange={handleCategoryChange}
                    onCreateOption={handleCategoryChange}
                    formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                    value={category}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a category.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formAutoStart" className="mt-4">
                  <Form.Check
                    type="switch"
                    label="Auto-Start round"
                    checked={autoStart}
                    onChange={(e) => setAutoStart(e.target.checked)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Host Game
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GameHostPage;
