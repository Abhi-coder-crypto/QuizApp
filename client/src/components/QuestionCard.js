import React from 'react';

function QuestionCard({ question, onAnswer, selectedAnswer, questionIndex }) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="question-card">
      <div className="question-text">{question.text}</div>
      <div className="options-list">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            className={`option-btn ${selectedAnswer === idx ? 'selected' : ''}`}
            onClick={() => onAnswer(idx)}
          >
            <span className="option-letter">{letters[idx]}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
