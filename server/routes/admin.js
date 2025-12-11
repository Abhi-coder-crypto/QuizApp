const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || (JWT_SECRET + '_admin');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Napcon';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Napcon@123';

const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000;

const adminAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET);
    if (!payload.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  const attempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
  
  if (attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.lastAttempt < LOCKOUT_TIME) {
    const remainingTime = Math.ceil((LOCKOUT_TIME - (Date.now() - attempts.lastAttempt)) / 60000);
    return res.status(429).json({ 
      message: `Too many login attempts. Try again in ${remainingTime} minutes.`,
      success: false 
    });
  }
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    loginAttempts.delete(clientIP);
    const token = jwt.sign({ isAdmin: true, username }, ADMIN_JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, success: true });
  }
  
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(clientIP, attempts);
  
  return res.status(401).json({ message: 'Invalid credentials', success: false });
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    const usersData = users.map(user => ({
      id: user._id,
      doctor1Name: user.doctor1Name || '',
      doctor1Qualification: user.doctor1Qualification || '',
      doctor1PhoneNumber: user.doctor1PhoneNumber || user.phoneNumber || '',
      doctor1Email: user.doctor1Email || user.email || '',
      doctor1CollegeFullName: user.doctor1CollegeFullName || user.collegeFullName || '',
      doctor1State: user.doctor1State || user.state || '',
      doctor1City: user.doctor1City || user.city || '',
      doctor1Pincode: user.doctor1Pincode || user.pincode || '',
      doctor2Name: user.doctor2Name || '',
      doctor2Qualification: user.doctor2Qualification || '',
      doctor2PhoneNumber: user.doctor2PhoneNumber || '',
      doctor2Email: user.doctor2Email || '',
      doctor2CollegeFullName: user.doctor2CollegeFullName || '',
      doctor2State: user.doctor2State || '',
      doctor2City: user.doctor2City || '',
      doctor2Pincode: user.doctor2Pincode || '',
      sameCollege: user.sameCollege || false,
      teamCollegeFullName: user.collegeFullName || '',
      teamState: user.state || '',
      teamCity: user.city || '',
      teamPincode: user.pincode || '',
      hasCompletedQuiz: user.scores && user.scores.length > 0,
      score: user.scores && user.scores.length > 0 ? user.scores[0].score : null,
      totalQuestions: user.scores && user.scores.length > 0 ? user.scores[0].total : null,
      correctAnswers: user.scores && user.scores.length > 0 ? user.scores[0].correctAnswers : null,
      wrongAnswers: user.scores && user.scores.length > 0 ? user.scores[0].wrongAnswers : null,
      timeTaken: user.scores && user.scores.length > 0 ? user.scores[0].timeTaken : null,
      quizDate: user.scores && user.scores.length > 0 ? user.scores[0].date : null,
      createdAt: user.createdAt
    }));
    
    res.json({ users: usersData, total: usersData.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/export', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    const headers = [
      'Team College',
      'Team State',
      'Team City',
      'Team Pincode',
      'Doctor 1 Name',
      'Doctor 1 Qualification',
      'Doctor 1 Phone',
      'Doctor 1 Email',
      'Doctor 1 College',
      'Doctor 1 State',
      'Doctor 1 City',
      'Doctor 1 Pincode',
      'Doctor 2 Name',
      'Doctor 2 Qualification',
      'Doctor 2 Phone',
      'Doctor 2 Email',
      'Doctor 2 College',
      'Doctor 2 State',
      'Doctor 2 City',
      'Doctor 2 Pincode',
      'Same College',
      'Quiz Completed',
      'Score',
      'Total Questions',
      'Correct Answers',
      'Wrong Answers',
      'Time Taken (seconds)',
      'Quiz Date',
      'Registration Date'
    ];
    
    const rows = users.map(user => [
      user.collegeFullName || '',
      user.state || '',
      user.city || '',
      user.pincode || '',
      user.doctor1Name || '',
      user.doctor1Qualification || '',
      user.doctor1PhoneNumber || user.phoneNumber || '',
      user.doctor1Email || user.email || '',
      user.doctor1CollegeFullName || user.collegeFullName || '',
      user.doctor1State || user.state || '',
      user.doctor1City || user.city || '',
      user.doctor1Pincode || user.pincode || '',
      user.doctor2Name || '',
      user.doctor2Qualification || '',
      user.doctor2PhoneNumber || '',
      user.doctor2Email || '',
      user.doctor2CollegeFullName || '',
      user.doctor2State || '',
      user.doctor2City || '',
      user.doctor2Pincode || '',
      user.sameCollege ? 'Yes' : 'No',
      user.scores && user.scores.length > 0 ? 'Yes' : 'No',
      user.scores && user.scores.length > 0 ? user.scores[0].score : '',
      user.scores && user.scores.length > 0 ? user.scores[0].total : '',
      user.scores && user.scores.length > 0 ? user.scores[0].correctAnswers : '',
      user.scores && user.scores.length > 0 ? user.scores[0].wrongAnswers : '',
      user.scores && user.scores.length > 0 ? user.scores[0].timeTaken : '',
      user.scores && user.scores.length > 0 ? new Date(user.scores[0].date).toISOString() : '',
      user.createdAt ? new Date(user.createdAt).toISOString() : ''
    ]);
    
    const escapeCell = (cell) => {
      if (cell === null || cell === undefined) return '';
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const csv = [
      headers.map(escapeCell).join(','),
      ...rows.map(row => row.map(escapeCell).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=napcon_users_export.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
