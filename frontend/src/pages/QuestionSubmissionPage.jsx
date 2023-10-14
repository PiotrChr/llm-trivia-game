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
import { getLanguages, getCategories } from '../services/api';
import { Jumbo } from '../components/Layout/Jumbo';

const QuestionSubmissionPage = () => {
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
        const fetchedCategories = (await getCategories()).data;
        const fetchedLanguages = (await getLanguages()).data;

        setCategories(
          fetchedCategories.map((cat) => ({ value: cat.id, label: cat.name }))
        );
        setLanguages(
          fetchedLanguages.map((lang) => ({ value: lang.id, label: lang.name }))
        );
      } catch (error) {
        console.error('Error fetching data', error);
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
    <div>
      <Jumbo
        url="static/img/jumbotron/question-submission/3.png"
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
                  <InputGroup.Text>
                    <InputGroup.Radio
                      name="correctAnswer"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                    />
                  </InputGroup.Text>
                  <Form.Control
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
    </div>
  );
};

export default QuestionSubmissionPage;
