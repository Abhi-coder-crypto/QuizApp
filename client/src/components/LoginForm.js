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
  const [sameCollege, setSameCollege] = useState(false);

  const [doctor1, setDoctor1] = useState({
    doctorName: '',
    qualification: '',
    phoneNumber: '',
    email: '',
    collegeFullName: '',
    state: '',
    city: '',
    pincode: ''
  });

  const [doctor2, setDoctor2] = useState({
    doctorName: '',
    qualification: '',
    phoneNumber: '',
    email: '',
    collegeFullName: '',
    state: '',
    city: '',
    pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingUserResult, setExistingUserResult] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        collegeFullName: doctor1.collegeFullName,
        state: doctor1.state,
        city: doctor1.city,
        pincode: doctor1.pincode,
        doctor1Name: doctor1.doctorName,
        doctor1Qualification: doctor1.qualification,
        doctor1PhoneNumber: doctor1.phoneNumber,
        doctor1Email: doctor1.email,
        doctor1CollegeFullName: doctor1.collegeFullName,
        doctor1State: doctor1.state,
        doctor1City: doctor1.city,
        doctor1Pincode: doctor1.pincode,
        doctor2Name: doctor2.doctorName,
        doctor2Qualification: doctor2.qualification,
        doctor2PhoneNumber: doctor2.phoneNumber,
        doctor2Email: doctor2.email,
        doctor2CollegeFullName: sameCollege ? 'NA' : doctor2.collegeFullName,
        doctor2State: sameCollege ? 'NA' : doctor2.state,
        doctor2City: sameCollege ? 'NA' : doctor2.city,
        doctor2Pincode: sameCollege ? 'NA' : doctor2.pincode,
        sameCollege: sameCollege,
        doctorName: `${doctor1.doctorName} & ${doctor2.doctorName}`,
        qualification: `${doctor1.qualification} / ${doctor2.qualification}`,
        phoneNumber: doctor1.phoneNumber,
        email: doctor1.email
      };

      const data = await login(formData);
      
      if (data.hasCompletedQuiz && data.quizResult) {
        setError(data.message || 'This doctor/team has already completed the quiz.');
        setExistingUserResult({
          token: data.token,
          quizResult: data.quizResult
        });
        return;
      }

      if (data.alreadyAttempted) {
        setError(data.message || 'One of the doctors has already attempted the quiz.');
        return;
      }

      if (data.token) {
        setToken(data.token);
        onLogin({
          token: data.token,
          hasCompletedQuiz: data.hasCompletedQuiz,
          quizResult: data.quizResult
        });
      } else if (data.message) {
        setError(data.message);
      } else {
        setError('Login failed');
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
        <form className="login-form" onSubmit={submit}>
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
                <option value="Pulmonary">MD</option>
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

            <h4 className="subsection-title">Institute Details (Doctor 1)</h4>

            <div className="form-group">
              <label>College/Institute Full Name <span className="required">*</span></label>
              <input 
                name="collegeFullName" 
                value={doctor1.collegeFullName} 
                onChange={updateDoctor1}
                required
              />
            </div>

            <div className="form-group">
              <label>State <span className="required">*</span></label>
              <select name="state" value={doctor1.state} onChange={updateDoctor1} required>
                <option value="">Select state</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City <span className="required">*</span></label>
              <input 
                name="city" 
                value={doctor1.city} 
                onChange={updateDoctor1}
                required
              />
            </div>

            <div className="form-group">
              <label>Pincode <span className="required">*</span></label>
              <input 
                name="pincode" 
                value={doctor1.pincode} 
                onChange={updateDoctor1} 
                maxLength="6"
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

            <h4 className="subsection-title">Institute Details (Doctor 2)</h4>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={sameCollege} 
                  onChange={(e) => setSameCollege(e.target.checked)}
                />
                <span>Same college as Doctor 1</span>
              </label>
            </div>

            {sameCollege ? (
              <div className="same-college-note">
                Institute details will be marked as "NA" (Same as Doctor 1)
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>College/Institute Full Name <span className="required">*</span></label>
                  <input 
                    name="collegeFullName" 
                    value={doctor2.collegeFullName} 
                    onChange={updateDoctor2}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State <span className="required">*</span></label>
                  <select name="state" value={doctor2.state} onChange={updateDoctor2} required>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <input 
                    name="city" 
                    value={doctor2.city} 
                    onChange={updateDoctor2}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pincode <span className="required">*</span></label>
                  <input 
                    name="pincode" 
                    value={doctor2.pincode} 
                    onChange={updateDoctor2} 
                    maxLength="6"
                    required
                  />
                </div>
              </>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {existingUserResult ? (
            <div className="existing-user-section">
              <div className="existing-user-message">
                This team has already completed the quiz!
              </div>
              <button 
                type="button" 
                className="submit-btn check-score-btn"
                onClick={() => onLogin({
                  token: existingUserResult.token,
                  hasCompletedQuiz: true,
                  quizResult: existingUserResult.quizResult
                })}
              >
                Check Score
              </button>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={true}
                style={{ opacity: 0.5, cursor: 'not-allowed', marginTop: '10px' }}
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Please wait...
                </>
              ) : (
                'Start Quiz'
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
