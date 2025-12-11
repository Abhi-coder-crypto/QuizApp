import React, { useState, useEffect } from 'react';

const API_BASE = window.location.origin;

function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchUsers();
    }
  }, [isLoggedIn, token]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
  }

  async function exportToExcel() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'napcon_quiz_results.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  }

  function formatTime(seconds) {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <img src="/napcon_logo.jpg" alt="NAPCON Logo" className="admin-logo" />
            <h2>Admin Login</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const completedTeams = users.filter(u => u.hasCompletedQuiz);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-left">
          <img src="/napcon_logo.jpg" alt="NAPCON Logo" className="admin-header-logo" />
          <div>
            <h1>NAPCON Admin Panel</h1>
            <p className="admin-subtitle">PG Quiz Competition Management</p>
          </div>
        </div>
        <div className="admin-actions">
          <button className="export-btn" onClick={exportToExcel}>
            Export to Excel (.xlsx)
          </button>
          <button className="refresh-btn" onClick={fetchUsers}>
            Refresh
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card stat-total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Teams</h3>
            <p>{totalUsers}</p>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Quiz Completed</h3>
            <p>{completedTeams.length}</p>
          </div>
        </div>
        <div className="stat-card stat-avg">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Avg Score</h3>
            <p>
              {completedTeams.length > 0 
                ? (completedTeams.reduce((acc, u) => acc + (u.score || 0), 0) / completedTeams.length).toFixed(1)
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="teams-container">
          <h2 className="section-header">Registered Teams ({totalUsers})</h2>
          
          {users.length === 0 ? (
            <div className="no-data">No teams registered yet</div>
          ) : (
            <div className="teams-grid">
              {users.map((user, index) => (
                <div key={user.id} className={`team-card ${user.hasCompletedQuiz ? 'completed' : 'pending'}`}>
                  <div className="team-header">
                    <span className="team-number">Team #{index + 1}</span>
                    <span className={`team-status ${user.hasCompletedQuiz ? 'status-completed' : 'status-pending'}`}>
                      {user.hasCompletedQuiz ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  {user.hasCompletedQuiz && (
                    <div className="team-score-section">
                      <div className="score-display-admin">
                        <div className="score-value-admin">{user.score}</div>
                        <div className="score-divider-admin">/</div>
                        <div className="score-total-admin">{user.totalQuestions}</div>
                      </div>
                      <div className="score-details">
                        <span className="correct">✓ {user.correctAnswers}</span>
                        <span className="wrong">✗ {user.wrongAnswers}</span>
                        <span className="time">⏱ {formatTime(user.timeTaken)}</span>
                      </div>
                    </div>
                  )}

                  <div className="doctors-container">
                    <div className="doctor-card">
                      <div className="doctor-label">Doctor 1</div>
                      <div className="doctor-name">{user.doctor1Name || '-'}</div>
                      <div className="doctor-detail">
                        <span className="detail-label">Qualification:</span>
                        <span>{user.doctor1Qualification || '-'}</span>
                      </div>
                      <div className="doctor-detail">
                        <span className="detail-label">Email:</span>
                        <span>{user.doctor1Email || '-'}</span>
                      </div>
                      <div className="doctor-detail">
                        <span className="detail-label">Phone:</span>
                        <span>{user.doctor1PhoneNumber || '-'}</span>
                      </div>
                      <div className="institute-section">
                        <div className="institute-label">Institute</div>
                        <div className="institute-name">{user.doctor1CollegeFullName || '-'}</div>
                        <div className="institute-location">
                          {user.doctor1City || '-'}, {user.doctor1State || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="doctor-card">
                      <div className="doctor-label">Doctor 2</div>
                      <div className="doctor-name">{user.doctor2Name || '-'}</div>
                      <div className="doctor-detail">
                        <span className="detail-label">Qualification:</span>
                        <span>{user.doctor2Qualification || '-'}</span>
                      </div>
                      <div className="doctor-detail">
                        <span className="detail-label">Email:</span>
                        <span>{user.doctor2Email || '-'}</span>
                      </div>
                      <div className="doctor-detail">
                        <span className="detail-label">Phone:</span>
                        <span>{user.doctor2PhoneNumber || '-'}</span>
                      </div>
                      <div className="institute-section">
                        <div className="institute-label">Institute</div>
                        {user.sameCollege ? (
                          <div className="same-college-badge-admin">Same as Doctor 1</div>
                        ) : (
                          <>
                            <div className="institute-name">{user.doctor2CollegeFullName || '-'}</div>
                            <div className="institute-location">
                              {user.doctor2City || '-'}, {user.doctor2State || '-'}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="team-footer">
                    <span className="registration-date">
                      Registered: {formatDate(user.createdAt)}
                    </span>
                    {user.quizDate && (
                      <span className="quiz-date">
                        Quiz: {formatDate(user.quizDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
