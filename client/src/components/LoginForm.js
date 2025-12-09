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
    <form onSubmit={submit}>
      <div className="form-row">
        <label>Doctor name *</label>
        <input name="doctorName" value={form.doctorName} onChange={update} required />
      </div>

      <div className="form-row">
        <label>Qualification</label>
        <select name="qualification" value={form.qualification} onChange={update}>
          <option>MD</option>
          <option>DM</option>
          <option>DNB</option>
        </select>
      </div>

      <div className="form-row">
        <label>Phone Number</label>
        <input name="phoneNumber" value={form.phoneNumber} onChange={update} maxLength="10"/>
      </div>

      <div className="form-row">
        <label>E mail id *</label>
        <input name="email" type="email" value={form.email} onChange={update} required />
      </div>

      <div className="form-row">
        <label>College Full Name</label>
        <input name="collegeFullName" value={form.collegeFullName} onChange={update} />
      </div>

      <div className="form-row">
        <label>State</label>
        <input name="state" value={form.state} onChange={update} />
      </div>

      <div className="form-row">
        <label>City</label>
        <input name="city" value={form.city} onChange={update} />
      </div>

      <div className="form-row">
        <label>Pincode</label>
        <input name="pincode" value={form.pincode} onChange={update} maxLength="6"/>
      </div>

      <div className="form-row">
        <label>Are you planning to attend physical NAPCON?</label>
        <select name="attendPhysicalNAPCON" value={form.attendPhysicalNAPCON} onChange={update}>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      {error && <div style={{color:'red'}}>{error}</div>}
      <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Submit & Start Quiz'}</button>
    </form>
  );
}

export default LoginForm;
