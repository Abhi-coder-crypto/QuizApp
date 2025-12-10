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
  { text: "Which statement regarding pulmonary hypertension due to chronic lung disease (Group 3 PH) is TRUE?", options: ["PDE-5 inhibitors are recommended for moderate–severe PH with advanced ILD", "Riociguat is first-line therapy", "Inhaled treprostinil improves exercise capacity in PH-ILD", "Endothelin receptor antagonists significantly improve FVC in ILD-PH"], correctIndex: 2 },
  { text: "In sarcoidosis, which factor predicts progression to pulmonary fibrosis most reliably?", options: ["Löfgren syndrome at presentation", "Scadding Stage II radiograph", "Persistent lymphopenia", "Elevated ACE levels"], correctIndex: 2 },
  { text: "During mediastinal staging for suspected lung cancer, which lymph node station should be sampled first to minimise the risk of false-negative staging?", options: ["Station 2R (highest mediastinal)", "Station 4R (right lower paratracheal)", "Station 7 (subcarinal)", "Station 10R (right hilar)"], correctIndex: 0 },
  { text: "Which intervention reduces auto-PEEP best in obstructive disease?", options: ["Increase respiratory rate", "Increase inspiratory time", "Decrease tidal volume", "Decrease inspiratory flow"], correctIndex: 2 },
  { text: "Which mutation in MTB MOST strongly predicts high-level fluoroquinolone resistance?", options: ["katG S315T", "rpoB S531L", "gyrA A90V", "gyrA D94G"], correctIndex: 3 },
  { text: "Which therapy improves 6MWD in PH-ILD per the INCREASE trial?", options: ["Riociguat", "Inhaled Treprostinil", "Bosentan", "Ambrisentan"], correctIndex: 1 },
  { text: "A normal A–a gradient with hypoxemia suggests:", options: ["V/Q mismatch", "Shunt", "Diffusion defect", "Hypoventilation"], correctIndex: 3 },
  { text: "Which pattern of emphysema is most strongly associated with severe alpha-1 antitrypsin deficiency (PiZZ genotype)?", options: ["Centrilobular emphysema predominant in upper lobes", "Panacinar emphysema predominant in lower lobes", "Paraseptal emphysema with apical bullae", "Irregular emphysema associated with prior scarring"], correctIndex: 1 },
  { text: "A patient has stable long standing hypoventilation with a PaCO2 of 70 mm Hg. What would the expected serum HCO3 be, assuming a normal HCO3 value is 24 mEq/L?", options: ["34", "28", "26", "40"], correctIndex: 0 },
  { text: "In cancer-associated thrombosis, which agent currently has the strongest evidence as first-line therapy?", options: ["Warfarin", "Aspirin", "DOACs (e.g., apixaban)", "UFH infusion"], correctIndex: 2 },
  { text: "Which of the following group of symptoms in a patient would indicate a good candidate for portable monitoring?", options: ["Snoring, witnessed apnea, daytime sleepiness, hypertension", "Snoring, witnessed apnea, congestive heart failure, daytime sleepiness", "Snoring, no witnessed apnea, nonrestorative sleep, no daytime sleepiness", "Snoring, daytime sleepiness, neuromuscular disorder"], correctIndex: 0 },
  { text: "All of the following statement are true except -", options: ["Leptin is primarily secreted by adipose tissue and appears to promote satiety", "Ghrelin increases appetite and food intake", "Leptin and ghrelin exert opposing effects on appetite", "Sleep loss leads to increased leptin and decreased ghrelin"], correctIndex: 3 },
  { text: "In pneumonia, the following features are classically associated with the specific organisms EXCEPT -", options: ["Erythema nodosum and Mycoplasma pneumonia", "Hyponatremia and Legionella pneumonia", "Abscess formation and Staphylococcus aureus", "Hemolytic anemia and Streptococcus pneumonia"], correctIndex: 3 },
  { text: "Mechanism of bedaquiline QT prolongation?", options: ["Inhibition of hERG channel", "Increased Ca2+ efflux", "KCNQ gene blockade", "T-type Ca channel activation"], correctIndex: 0 },
  { text: "The trial which studied withdrawal of inhaled steroids in COPD was called:", options: ["TORCH trial", "WISDOM trial", "FACET trial", "TRILOGY trial"], correctIndex: 1 },
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
