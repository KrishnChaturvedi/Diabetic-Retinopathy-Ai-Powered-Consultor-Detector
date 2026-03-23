// components/SymptomQuiz.jsx
import React, { useState, useEffect } from 'react';
import SYMPTOMS from '../data/symptoms';
import axios from 'axios';
import './SymptomQuiz.css';

export default function SymptomQuiz({ onAskChat }) {
  const [active, setActive] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendRisk, setBackendRisk] = useState(null);

  const sym = SYMPTOMS.find((x) => x.id === active);

  useEffect(() => {
    if (done && sym) {
      sendResult();
    }
  }, [done]);

  function pickSymptom(id) {
    setActive(id);
    setStep(0);
    setAnswers({});
    setDone(false);
    setBackendRisk(null);
  }

  function answer(score, text) {
    const a = { ...answers, [step]: { score, text } };
    setAnswers(a);
    if (step + 1 < sym.questions.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  async function sendResult() {
    try {
      setLoading(true);
      if (!sym) return;

      const answersArray = Object.keys(answers)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => answers[k]);

      const res = await axios.post('http://localhost:8080/api/quiz/submit', {
        symptom: sym.label,
        answers: answersArray,
      });

      setBackendRisk(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to save quiz');
    } finally {
      setLoading(false);
    }
  }

  const total = Object.values(answers).reduce((s, a) => s + a.score, 0);
  const maxScore = sym ? sym.questions.length * 3 : 1;

  return (
    <div className="sym-section">
      <div className="sym-label">Symptom Checker — click a symptom to start quiz</div>
      <div className="sym-chips">
        {SYMPTOMS.map((x) => (
          <button
            key={x.id}
            className={`sym-chip ${active === x.id ? 'active' : ''}`}
            onClick={() => pickSymptom(x.id)}
          >
            {x.emoji} {x.label}
          </button>
        ))}
      </div>

      {/* Quiz Card */}
      {sym && !done && (
        <div className="quiz-card">
          <div className="quiz-hdr">
            <div className="quiz-hdr-top">
              <span className="quiz-hdr-title">{sym.emoji} {sym.label}</span>
              <span className="quiz-hdr-count">Q {step + 1} of {sym.questions.length}</span>
            </div>
            <div className="quiz-prog-bg">
              <div className="quiz-prog-fill" style={{ width: `${(step / sym.questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="quiz-info">{sym.info}</div>

          <div className="quiz-body">
            <div className="quiz-question">{sym.questions[step].q}</div>
            <div className="quiz-options">
              {sym.questions[step].opts.map((opt, i) => (
                <button key={i} className="quiz-opt" onClick={() => answer(opt.s, opt.t)}>
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  {opt.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading">Saving your result...</div>}

   {sym && done && backendRisk?.success && (
  <div className="quiz-card result-card">
    <div className="result-hdr">
      <span className="result-hdr-title">
        {sym.emoji} {sym.label} — Quiz Complete
      </span>
      <span className="result-done">✓ {sym.questions.length}/{sym.questions.length} answered</span>
    </div>

    <div className="result-body">
      {/* Backend result */}
      <div className="backend-result" style={{ marginBottom: 12 }}>
        <strong>Saved to server:</strong>
        <div>Risk Level: {backendRisk.riskLevel}</div>
        <div>Percentage: {backendRisk.percentage}%</div>
      </div>

      {/* Risk Banner using backend risk */}
      <div
        className="risk-banner"
        style={{
          background:
            backendRisk.riskLevel === 'High'
              ? '#fee2e2'
              : backendRisk.riskLevel === 'Medium'
              ? '#ffedd5'
              : '#dcfce7',
          border:
            backendRisk.riskLevel === 'High'
              ? '1px solid #dc2626'
              : backendRisk.riskLevel === 'Medium'
              ? '1px solid #ea580c'
              : '1px solid #15803d',
          color:
            backendRisk.riskLevel === 'High'
              ? '#dc2626'
              : backendRisk.riskLevel === 'Medium'
              ? '#ea580c'
              : '#15803d',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        <strong>Risk Level:</strong> {backendRisk.riskLevel} — {backendRisk.percentage}%
      </div>

      {/* Score Summary */}
      <div className="score-label-row">
        <span>Risk Score</span>
        <span>{total} / {maxScore} points</span>
      </div>

      {/* Retake button */}
      <button className="rbtn rbtn-sec" onClick={() => pickSymptom(active)}>
        Retake Quiz
      </button>
    </div>
  </div>
)}
    </div>
  );
}