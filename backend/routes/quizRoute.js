// routes/quizRoute.js
const express = require('express');
const quizRouter = express.Router();
const QuizResult = require('../models/quizSchema');
const auth = require('../middlewares/auth');

// Risk calculation based on percentage
function calculateRisk(total, max) {
  const percent = (total / max) * 100;
  if (percent >= 70) return 'High';
  if (percent >= 40) return 'Medium';
  return 'Low';
}

// POST /api/quiz/submit
quizRouter.post('/submit',auth, async (req, res) => {
  try {
    const { symptom, answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const maxScore = answers.length * 3; // max 3 per question
    const riskLevel = calculateRisk(totalScore, maxScore);
    const percentage = Math.round((totalScore / maxScore) * 100);

    const result = new QuizResult({
      symptoms: symptom,
      answers,
      totalScore,
      maxScore,
      risklevel: riskLevel,
      percentage,
      user: req.user.id,
    });

    const saved = await result.save();

    res.json({
      success: true,
      riskLevel,
      percentage,
      saved,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quiz/all
quizRouter.get('/all', async (req, res) => {
  try {
    const allResults = await QuizResult.find().sort({ createdAt: -1 });
    res.json(allResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = quizRouter;