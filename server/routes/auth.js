const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/login', async (req, res) => {
  try {
    const {
      doctorName,
      qualification,
      phoneNumber,
      email,
      collegeFullName,
      state,
      city,
      pincode,
      attendPhysicalNAPCON,
      doctor1Name,
      doctor1Qualification,
      doctor1PhoneNumber,
      doctor1Email,
      doctor1CollegeFullName,
      doctor1State,
      doctor1City,
      doctor1Pincode,
      doctor2Name,
      doctor2Qualification,
      doctor2PhoneNumber,
      doctor2Email,
      doctor2CollegeFullName,
      doctor2State,
      doctor2City,
      doctor2Pincode,
      sameCollege
    } = req.body;

    if (!doctorName || !email) {
      return res.status(400).json({ message: 'doctorName and email are required' });
    }

    if (doctor1Email) {
      const existingDoctor1 = await User.findOne({ 
        $or: [
          { doctor1Email: doctor1Email },
          { doctor2Email: doctor1Email }
        ],
        'scores.0': { $exists: true }
      });
      if (existingDoctor1) {
        return res.status(403).json({ 
          message: `Doctor 1 (${doctor1Email}) has already attempted the quiz. Each doctor can only attempt once.`,
          alreadyAttempted: true,
          hasCompletedQuiz: true,
          doctorName: doctor1Name || 'Doctor 1',
          quizResult: {
            score: existingDoctor1.scores[0].score,
            total: existingDoctor1.scores[0].total,
            correctAnswers: existingDoctor1.scores[0].correctAnswers,
            wrongAnswers: existingDoctor1.scores[0].wrongAnswers,
            timeTaken: existingDoctor1.scores[0].timeTaken,
            date: existingDoctor1.scores[0].date
          }
        });
      }
    }

    if (doctor2Email) {
      const existingDoctor2 = await User.findOne({ 
        $or: [
          { doctor1Email: doctor2Email },
          { doctor2Email: doctor2Email }
        ],
        'scores.0': { $exists: true }
      });
      if (existingDoctor2) {
        return res.status(403).json({ 
          message: `Doctor 2 (${doctor2Email}) has already attempted the quiz. Each doctor can only attempt once.`,
          alreadyAttempted: true,
          hasCompletedQuiz: true,
          doctorName: doctor2Name || 'Doctor 2',
          quizResult: {
            score: existingDoctor2.scores[0].score,
            total: existingDoctor2.scores[0].total,
            correctAnswers: existingDoctor2.scores[0].correctAnswers,
            wrongAnswers: existingDoctor2.scores[0].wrongAnswers,
            timeTaken: existingDoctor2.scores[0].timeTaken,
            date: existingDoctor2.scores[0].date
          }
        });
      }
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        doctorName,
        qualification,
        phoneNumber,
        email,
        collegeFullName,
        state,
        city,
        pincode,
        attendPhysicalNAPCON,
        doctor1Name,
        doctor1Qualification,
        doctor1PhoneNumber,
        doctor1Email,
        doctor1CollegeFullName,
        doctor1State,
        doctor1City,
        doctor1Pincode,
        doctor2Name,
        doctor2Qualification,
        doctor2PhoneNumber,
        doctor2Email,
        doctor2CollegeFullName,
        doctor2State,
        doctor2City,
        doctor2Pincode,
        sameCollege
      });
    } else {
      if (user.scores && user.scores.length > 0) {
        return res.status(403).json({ 
          message: 'This team has already completed the quiz. Only one attempt is allowed.',
          alreadyAttempted: true,
          hasCompletedQuiz: true,
          quizResult: {
            score: user.scores[0].score,
            total: user.scores[0].total,
            correctAnswers: user.scores[0].correctAnswers,
            wrongAnswers: user.scores[0].wrongAnswers,
            timeTaken: user.scores[0].timeTaken,
            date: user.scores[0].date
          }
        });
      }

      user.doctorName = doctorName;
      user.qualification = qualification;
      user.phoneNumber = phoneNumber;
      user.collegeFullName = collegeFullName;
      user.state = state;
      user.city = city;
      user.pincode = pincode;
      user.attendPhysicalNAPCON = attendPhysicalNAPCON;
      user.doctor1Name = doctor1Name;
      user.doctor1Qualification = doctor1Qualification;
      user.doctor1PhoneNumber = doctor1PhoneNumber;
      user.doctor1Email = doctor1Email;
      user.doctor1CollegeFullName = doctor1CollegeFullName;
      user.doctor1State = doctor1State;
      user.doctor1City = doctor1City;
      user.doctor1Pincode = doctor1Pincode;
      user.doctor2Name = doctor2Name;
      user.doctor2Qualification = doctor2Qualification;
      user.doctor2PhoneNumber = doctor2PhoneNumber;
      user.doctor2Email = doctor2Email;
      user.doctor2CollegeFullName = doctor2CollegeFullName;
      user.doctor2State = doctor2State;
      user.doctor2City = doctor2City;
      user.doctor2Pincode = doctor2Pincode;
      user.sameCollege = sameCollege;
    }

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const hasCompletedQuiz = user.scores && user.scores.length > 0;
    const quizResult = hasCompletedQuiz ? {
      score: user.scores[0].score,
      total: user.scores[0].total,
      correctAnswers: user.scores[0].correctAnswers,
      wrongAnswers: user.scores[0].wrongAnswers,
      timeTaken: user.scores[0].timeTaken,
      date: user.scores[0].date
    } : null;

    res.json({ 
      token, 
      user,
      hasCompletedQuiz,
      quizResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/status', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const hasCompletedQuiz = user.scores && user.scores.length > 0;
    const quizResult = hasCompletedQuiz ? {
      score: user.scores[0].score,
      total: user.scores[0].total,
      correctAnswers: user.scores[0].correctAnswers,
      wrongAnswers: user.scores[0].wrongAnswers,
      timeTaken: user.scores[0].timeTaken,
      date: user.scores[0].date
    } : null;
    
    res.json({ 
      valid: true,
      hasCompletedQuiz,
      quizResult,
      user: {
        email: user.email,
        doctorName: user.doctorName
      }
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', valid: false });
  }
});

module.exports = router;
