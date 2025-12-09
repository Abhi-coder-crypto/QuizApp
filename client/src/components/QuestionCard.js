import React from 'react';

function QuestionCard({ question, onAnswer, selectedAnswer, questionIndex }) {
  return (
    <div className="question-card">
      <div style={{fontWeight:700, marginBottom:8}}>{question.text}</div>
      <ul className="options">
        {question.options.map((opt, idx) => (
          <li key={idx}>
            <label style={{display:'flex', alignItems:'center', gap:10}}>
              <input
                type="radio"
                name={`q-${questionIndex}`}
                checked={selectedAnswer === idx}
                onChange={() => onAnswer(idx)}
              />
              <span>{opt}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionCard;
