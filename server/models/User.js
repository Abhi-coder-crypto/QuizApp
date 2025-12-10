const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  answeredQuestions: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  rawAnswers: [{ 
    questionIndex: Number, 
    answerIndex: Number 
  }],
  answers: [{
    questionIndex: Number,
    givenAnswer: Number
  }]
});

const UserSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  qualification: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true, unique: true },
  collegeFullName: { type: String },
  state: { type: String },
  city: { type: String },
  pincode: { type: String },
  attendPhysicalNAPCON: { type: String },
  doctor1Name: { type: String },
  doctor1Qualification: { type: String },
  doctor1PhoneNumber: { type: String },
  doctor1Email: { type: String },
  doctor2Name: { type: String },
  doctor2Qualification: { type: String },
  doctor2PhoneNumber: { type: String },
  doctor2Email: { type: String },
  createdAt: { type: Date, default: Date.now },
  scores: [ScoreSchema]
});

module.exports = mongoose.model('User', UserSchema);
