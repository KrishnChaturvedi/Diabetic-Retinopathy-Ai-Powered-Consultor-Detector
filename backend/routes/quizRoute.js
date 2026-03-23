// routes/quizRoute.js
const express = require('express');
const quizRouter = express.Router();
const QuizResult = require('../models/quizSchema');

// Risk calculation based on percentage
function calculateRisk(total, max) {
  const percent = (total / max) * 100;
  if (percent >= 70) return 'High';
  if (percent >= 40) return 'Medium';
  return 'Low';
}

// POST /api/quiz/submit
quizRouter.post('/submit', async (req, res) => {
  try {
    const { symptom, answers } = req.body;
    console.log('[/api/quiz/submit] incoming request from', req.ip)
    console.log('Headers:', req.headers.origin || req.headers.host)
    console.log('Body sample:', { symptom, answers: Array.isArray(answers) ? answers.slice(0,3) : answers })

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