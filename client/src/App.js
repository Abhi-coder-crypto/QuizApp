import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm.js';
import QuizPage from './components/QuizPage.js';
import ResultPage from './components/ResultPage.js';
import { getToken } from './api.js';
import './styles.css';

export default function App() {
  const [token, setToken] = useState(getToken());
  const [stage, setStage] = useState('login');
  const [result, setResult] = useState(null);
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    if (getToken()) setStage('quiz');
  }, []);

  function handleLogin(loginData) {
    setToken(loginData.token);
    
    if (loginData.hasCompletedQuiz && loginData.quizResult) {
      setResult(loginData.quizResult);
      setIsReturningUser(true);
      setStage('result');
    } else {
      setStage('quiz');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setResult(null);
    setIsReturningUser(false);
    setStage('login');
  }

  return (
    <>
      {stage === 'login' && (
        <LoginForm onLogin={handleLogin} />
      )}
      {stage === 'quiz' && (
        <QuizPage onFinish={(res) => { setResult(res); setStage('result'); }} />
      )}
      {stage === 'result' && (
        <ResultPage 
          result={result} 
          isReturningUser={isReturningUser}
          onLogout={handleLogout} 
        />
      )}
    </>
  );
}
