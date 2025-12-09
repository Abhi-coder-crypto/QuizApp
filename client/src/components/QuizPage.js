import React, { useEffect, useState, useRef } from 'react';
import { fetchQuestions, submitAnswers } from '../api.js';
import QuestionCard from './QuestionCard.js';

function QuizPage({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // array of {questionIndex, answerIndex}
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchQuestions();
      setQuestions(data.questions || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    startTimer();

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [currentIdx, questions]);

  function startTimer() {
    clearInterval(timerRef.current);
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoAdvance();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleAutoAdvance() {
    // move to next question (even if not answered)
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      finishQuiz();
    }
  }

  function recordAnswer(questionIndex, answerIndex) {
    setAnswers(prev => {
      const copy = prev.filter(a => a.questionIndex !== questionIndex);
      copy.push({ questionIndex, answerIndex });
      return copy;
    });
  }

  function handleNext() {
    // Next only if user answered this question
    const has = answers.find(a => a.questionIndex === currentIdx);
    if (!has) return;
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    clearInterval(timerRef.current);
    // send answers to server
    const res = await submitAnswers(answers);
    onFinish(res);
  }

  if (loading) return <div>Loading questions...</div>;
  if (!questions.length) return <div>No questions found.</div>;

  const q = questions[currentIdx];

  return (
    <div>
      <div className="topbar">
        <div className="timer">Time left: {timeLeft}s</div>
        <div className="small">Question {currentIdx + 1} / {questions.length}</div>
      </div>

      <QuestionCard
        question={q}
        questionIndex={currentIdx}
        onAnswer={(optionIdx) => {
          recordAnswer(currentIdx, optionIdx);
        }}
        selectedAnswer={answers.find(a => a.questionIndex === currentIdx)?.answerIndex}
      />

      <div style={{marginTop:12}}>
        <button onClick={handleNext} disabled={!answers.find(a => a.questionIndex === currentIdx)}>
          {currentIdx < questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default QuizPage;
