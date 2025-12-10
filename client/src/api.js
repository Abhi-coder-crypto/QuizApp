const BASE_URL = '';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const login = async (profile) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  return res.json();
};

export const fetchQuestions = async () => {
  const res = await fetch(`${BASE_URL}/api/quiz/questions`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const submitAnswers = async (answers, timeTaken) => {
  const res = await fetch(`${BASE_URL}/api/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ answers, timeTaken })
  });
  return res.json();
};

export const checkStatus = async () => {
  const token = getToken();
  if (!token) return { valid: false };
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  } catch (err) {
    return { valid: false };
  }
};
