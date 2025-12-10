import React, { useState } from 'react';
import { login, setToken } from '../api.js';

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({
    doctorName: '',
    qualification: '',
    phoneNumber: '',
    email: '',
    collegeFullName: '',
    state: '',
    city: '',
    pincode: '',
    attendPhysicalNAPCON: 'No'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      if (data.token) {
        setToken(data.token);
        onLogin({
          token: data.token,
          hasCompletedQuiz: data.hasCompletedQuiz,
          quizResult: data.quizResult
        });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-header">
          <img src="/napcon_logo.jpg" alt="NAPCON 2025" className="napcon-logo" />
          
          <h2 className="register-title">Kindly register for PG Quiz!</h2>
          <p className="eligibility">
            <strong>Eligibility Criteria:</strong> MD/DNB/Diploma respiratory diseases <strong>(PG students)</strong>
          </p>
          
          <div className="note-box">
            <strong>Note:</strong><br />
            This quiz is designed for PG students in pulmonary medicine only<br />
            SR/DM Pulmonary medicine candidates should not participate
          </div>
        </div>

        <form className="login-form" onSubmit={submit}>
          <div className="form-group">
            <label>Doctor name <span className="required">*</span></label>
            <input 
              name="doctorName" 
              value={form.doctorName} 
              onChange={update} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Qualification <span className="required">*</span></label>
            <select name="qualification" value={form.qualification} onChange={update} required>
              <option value="">Select qualification</option>
              <option value="MD">MD</option>
              <option value="DM">DM</option>
              <option value="DNB">DNB</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number <span className="required">*</span></label>
            <input 
              name="phoneNumber" 
              value={form.phoneNumber} 
              onChange={update} 
              placeholder="10 digit number"
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label>E mail id <span className="required">*</span></label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={update} 
              required 
            />
          </div>

          <div className="form-group">
            <label>College Full Name <span className="required">*</span></label>
            <input 
              name="collegeFullName" 
              value={form.collegeFullName} 
              onChange={update}
              required
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input 
              name="state" 
              value={form.state} 
              onChange={update}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input 
              name="city" 
              value={form.city} 
              onChange={update}
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input 
              name="pincode" 
              value={form.pincode} 
              onChange={update} 
              maxLength="6"
            />
          </div>

          <div className="form-group">
            <label>Are you planning to attend physical NAPCON?</label>
            <select name="attendPhysicalNAPCON" value={form.attendPhysicalNAPCON} onChange={update}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Please wait...
              </>
            ) : (
              'Submit & Start Quiz'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
