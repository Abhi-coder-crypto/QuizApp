import React, { useEffect, useState } from 'react';
import WelcomePage from './components/WelcomePage.js';
import LoginForm from './components/LoginForm.js';
import QuizPage from './components/QuizPage.js';
import ResultPage from './components/ResultPage.js';
import AdminPanel from './components/AdminPanel.js';
import { getToken, checkStatus } from './api.js';
import './styles.css';

export default function App() {
  const [token, setToken] = useState(getToken());
  const [stage, setStage] = useState('welcome');
  const [result, setResult] = useState(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setStage('admin');
      setLoading(false);
      return;
    }

    async function verifySession() {
      const savedToken = getToken();
      if (savedToken) {
        const status = await checkStatus();
        if (status.valid) {
          if (status.hasCompletedQuiz) {
            localStorage.removeItem('token');
            setToken(null);
            setStage('welcome');
          } else {
            setStage('quiz');
          }
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setStage('welcome');
        }
      }
      setLoading(false);
    }
    verifySession();
  }, []);

  function handleNext() {
    setStage('login');
  }

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
    setStage('welcome');
  }

  if (loading) {
    return (
      <div className="login-overlay">
        <div className="login-card" style={{ textAlign: 'center', padding: '40px' }}>
          <span className="spinner"></span>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (stage === 'admin') {
    return <AdminPanel />;
  }

  return (
    <>
      {stage === 'welcome' && (
        <WelcomePage onNext={handleNext} />
      )}
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
