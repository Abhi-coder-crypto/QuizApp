const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware for protected routes
async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/* ------------------------------------------
   ★★★ FINAL 30 QUESTIONS LOADED ★★★
-------------------------------------------*/
const questions = [
  { text: "Which statement regarding pulmonary hypertension due to chronic lung disease (Group 3 PH) is TRUE?", options: ["PDE-5 inhibitors recommended in moderate–severe PH", "Riociguat is first-line", "Inhaled treprostinil improves exercise capacity", "Endothelin antagonists improve FVC"], correctIndex: 2 },
  { text: "In sarcoidosis, which factor predicts progression to pulmonary fibrosis most reliably?", options: ["Löfgren syndrome", "Scadding Stage II", "Persistent lymphopenia", "Elevated ACE"], correctIndex: 2 },
  { text: "During mediastinal staging for suspected lung cancer, which lymph node station should be sampled first to minimise false-negatives?", options: ["2R", "4R", "7", "10R"], correctIndex: 0 },
  { text: "Which intervention reduces auto-PEEP best in obstructive disease?", options: ["Increase RR", "Increase inspiratory time", "Decrease tidal volume", "Decrease inspiratory flow"], correctIndex: 2 },
  { text: "Which MTB mutation most strongly predicts high-level fluoroquinolone resistance?", options: ["katG S315T", "rpoB S531L", "gyrA A90V", "gyrA D94G"], correctIndex: 3 },
  { text: "Which therapy improves 6MWD in PH-ILD per INCREASE trial?", options: ["Riociguat", "Inhaled Treprostinil", "Bosentan", "Ambrisentan"], correctIndex: 1 },
  { text: "A normal A–a gradient with hypoxemia suggests:", options: ["V/Q mismatch", "Shunt", "Diffusion defect", "Hypoventilation"], correctIndex: 3 },
  { text: "Which emphysema pattern is most strongly associated with α-1 antitrypsin deficiency?", options: ["Centrilobular upper lobe", "Panacinar lower lobe", "Paraseptal apical", "Irregular with scarring"], correctIndex: 1 },
  { text: "Pt with chronic hypoventilation & PaCO2=70 — expected HCO3?", options: ["34", "28", "26", "40"], correctIndex: 0 },
  { text: "In cancer-associated thrombosis, strongest first-line evidence is for:", options: ["Warfarin", "Aspirin", "DOACs", "UFH"], correctIndex: 2 },
  { text: "Best candidate for portable sleep monitoring:", options: ["Snoring+Apnea+Sleepy+HTN", "Apnea+CHF+Sleepy", "Snoring no apnea", "Snoring+Neuromuscular disorder"], correctIndex: 0 },
  { text: "All are true EXCEPT —", options: ["Leptin from adipose ↓appetite", "Ghrelin increases intake", "Leptin & ghrelin opposite", "Sleep loss ↑ leptin ↓ghrelin"], correctIndex: 3 },
  { text: "Pneumonia associations EXCEPT:", options: ["EN + Mycoplasma", "Hyponatremia + Legionella", "Abscess + Staph", "Hemolytic anemia + S. pneumoniae"], correctIndex: 3 },
  { text: "Mechanism of bedaquiline-induced QT prolongation:", options: ["hERG inhibition", "↑Ca efflux", "KCNQ block", "T-type Ca activation"], correctIndex: 0 },
  { text: "Withdrawal of ICS in COPD trial:", options: ["TORCH", "WISDOM", "FACET", "TRILOGY"], correctIndex: 1 },
  { text: "ILD not associated with smoking:", options: ["PLCH", "HP", "RB-ILD", "DIP"], correctIndex: 1 },
  { text: "Riociguat should not be combined with:", options: ["Selexipag", "Iloprost", "Bosentan", "Sildenafil"], correctIndex: 3 },
  { text: "IHC stain for lung adenocarcinoma:", options: ["TTF-1 + Napsin-A", "p63/p40", "HER-2", "Ki-67"], correctIndex: 0 },
  { text: "HRCT typical of lymphangitic carcinomatosis:", options: ["Cavitating nodules", "Septal + peribronchovascular thickening", "Tree-in-bud", "Large effusion only"], correctIndex: 1 },
  { text: "True severe asthma among GINA Step 4–5 is:", options: ["1-2%", "15-20%", "30-40%", "3-7%"], correctIndex: 3 },
  { text: "CT-ILD protocol includes all EXCEPT:", options: ["High resolution", "Insp+Exp scans", "Supine + prone", "Plain + contrast"], correctIndex: 3 },
  { text: "Most specific sign of RV strain on CTPA:", options: ["Wedge consolidation", "RV:LV >1", "Segmental filling defect", "Basal atelectasis"], correctIndex: 1 },
  { text: "DLCO falls in all EXCEPT:", options: ["Obesity", "PAH", "Emphysema", "ILD"], correctIndex: 0 },
  { text: "UARS vs OSA distinguishing feature:", options: ["EDS", "High RERA", "AHI>15", "Desaturation"], correctIndex: 1 },
  { text: "NOT part of BODE Index:", options: ["BMI", "Obstruction", "Dyspnea", "DLCO"], correctIndex: 3 },
  { text: "NOT always true in OHS:", options: ["PCO2 ≥45", "BMI>30", "PO2+PCO2 worsen in sleep", "AHI≥5"], correctIndex: 3 },
  { text: "NIV in neuromuscular disease — EXCEPT:", options: ["Cough >2wk", "PaCO2>45", "Nocturnal SpO2<88%", "FVC<50%"], correctIndex: 0 },
  { text: "Lovibond angle:", options: ["120°","140°","180°","160°"], correctIndex: 3 },
  { text: "Caplan’s syndrome:", options: ["SLE","Scleroderma","RA","AS"], correctIndex: 2 },
  { text: "Asbestosis complications EXCEPT:", options: ["COPD","Mesothelioma","Bronchogenic carcinoma","Pulmonary fibrosis"], correctIndex: 0 }
];

