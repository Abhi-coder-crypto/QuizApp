const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not found in env');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const userId = '693857c8ee7dfa7747fd4467';
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      process.exit(1);
    }

    if (!user.scores || user.scores.length === 0) {
      console.log('User has no scores. Nothing to update.');
      console.log('User:', user.email);
      process.exit(0);
    }

    // Update first score item
    const s = user.scores[0];
    console.log('Before update:', {
      score: s.score,
      correctAnswers: s.correctAnswers,
      wrongAnswers: s.wrongAnswers,
      answeredQuestions: s.answeredQuestions,
      rawAnswers: s.rawAnswers && s.rawAnswers.length,
      answers: s.answers && s.answers.length
    });

    s.score = 0;
    // if other fields are undefined, set safe defaults (optional)
    if (typeof s.correctAnswers === 'undefined') s.correctAnswers = 0;
    if (typeof s.wrongAnswers === 'undefined') s.wrongAnswers = 0;
    if (typeof s.answeredQuestions === 'undefined') s.answeredQuestions = 0;

    await user.save();

    const updated = await User.findById(userId).lean();
    console.log('After update:', updated.scores[0]);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    try { await mongoose.disconnect(); } catch(e){}
    process.exit(1);
  }
}

run();
