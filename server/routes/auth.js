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
      doctor2Name,
      doctor2Qualification,
      doctor2PhoneNumber,
      doctor2Email
    } = req.body;

    if (!doctorName || !email) {
      return res.status(400).json({ message: 'doctorName and email are required' });
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
        doctor2Name,
        doctor2Qualification,
        doctor2PhoneNumber,
        doctor2Email
      });
    } else {
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
      user.doctor2Name = doctor2Name;
      user.doctor2Qualification = doctor2Qualification;
      user.doctor2PhoneNumber = doctor2PhoneNumber;
      user.doctor2Email = doctor2Email;
    }

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const hasCompletedQuiz = user.scores && user.scores.length > 0;
    const quizResult = hasCompletedQuiz ? {
      score: user.scores[0].score,
      total: user.scores[0].total,
      correctAnswers: user.scores[0].correctAnswers,
      wrongAnswers: user.scores[0].wrongAnswers,
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

module.exports = router;
