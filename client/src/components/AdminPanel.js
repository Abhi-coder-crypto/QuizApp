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
      a.download = 'napcon_users_export.csv';
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

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>NAPCON Admin Panel</h1>
        <div className="admin-actions">
          <button className="export-btn" onClick={exportToExcel}>
            Export to Excel (CSV)
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Registrations</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Quiz Completed</h3>
          <p>{users.filter(u => u.hasCompletedQuiz).length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{users.filter(u => !u.hasCompletedQuiz).length}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor 1</th>
                <th>Doctor 1 Institute</th>
                <th>Doctor 2</th>
                <th>Doctor 2 Institute</th>
                <th>Same College</th>
                <th>Status</th>
                <th>Score</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="doctor-info">
                      <strong>{user.doctor1Name}</strong>
                      <small>{user.doctor1Qualification}</small>
                      <small>{user.doctor1Email}</small>
                      <small>{user.doctor1PhoneNumber}</small>
                    </div>
                  </td>
                  <td>
                    <div className="institute-info">
                      <span>{user.doctor1CollegeFullName}</span>
                      <small>{user.doctor1City}, {user.doctor1State}</small>
                    </div>
                  </td>
                  <td>
                    <div className="doctor-info">
                      <strong>{user.doctor2Name}</strong>
                      <small>{user.doctor2Qualification}</small>
                      <small>{user.doctor2Email}</small>
                      <small>{user.doctor2PhoneNumber}</small>
                    </div>
                  </td>
                  <td>
                    <div className="institute-info">
                      {user.sameCollege ? (
                        <span className="same-college-badge">Same as Doctor 1</span>
                      ) : (
                        <>
                          <span>{user.doctor2CollegeFullName}</span>
                          <small>{user.doctor2City}, {user.doctor2State}</small>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={user.sameCollege ? 'badge-yes' : 'badge-no'}>
                      {user.sameCollege ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={user.hasCompletedQuiz ? 'status-completed' : 'status-pending'}>
                      {user.hasCompletedQuiz ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {user.hasCompletedQuiz ? (
                      <span>{user.score}/{user.totalQuestions}</span>
                    ) : '-'}
                  </td>
                  <td>{formatTime(user.timeTaken)}</td>
                  <td>
                    {user.quizDate 
                      ? new Date(user.quizDate).toLocaleDateString() 
                      : new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
