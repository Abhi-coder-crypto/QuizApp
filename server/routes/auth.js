const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// POST /api/auth/login
// Creates or updates a user by email and returns a token + user
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
      attendPhysicalNAPCON
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
        attendPhysicalNAPCON
      });
    } else {
      // update basic profile fields
      user.doctorName = doctorName;
      user.qualification = qualification;
      user.phoneNumber = phoneNumber;
      user.collegeFullName = collegeFullName;
      user.state = state;
      user.city = city;
      user.pincode = pincode;
      user.attendPhysicalNAPCON = attendPhysicalNAPCON;
    }

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
