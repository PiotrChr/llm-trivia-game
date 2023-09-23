import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  Col,
  Row,
  InputGroup,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Form
} from 'react-bootstrap';
import { getLanguages, getCategories } from '../services/api';  // Assuming you have these functions set up

function QuestionSubmissionPage() {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const fetchedCategories = await getCategories();
        const fetchedLanguages = await getLanguages();
        
        setCategories(fetchedCategories.map(cat => ({ value: cat.id, label: cat.name })));
        setLanguages(fetchedLanguages.map(lang => ({ value: lang.id, label: lang.name })));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchSelectData();
  }, []);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    // Here, you'd typically send the question data to your backend
    console.log({
      selectedCategory,
      selectedLanguage,
      difficulty,
      questionText,
      answers,
      correctAnswer
    });
  };

  return (
    <section className="min-vh-80 mb-8">
      <div className="container mt-6">
        <Row>
          <Col sm={4}>
            <FormGroup>
              <FormLabel>Category</FormLabel>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            </FormGroup>

            <FormGroup className="mt-3">
              <FormLabel>Difficulty</FormLabel>
              <Select
                options={[
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'hard', label: 'Hard' }
                ]}
                value={difficulty}
                onChange={setDifficulty}
              />
            </FormGroup>

            <FormGroup className="mt-3">
              <FormLabel>Language</FormLabel>
              <Select
                options={languages}
                value={selectedLanguage}
                onChange={setSelectedLanguage}
              />
            </FormGroup>
          </Col>
          <Col sm={8}>
            <FormGroup>
              <FormLabel>Question Text</FormLabel>
              <FormControl
                as="textarea"
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </FormGroup>

            <FormLabel className="mt-3">Answers</FormLabel>
            {answers.map((answer, index) => (
              <InputGroup className="mb-3" key={index}>
                <InputGroup.Prepend>
                  <InputGroup.Radio
                    name="correctAnswer"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                  />
                </InputGroup.Prepend>
                <FormControl
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                />
              </InputGroup>
            ))}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button variant="primary" onClick={handleSubmit}>
              Submit Question
            </Button>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default QuestionSubmissionPage;