import React, { useState, useEffect } from 'react';
import { login, setToken } from '../api.js';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

function LoginForm({ onLogin }) {
  const [teamForm, setTeamForm] = useState({
    collegeFullName: '',
    state: '',
    city: '',
    pincode: ''
  });

  const [doctor1, setDoctor1] = useState({
    doctorName: '',
    qualification: '',
    phoneNumber: '',
    email: ''
  });

  const [doctor2, setDoctor2] = useState({
    doctorName: '',
    qualification: '',
    phoneNumber: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function updateTeam(e) {
    const { name, value } = e.target;
    setTeamForm(f => ({ ...f, [name]: value }));
  }

  function updateDoctor1(e) {
    const { name, value } = e.target;
    setDoctor1(f => ({ ...f, [name]: value }));
  }

  function updateDoctor2(e) {
    const { name, value } = e.target;
    setDoctor2(f => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = {
        ...teamForm,
        doctor1Name: doctor1.doctorName,
        doctor1Qualification: doctor1.qualification,
        doctor1PhoneNumber: doctor1.phoneNumber,
        doctor1Email: doctor1.email,
        doctor2Name: doctor2.doctorName,
        doctor2Qualification: doctor2.qualification,
        doctor2PhoneNumber: doctor2.phoneNumber,
        doctor2Email: doctor2.email,
        doctorName: `${doctor1.doctorName} & ${doctor2.doctorName}`,
        qualification: `${doctor1.qualification} / ${doctor2.qualification}`,
        phoneNumber: doctor1.phoneNumber,
        email: doctor1.email
      };

      const data = await login(formData);
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
          <h2 className="register-title">Team Registration for PG Quiz!</h2>
          <p className="eligibility">
            <strong>Eligibility Criteria:</strong> MD/DNB/Diploma respiratory diseases <strong>(PG students)</strong>
          </p>
          <p className="team-note">Each team will be composed of two PGs from same institute</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <div className="team-section">
            <h3 className="section-title">Institute Details</h3>
            
            <div className="form-group">
              <label>College/Institute Full Name <span className="required">*</span></label>
              <input 
                name="collegeFullName" 
                value={teamForm.collegeFullName} 
                onChange={updateTeam}
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <select name="state" value={teamForm.state} onChange={updateTeam}>
                <option value="">Select state</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City</label>
              <input 
                name="city" 
                value={teamForm.city} 
                onChange={updateTeam}
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input 
                name="pincode" 
                value={teamForm.pincode} 
                onChange={updateTeam} 
                maxLength="6"
              />
            </div>
          </div>

          <div className="doctor-section">
            <h3 className="section-title">Doctor 1 Details</h3>
            
            <div className="form-group">
              <label>Doctor Name <span className="required">*</span></label>
              <input 
                name="doctorName" 
                value={doctor1.doctorName} 
                onChange={updateDoctor1} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Qualification <span className="required">*</span></label>
              <select name="qualification" value={doctor1.qualification} onChange={updateDoctor1} required>
                <option value="">Select qualification</option>
                <option value="MD">MD</option>
                <option value="DNB">DNB</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input 
                name="phoneNumber" 
                value={doctor1.phoneNumber} 
                onChange={updateDoctor1} 
                placeholder="10 digit number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input 
                name="email" 
                type="email" 
                value={doctor1.email} 
                onChange={updateDoctor1} 
                required 
              />
            </div>
          </div>

          <div className="doctor-section">
            <h3 className="section-title">Doctor 2 Details</h3>
            
            <div className="form-group">
              <label>Doctor Name <span className="required">*</span></label>
              <input 
                name="doctorName" 
                value={doctor2.doctorName} 
                onChange={updateDoctor2} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Qualification <span className="required">*</span></label>
              <select name="qualification" value={doctor2.qualification} onChange={updateDoctor2} required>
                <option value="">Select qualification</option>
                <option value="MD">MD</option>
                <option value="DNB">DNB</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input 
                name="phoneNumber" 
                value={doctor2.phoneNumber} 
                onChange={updateDoctor2} 
                placeholder="10 digit number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input 
                name="email" 
                type="email" 
                value={doctor2.email} 
                onChange={updateDoctor2} 
                required 
              />
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
