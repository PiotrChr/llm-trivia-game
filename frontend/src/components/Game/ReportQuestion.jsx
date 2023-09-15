import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { getCategories, reportQuestion } from '../../services/api';
import { useAlert } from '../shared/Alert/AlertContext';

function ReportQuestion({ question, onSubmit }) {
  const [feedbackType, setFeedbackType] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [otherProblem, setOtherProblem] = useState('');
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

    fetchCategories();
  }, []);

  const resetFeedback = () => {
    setFeedbackType(null);
    setSelectedCategory(null);
    setCorrectAnswer(null);
    setOtherProblem('');
  };

  const submitFeedback = async () => {
    try {
      const response = await reportQuestion(question.id, {
        reportType: feedbackType,
        report: selectedCategory || otherProblem || correctAnswer
      });

      if (response.status === 200) {
        showAlert('Success', 'Your feedback has been submitted.', null, {
          variant: 'success',
          position: 'bottom'
        });
      }
    } catch (error) {
      showAlert(
        'Error',
        'There was an error submitting your feedback. Please try again.',
        error.message,
        { variant: 'danger', position: 'bottom' }
      );
    }

    resetFeedback();
    onSubmit();
  };

  return (
    <div className="d-flex flex-column" id="report-question">
      <Button className="mb-1" onClick={() => setFeedbackType(2)}>
        Too easy
      </Button>
      <Button className="mb-1" onClick={() => setFeedbackType(3)}>
        Too hard
      </Button>
      <Button className="mb-1" onClick={() => setFeedbackType(1)}>
        Incorrect Answer
      </Button>

      {feedbackType === 'incorrect-answer' && (
        <div className="d-flex flex-column p-2 mt-1 mb-2">
          {question.answers.map((answer) => (
            <Button
              variant="secondary"
              className="btn-sm"
              key={answer.id}
              onClick={() => setCorrectAnswer(answer.id)}
            >
              {answer.text}
            </Button>
          ))}
        </div>
      )}

      <Button className="mb-1" onClick={() => setFeedbackType(4)}>
        Wrong Category
      </Button>

      {feedbackType === 'wrong-category' && (
        <div className="mb-2 mt-1">
          <Select
            options={categories}
            value={selectedCategory}
            onChange={(selectedOption) =>
              setSelectedCategory(selectedOption.value)
            }
          />
        </div>
      )}

      <Button className="mb-1" onClick={() => setFeedbackType(5)}>
        Other Problem
      </Button>

      {feedbackType === 'other' && (
        <div className="mb-2 mt-1">
          <Form.Control
            as="textarea"
            className="rounded"
            rows={3}
            value={otherProblem}
            onChange={(e) => setOtherProblem(e.target.value)}
          />
        </div>
      )}

      <Button variant="success" className="mt-5" onClick={submitFeedback}>
        Submit Feedback
      </Button>
    </div>
  );
}

ReportQuestion.defaultProps = {
  onSubmit: () => {}
};

export default ReportQuestion;
