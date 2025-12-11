const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');
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
    
    const data = users.map((user, index) => ({
      'Team #': index + 1,
      'Status': user.scores && user.scores.length > 0 ? 'Completed' : 'Pending',
      'Score': user.scores && user.scores.length > 0 ? user.scores[0].score : null,
      'Total': user.scores && user.scores.length > 0 ? user.scores[0].total : null,
      'Correct': user.scores && user.scores.length > 0 ? user.scores[0].correctAnswers : null,
      'Wrong': user.scores && user.scores.length > 0 ? user.scores[0].wrongAnswers : null,
      'Time (sec)': user.scores && user.scores.length > 0 ? user.scores[0].timeTaken : null,
      'Doctor 1 Name': user.doctor1Name || '',
      'Doctor 1 Qualification': user.doctor1Qualification || '',
      'Doctor 1 Phone': user.doctor1PhoneNumber || user.phoneNumber || '',
      'Doctor 1 Email': user.doctor1Email || user.email || '',
      'Doctor 1 College': user.doctor1CollegeFullName || user.collegeFullName || '',
      'Doctor 1 City': user.doctor1City || user.city || '',
      'Doctor 1 State': user.doctor1State || user.state || '',
      'Doctor 1 Pincode': user.doctor1Pincode || user.pincode || '',
      'Doctor 2 Name': user.doctor2Name || '',
      'Doctor 2 Qualification': user.doctor2Qualification || '',
      'Doctor 2 Phone': user.doctor2PhoneNumber || '',
      'Doctor 2 Email': user.doctor2Email || '',
      'Doctor 2 College': user.sameCollege ? (user.doctor1CollegeFullName || user.collegeFullName || '') : (user.doctor2CollegeFullName || ''),
      'Doctor 2 City': user.sameCollege ? (user.doctor1City || user.city || '') : (user.doctor2City || ''),
      'Doctor 2 State': user.sameCollege ? (user.doctor1State || user.state || '') : (user.doctor2State || ''),
      'Doctor 2 Pincode': user.sameCollege ? (user.doctor1Pincode || user.pincode || '') : (user.doctor2Pincode || ''),
      'Same College': user.sameCollege ? 'Yes' : 'No',
      'Quiz Date': user.scores && user.scores.length > 0 ? new Date(user.scores[0].date).toLocaleString() : '-',
      'Registration Date': user.createdAt ? new Date(user.createdAt).toLocaleString() : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    const colWidths = [
      { wch: 8 },   // Team #
      { wch: 10 },  // Status
      { wch: 8 },   // Score
      { wch: 8 },   // Total
      { wch: 8 },   // Correct
      { wch: 8 },   // Wrong
      { wch: 12 },  // Time
      { wch: 25 },  // Doctor 1 Name
      { wch: 15 },  // Doctor 1 Qualification
      { wch: 15 },  // Doctor 1 Phone
      { wch: 30 },  // Doctor 1 Email
      { wch: 35 },  // Doctor 1 College
      { wch: 15 },  // Doctor 1 City
      { wch: 20 },  // Doctor 1 State
      { wch: 10 },  // Doctor 1 Pincode
      { wch: 25 },  // Doctor 2 Name
      { wch: 15 },  // Doctor 2 Qualification
      { wch: 15 },  // Doctor 2 Phone
      { wch: 30 },  // Doctor 2 Email
      { wch: 35 },  // Doctor 2 College
      { wch: 15 },  // Doctor 2 City
      { wch: 20 },  // Doctor 2 State
      { wch: 10 },  // Doctor 2 Pincode
      { wch: 12 },  // Same College
      { wch: 20 },  // Quiz Date
      { wch: 20 }   // Registration Date
    ];
    worksheet['!cols'] = colWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'NAPCON Quiz Results');
    
    const summary = [
      { 'Metric': 'Total Teams', 'Value': users.length },
      { 'Metric': 'Completed', 'Value': users.filter(u => u.scores && u.scores.length > 0).length },
      { 'Metric': 'Pending', 'Value': users.filter(u => !u.scores || u.scores.length === 0).length },
      { 'Metric': 'Average Score', 'Value': (() => {
        const completed = users.filter(u => u.scores && u.scores.length > 0);
        if (completed.length === 0) return '-';
        const avg = completed.reduce((acc, u) => acc + u.scores[0].score, 0) / completed.length;
        return avg.toFixed(2);
      })() },
      { 'Metric': 'Highest Score', 'Value': (() => {
        const completed = users.filter(u => u.scores && u.scores.length > 0);
        if (completed.length === 0) return '-';
        return Math.max(...completed.map(u => u.scores[0].score));
      })() },
      { 'Metric': 'Lowest Score', 'Value': (() => {
        const completed = users.filter(u => u.scores && u.scores.length > 0);
        if (completed.length === 0) return '-';
        return Math.min(...completed.map(u => u.scores[0].score));
      })() }
    ];
    
    const summarySheet = XLSX.utils.json_to_sheet(summary);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=napcon_quiz_results.xlsx');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
