import React from 'react';

function ResultPage({ result, isReturningUser, onLogout }) {
  if (!result) return <div className="login-overlay"><div className="login-card">No result available</div></div>;

  const percentage = Math.round((result.score / result.total) * 100);
  const completionDate = result.date ? new Date(result.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;

  function formatTime(seconds) {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  }

  return (
    <div className="login-overlay">
      <div className="login-card result-card">
        <div className="result-header">
          <img src="/napcon_logo.jpg" alt="NAPCON 2025" className="napcon-logo result-logo" />
          {isReturningUser ? (
            <>
              <div className="result-icon returning">&#128274;</div>
              <h1>Quiz Already Completed</h1>
              <p className="result-subtitle">Your team has already taken this quiz. Only one attempt is allowed per team.</p>
            </>
          ) : (
            <>
              <div className="result-icon success">&#127942;</div>
              <h1>Quiz Completed!</h1>
              <p className="result-subtitle">Congratulations on completing the NAPCON PG Quiz</p>
            </>
          )}
        </div>

        <div className="score-display">
          <div className="score-circle">
            <span className="score-value">{result.score}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{result.total}</span>
          </div>
          <div className="score-percentage">{percentage}%</div>
        </div>

        <div className="stats-grid">
          <div className="stat-item correct">
            <span className="stat-value">{result.correctAnswers || 0}</span>
            <span className="stat-label">Correct (+2 each)</span>
          </div>
          <div className="stat-item wrong">
            <span className="stat-value">{result.wrongAnswers || 0}</span>
            <span className="stat-label">Wrong (-1 each)</span>
          </div>
        </div>

        {result.unattempted > 0 && (
          <div className="unattempted-info">
            <span>Unattempted: {result.unattempted} (0 marks each)</span>
          </div>
        )}

        <div className="time-display">
          <span className="time-icon">&#9201;</span>
          <span className="time-label">Time Taken:</span>
          <span className="time-value">{formatTime(result.timeTaken)}</span>
        </div>

        {completionDate && (
          <p className="completion-date">Completed on {completionDate}</p>
        )}

        <p className="saved-note">Your result has been saved. Time is recorded for tie-breaker purposes.</p>

        <button className="submit-btn logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
