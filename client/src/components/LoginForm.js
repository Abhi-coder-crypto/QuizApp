import React, { useState } from 'react';
import { login, setToken } from '../api.js';

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({
    doctorName: '',
    qualification: 'MD',
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
        onLogin(data.token);
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
          <h1>NAPCON Quiz</h1>
          <p>Please fill in your details to start the quiz</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <div className="form-group">
            <label>Doctor Name <span className="required">*</span></label>
            <input 
              name="doctorName" 
              value={form.doctorName} 
              onChange={update} 
              placeholder="Enter your full name"
              required 
            />
          </div>

          <div className="form-row-inline">
            <div className="form-group">
              <label>Qualification</label>
              <select name="qualification" value={form.qualification} onChange={update}>
                <option value="MD">MD</option>
                <option value="DM">DM</option>
                <option value="DNB">DNB</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                name="phoneNumber" 
                value={form.phoneNumber} 
                onChange={update} 
                placeholder="10-digit number"
                maxLength="10"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email ID <span className="required">*</span></label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={update} 
              placeholder="your@email.com"
              required 
            />
          </div>

          <div className="form-group">
            <label>College Full Name</label>
            <input 
              name="collegeFullName" 
              value={form.collegeFullName} 
              onChange={update}
              placeholder="Enter your college name" 
            />
          </div>

          <div className="form-row-inline">
            <div className="form-group">
              <label>State</label>
              <input 
                name="state" 
                value={form.state} 
                onChange={update}
                placeholder="State" 
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input 
                name="city" 
                value={form.city} 
                onChange={update}
                placeholder="City" 
              />
            </div>
          </div>

          <div className="form-row-inline">
            <div className="form-group">
              <label>Pincode</label>
              <input 
                name="pincode" 
                value={form.pincode} 
                onChange={update} 
                placeholder="6-digit"
                maxLength="6"
              />
            </div>

            <div className="form-group">
              <label>Attending NAPCON?</label>
              <select name="attendPhysicalNAPCON" value={form.attendPhysicalNAPCON} onChange={update}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
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
