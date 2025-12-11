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
   FINAL 30 QUESTIONS LOADED
-------------------------------------------*/
const questions = [
  // Q1
  { text: "Which statement regarding pulmonary hypertension due to chronic lung disease (Group 3 PH) is TRUE?", options: ["PDE-5 inhibitors are recommended for moderate-severe PH with advanced ILD", "Riociguat is first-line therapy", "Inhaled treprostinil improves exercise capacity in PH-ILD", "Endothelin receptor antagonists significantly improve FVC in ILD-PH"], correctIndex: 2 },
  // Q2
  { text: "In sarcoidosis, which factor predicts progression to pulmonary fibrosis most reliably?", options: ["Lofgren syndrome at presentation", "Scadding Stage II radiograph", "Persistent lymphopenia", "Elevated ACE levels"], correctIndex: 2 },
  // Q3
  { text: "During mediastinal staging for suspected lung cancer, which lymph node station should be sampled first to minimise the risk of false-negative staging?", options: ["Station 2R (highest mediastinal)", "Station 4R (right lower paratracheal)", "Station 7 (subcarinal)", "Station 10R (right hilar)"], correctIndex: 0 },
  // Q4
  { text: "Which intervention reduces auto-PEEP best in obstructive disease?", options: ["Increase respiratory rate", "Increase inspiratory time", "Decrease tidal volume", "Decrease inspiratory flow"], correctIndex: 2 },
  // Q5
  { text: "Which mutation in MTB MOST strongly predicts high-level fluoroquinolone resistance?", options: ["katG S315T", "rpoB S531L", "gyrA A90V", "gyrA D94G"], correctIndex: 3 },
  // Q6
  { text: "Which therapy improves 6MWD in PH-ILD per the INCREASE trial?", options: ["Riociguat", "Inhaled Treprostinil", "Bosentan", "Ambrisentan"], correctIndex: 1 },
  // Q7
  { text: "A normal A-a gradient with hypoxemia suggests:", options: ["V/Q mismatch", "Shunt", "Diffusion defect", "Hypoventilation"], correctIndex: 3 },
  // Q8
  { text: "Which pattern of emphysema is most strongly associated with severe alpha-1 antitrypsin deficiency (PiZZ genotype)?", options: ["Centrilobular emphysema predominant in upper lobes", "Panacinar emphysema predominant in lower lobes", "Paraseptal emphysema with apical bullae", "Irregular emphysema associated with prior scarring"], correctIndex: 1 },
  // Q9
  { text: "A patient has stable long standing hypoventilation with a PaCO2 of 70 mm Hg. What would the expected serum HCO3 be, assuming a normal HCO3 value is 24 mEq/L?", options: ["34", "28", "26", "40"], correctIndex: 0 },
  // Q10
  { text: "In cancer-associated thrombosis, which agent currently has the strongest evidence as first-line therapy?", options: ["Warfarin", "Aspirin", "DOACs (e.g., apixaban)", "UFH infusion"], correctIndex: 2 },
  // Q11
  { text: "Which of the following group of symptoms in a patient would indicate a good candidate for portable monitoring?", options: ["Snoring, witnessed apnea, daytime sleepiness, hypertension", "Snoring, witnessed apnea, congestive heart failure, daytime sleepiness", "Snoring, no witnessed apnea, nonrestorative sleep, no daytime sleepiness", "Snoring, daytime sleepiness, neuromuscular disorder"], correctIndex: 0 },
  // Q12
  { text: "All of the following statement are true except -", options: ["Leptin is primarily secreted by adipose tissue and appears to promote satiety", "Ghrelin increases appetite and food intake", "Leptin and ghrelin exert opposing effects on appetite", "Sleep loss leads to increased leptin and decreased ghrelin"], correctIndex: 3 },
  // Q13
  { text: "In pneumonia, the following features are classically associated with the specific organisms EXCEPT -", options: ["Erythema nodosum and Mycoplasma pneumonia", "Hyponatremia and Legionella pneumonia", "Abscess formation and Staphylococcus aureus", "Hemolytic anemia and Streptococcus pneumonia"], correctIndex: 3 },
  // Q14
  { text: "Mechanism of bedaquiline QT prolongation?", options: ["Inhibition of hERG channel", "Increased Ca2+ efflux", "KCNQ gene blockade", "T-type Ca channel activation"], correctIndex: 0 },
  // Q15
  { text: "The trial which studied withdrawal of inhaled steroids in COPD was called:", options: ["TORCH trial", "WISDOM trial", "FACET trial", "TRILOGY trial"], correctIndex: 1 },
  // Q16
  { text: "Which is the only one of the following ILDs that is not associated with smoking:", options: ["Pulmonary Langhans Cell Histiocytosis", "Hypersensitivity Pneumonitis", "RB-ILD", "Desquamative Interstitial Pneumonitis (DIP)"], correctIndex: 1 },
  // Q17
  { text: "In the treatment of Pulmonary Hypertension, riociguat should not be combined with:", options: ["Selexipag", "Iloprost", "Bosentan", "Sildenafil"], correctIndex: 3 },
  // Q18
  { text: "Which IHC stain is used to identify adenocarcinoma of pulmonary origin?", options: ["TTF and Napsin-A", "P63, p40", "HER-2", "Ki-67"], correctIndex: 0 },
  // Q19
  { text: "HRCT feature most typical of lymphangitic carcinomatosis?", options: ["Random nodules with cavitation", "Smooth or nodular interlobular septal and peribronchovascular thickening", "Centrilobular nodules with tree-in-bud", "Large pleural effusion only"], correctIndex: 1 },
  // Q20
  { text: "Approximately what percentage of GINA Step 4-5 asthma is True Severe Asthma?", options: ["1-2 %", "15-20 %", "30-40 %", "3-7 %"], correctIndex: 3 },
  // Q21
  { text: "For a CT scan done for ILD protocol, the following are recommended except:", options: ["High resolution", "Inspiratory and expiratory sequences", "Supine and prone sequences", "Plain and Contrast sequences"], correctIndex: 3 },
  // Q22
  { text: "On CTPA, the most specific sign of right-ventricular strain from PE is:", options: ["Peripheral wedge consolidation", "RV:LV diameter ratio >1 on axial images", "Filling defect in a segmental artery", "Linear atelectasis at base"], correctIndex: 1 },
  // Q23
  { text: "All of the following conditions are associated with a decrease in DLco except -", options: ["Obesity", "Pulmonary arterial hypertension", "Emphysema", "Interstitial lung disease"], correctIndex: 0 },
  // Q24
  { text: "Which feature differentiates UARS from OSA?", options: ["Excessive daytime sleepiness", "Elevated RERA index", "AHI >15", "Oxygen desaturation events"], correctIndex: 1 },
  // Q25
  { text: "Which parameter is NOT part of the BODE index?", options: ["BMI", "Degree of obstruction", "Dyspnea score", "DLCO"], correctIndex: 3 },
  // Q26
  { text: "Which of the following is NOT always true about patients with the OHS?", options: ["Daytime PCO2 >= 45 mm Hg", "BMI > 30 kg/m2", "Worsening PCO2 and PO2 with sleep", "AHI >= 5/hr"], correctIndex: 3 },
  // Q27
  { text: "All are indication for non invasive positive pressure ventilation in neuromuscular disorders except", options: ["Cough for more than 2 week duration", "PaCO2 > 45 mm Hg (daytime)", "Nocturnal oximetry demonstrating SaO2 < 88% for >= 5 min", "FVC < 50% of predicted"], correctIndex: 0 },
  // Q28
  { text: "Lovibond's angle is approximately", options: ["120 degrees", "140 degrees", "180 degrees", "160 degrees"], correctIndex: 3 },
  // Q29
  { text: "Caplan's syndrome is coal worker's pneumoconiosis associated with -", options: ["SLE", "Scleroderma", "Rheumatoid arthritis", "Ankylosing spondylitis"], correctIndex: 2 },
  // Q30
  { text: "Asbestosis may be complicated by all EXCEPT", options: ["COPD", "Mesothelioma of pleura", "Bronchogenic carcinoma", "Pulmonary fibrosis"], correctIndex: 0 }
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

    console.log(`Quiz submitted for ${user.email} - Score: ${score}/${maxScore} (${correctAnswers} correct, ${wrongAnswers} wrong, ${unattempted} unattempted) Time: ${timeTaken}s`);

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
    console.error('Quiz submission error:', e);
    res.status(500).json({ message: 'Server error during quiz submission' });
  }
});

module.exports = router;
