import React, { useEffect } from 'react';

function WelcomePage({ onNext }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <div className="welcome-header">
          <img src="/napcon_logo.jpg" alt="NAPCON 2025" className="napcon-logo" />
        </div>

        <h2 className="register-title">Team Registration for PG Quiz!</h2>
        <p className="eligibility">
          <strong>Eligibility Criteria:</strong> Pulmonologist <strong>(PG students)</strong>
        </p>
        <p className="team-note-main">Each team will be composed of two PGs from same institute</p>

        <div className="note-box">
          <strong>Note:</strong><br />
          This quiz is designed for PG students in pulmonary medicine only.<br />
          SR/DM Pulmonary medicine candidates should not participate.
        </div>

        <div className="rules-section" style={{ textAlign: "left" }}>
          <h3 className="rules-title">Rules</h3>
          <ul className="rules-list">
            <li>Total Number Of Questions = 30</li>
            <li>30 Seconds For Each Question</li>
            <li>Correct Answer Marks +2</li>
            <li>Incorrect Answer Marks -1</li>
            <li>Total time taken will be used as a tie breaker</li>
          </ul>
        </div>


        <button className="next-btn" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
