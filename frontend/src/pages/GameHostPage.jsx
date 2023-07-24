import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { Card, Container, Row, Col } from 'react-bootstrap';

const GameHostPage = () => {
  const [gamePassword, setGamePassword] = useState("");
  const [maxQuestions, setMaxQuestions] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [language, setLanguage] = useState("");
  const [categories, setCategories] = useState([
    { label: "Sports", value: "sports" },
    { label: "History", value: "history" },
  ]);
  const [category, setCategory] = useState(null);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

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
      // logic to host game
      navigate('/game'); // replace with actual game route
    }

    setValidated(true);
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col md={{ span: 12}}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Host a Game</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formGamePassword">
                  <Form.Label>Game Password</Form.Label>
                  <Form.Control type="password" value={gamePassword} onChange={e => setGamePassword(e.target.value)} required />
                  <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formMaxQuestions">
                  <Form.Label>Max Questions (leave empty for infinite)</Form.Label>
                  <Form.Control type="number" value={maxQuestions} onChange={e => setMaxQuestions(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formTimeLimit">
                  <Form.Label>Time Limit (leave empty for no limit)</Form.Label>
                  <Form.Control type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formLanguage">
                  <Form.Label>Language</Form.Label>
                  <Form.Control as="select" value={language} onChange={e => setLanguage(e.target.value)} required>
                    <option value="">Select language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    // Add more languages here
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">Please select a language.</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">Please select a category.</Form.Control.Feedback>
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
}

export default GameHostPage;