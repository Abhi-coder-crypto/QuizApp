import React from 'react';

function ResultPage({ result, onRestart }) {
  if (!result) return <div>No result available</div>;

  return (
    <div>
      <h2>Your Score</h2>
      <p style={{fontSize:20, fontWeight:700}}>{result.score} / {result.total}</p>
      <p className="small">Your result has been saved to your profile.</p>
      <button onClick={() => { localStorage.removeItem('token'); onRestart(); }}>Logout / Restart</button>
    </div>
  );
}

export default ResultPage;
