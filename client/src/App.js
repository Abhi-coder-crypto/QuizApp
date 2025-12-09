import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm.js';
import QuizPage from './components/QuizPage.js';
import ResultPage from './components/ResultPage.js';
import { getToken } from './api.js';

// Logging imports to debug
console.log('LoginForm:', LoginForm);
console.log('QuizPage:', QuizPage);
console.log('ResultPage:', ResultPage);
console.log('getToken:', getToken);

export default function App() {
  const [token, setToken] = useState(getToken());
  const [stage, setStage] = useState('login'); // login | quiz | result
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (getToken()) setStage('quiz');
  }, []);

  return (
    <div className="container">
      <h1>NAPCON Quiz</h1>
      {stage === 'login' && (
        <LoginForm onLogin={(t) => { setToken(t); setStage('quiz'); }} />
      )}
      {stage === 'quiz' && (
        <QuizPage onFinish={(res) => { setResult(res); setStage('result'); }} />
      )}
      {stage === 'result' && (
        <ResultPage result={result} onRestart={() => setStage('login')} />
      )}
    </div>
  );
}
