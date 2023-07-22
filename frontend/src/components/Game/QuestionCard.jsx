import React from 'react';

const QuestionCard = ({ question, answers, onAnswer, onEnd, isLastQuestion = false }) => {
  
  const handleClick = (answer) => {
    if (isLastQuestion) {
      onEnd(answer);
    } else {
      onAnswer(answer);
    }
  }

  return (
    <div className="question-card">
      <h2 className="question">{question}</h2>
      <div className="answers">
        {answers.map((answer, index) => (
          <button key={index} onClick={() => handleClick(answer)}>{answer}</button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;