/* ----------------- API ROUTES ----------------- */

// Get questions (without answers)
router.get('/questions', authMiddleware, async (req, res) => {
  res.json({
    questions: questions.map((q, i) => ({
      index: i,
      text: q.text,
      options: q.options
    }))
  });
});

// Submit answers & store result
// Submit answers only once per user
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    if (!Array.isArray(answers)) return res.status(400).json({ message: 'Invalid answers' });

    const user = await User.findById(req.user.id);
    
    // Restrict to one attempt - check if user has already submitted
    if (user.scores && user.scores.length > 0) {
      return res.status(403).json({
        message: "You have already completed the quiz. Only one attempt allowed.",
        score: user.scores[0].score,
        total: user.scores[0].total,
        timeTaken: user.scores[0].timeTaken
      });
    }

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    // Create a set of answered question indices
    const answeredSet = new Set(answers.map(a => a.questionIndex));

    // Calculate score: +2 for correct, -1 for incorrect, 0 for unattempted
    answers.forEach(a => {
      const q = questions[a.questionIndex];
      if (q && a.answerIndex === q.correctIndex) {
        score += 2;
        correctAnswers++;
      } else if (a.answerIndex !== -1 && a.answerIndex !== null && a.answerIndex !== undefined) {
        score -= 1;
        wrongAnswers++;
      }
    });

    const unattempted = questions.length - answeredSet.size;
    const maxScore = questions.length * 2; // 30 * 2 = 60

    // Save FIRST and ONLY attempt
    user.scores = [{
      score: score,
      total: maxScore,
      correctAnswers,
      wrongAnswers,
      unattempted,
      answeredQuestions: answers.length,
      timeTaken: timeTaken || 0,
      date: new Date(),
      rawAnswers: answers,
      answers: answers
    }];

    await user.save();

    console.log(`✅ Quiz submitted for ${user.email} - Score: ${score}/${maxScore} (${correctAnswers} correct, ${wrongAnswers} wrong, ${unattempted} unattempted) Time: ${timeTaken}s`);

    res.json({ 
      score: score, 
      total: maxScore,
      correctAnswers,
      wrongAnswers,
      unattempted,
      answeredQuestions: answers.length,
      timeTaken: timeTaken || 0
    });

  } catch (e) {
    console.error('❌ Quiz submission error:', e);
    res.status(500).json({ message: 'Server error during quiz submission' });
  }
});

module.exports = router;
