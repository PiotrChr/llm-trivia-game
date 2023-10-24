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
import { getLanguages, getCategories, submitQuestion } from '../services/api';
import { Jumbo } from '../components/Layout/Jumbo';
import { useAlert } from '../components/shared/Alert/AlertContext';
import { useTranslation } from 'react-i18next';

const QuestionSubmissionPage = () => {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const { showAlert } = useAlert();
  const { t } = useTranslation();

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

    fetchSelectData();
  }, []);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    try {
      const response = submitQuestion({
        category: selectedCategory.value,
        language: selectedLanguage.value,
        difficulty: difficulty.value,
        question: questionText,
        answers,
        correct_answer: correctAnswer
      });

      showAlert(
        t('question_submission.success'),
        t('question_submission.success'),
        null,
        {
          variant: 'success',
          position: 'top'
        }
      );
    } catch (error) {
      showAlert(
        t('question_submission.fail'),
        t('question_submission.fail'),
        error.message,
        {
          variant: 'danger',
          position: 'top'
        }
      );
    }
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
                <FormLabel>{t('common.category')}</FormLabel>
                <Select
                  options={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </FormGroup>

              <FormGroup className="mt-3">
                <FormLabel>{t('common.difficulty')}</FormLabel>
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
                <FormLabel>{t('common.language')}</FormLabel>
                <Select
                  options={languages}
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                />
              </FormGroup>
            </Col>
            <Col sm={8}>
              <FormGroup>
                <FormLabel>{t('common.question_text')}</FormLabel>
                <FormControl
                  as="textarea"
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </FormGroup>

              <FormLabel className="mt-3">{t('common.answers')}</FormLabel>
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
                {t('common.submit')}
              </Button>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default QuestionSubmissionPage;
