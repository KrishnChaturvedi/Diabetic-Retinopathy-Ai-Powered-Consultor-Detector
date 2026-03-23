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
  }, [done, sym]);

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

      // Build API base using the page's hostname so mobile devices (accessing the
      // frontend via the dev machine's LAN IP) post to the correct backend host.
      const apiHost = window.location.hostname || 'localhost';
      const apiProtocol = window.location.protocol || 'http:';
      const API_BASE = `${apiProtocol}//${apiHost}:8080`;

      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${API_BASE}/api/quiz/submit`,
        {
          symptom: sym.label,
          answers: answersArray,
          totalScore: total,
          maxScore,
        },
        { headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }, timeout: 8000 }
      );

      setBackendRisk(res.data);
    } catch (err) {
      console.error('sendResult error ->', err?.response || err.message || err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      setError(serverMsg || err.message || 'Failed to save quiz');
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

      {sym && done && (
        <div className="quiz-card result-card">
          <div className="result-body">
            {backendRisk?.success ? (
              <>
                <div><strong>Saved to server:</strong></div>
                <div>Risk: {backendRisk.riskLevel}</div>
                <div>Percentage: {backendRisk.percentage}%</div>
              </>
            ) : (
              <>
                <div><strong>Result not saved yet.</strong></div>
                <div style={{ marginTop: 8 }}>
                  <button className="rbtn rbtn-pri" onClick={() => sendResult()} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Result'}
                  </button>
                </div>
              </>
            )}

            {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}

            <div className="score-label-row" style={{ marginTop: 12 }}>
              <span>Risk Score</span>
              <span>{total} / {maxScore} points</span>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="rbtn rbtn-sec" onClick={() => pickSymptom(active)}>Retake Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}