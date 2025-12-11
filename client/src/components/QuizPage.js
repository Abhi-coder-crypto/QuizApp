import React, { useEffect, useState, useRef } from 'react';
import { fetchQuestions, submitAnswers } from '../api.js';
import QuestionCard from './QuestionCard.js';

function QuizPage({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchQuestions();
      setQuestions(data.questions || []);
      setLoading(false);
      startTimeRef.current = Date.now();
    })();
  }, []);

  useEffect(() => {
    if (!questions.length) return;

    if (!totalTimerRef.current) {
      totalTimerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setTotalTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }

    startTimer();

    return () => clearInterval(timerRef.current);
  }, [currentIdx, questions]);

  useEffect(() => {
    return () => {
      clearInterval(totalTimerRef.current);
    };
  }, []);

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
    const has = answers.find(a => a.questionIndex === currentIdx);
    if (!has) return;
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      finishQuiz();
    }
  }

  // 🔥 UPDATED FUNCTION (Correct + Wrong + Unattempted Included)
  async function finishQuiz() {
    clearInterval(timerRef.current);
    clearInterval(totalTimerRef.current);

    const timeTaken = startTimeRef.current 
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : totalTimeElapsed;

    const res = await submitAnswers(answers, timeTaken);

    const correctAnswers = answers.filter(a => {
      const q = questions[a.questionIndex];
      return q.correctOption === a.answerIndex;
    }).length;

    const wrongAnswers = answers.filter(a => {
      const q = questions[a.questionIndex];
      return q.correctOption !== a.answerIndex;
    }).length;

    const unattempted = questions.length - answers.length;

    // Send proper result to ResultPage
    onFinish({
      ...res,
      timeTaken,
      correctAnswers,
      wrongAnswers,
      unattempted
    });
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (loading) return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <div className="quiz-header">
          <img src="/napcon_logo.jpg" alt="NAPCON 2025" className="quiz-logo" />
        </div>
        <div className="loading-message">Loading questions...</div>
      </div>
    </div>
  );

  if (!questions.length) return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <div className="quiz-header">
          <img src="/napcon_logo.jpg" alt="NAPCON 2025" className="quiz-logo" />
        </div>
        <div className="loading-message">No questions found.</div>
      </div>
    </div>
  );

  const q = questions[currentIdx];

  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <div className="quiz-header">
          <img src="/napcon_logo.jpg" alt="NAPCON 2025" className="quiz-logo" />
          <h2 className="quiz-title">NAPCON PG Quiz - Preliminary Round</h2>
        </div>

        <div className="quiz-topbar">
          <div className="timer-section">
            <div className={`question-timer ${timeLeft <= 5 ? 'warning' : ''}`}>
              <span className="timer-icon">&#9201;</span>
              <span>{timeLeft}s</span>
            </div>
            <div className="total-time">
              Total: {formatTime(totalTimeElapsed)}
            </div>
          </div>
          <div className="question-progress">
            Question {currentIdx + 1} / {questions.length}
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <QuestionCard
          question={q}
          questionIndex={currentIdx}
          onAnswer={(optionIdx) => {
            recordAnswer(currentIdx, optionIdx);
          }}
          selectedAnswer={answers.find(a => a.questionIndex === currentIdx)?.answerIndex}
        />

        <div className="quiz-actions">
          <button 
            className="quiz-next-btn" 
            onClick={handleNext} 
            disabled={!answers.find(a => a.questionIndex === currentIdx)}
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
          </button>
        </div>

        <div className="scoring-info">
          <span className="score-rule correct-rule">Correct: +2</span>
          <span className="score-rule wrong-rule">Wrong: -1</span>
          <span className="score-rule unattempted-rule">Unattempted: 0</span>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;

