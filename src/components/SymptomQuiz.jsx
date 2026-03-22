import React, { useState } from 'react';
import SYMPTOMS from '../data/symptoms';
import { getRisk } from '../utils/riskScore';
import './SymptomQuiz.css';

export default function SymptomQuiz({ onAskChat }) {
  const [active, setActive]   = useState(null);
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]       = useState(false);

  const sym = SYMPTOMS.find((x) => x.id === active);

  function pickSymptom(id) {
    setActive(id);
    setStep(0);
    setAnswers({});
    setDone(false);
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

  const total    = Object.values(answers).reduce((s, a) => s + a.score, 0);
  const maxScore = sym ? sym.questions.length * 3 : 1;
  const risk     = sym ? getRisk(total, maxScore) : null;

  return (
    <div className="sym-section">
      <div className="sym-label">Symptom Checker — click a symptom to start quiz</div>

      {/* Symptom Chips */}
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
          {/* Header */}
          <div className="quiz-hdr">
            <div className="quiz-hdr-top">
              <span className="quiz-hdr-title">{sym.emoji} {sym.label}</span>
              <span className="quiz-hdr-count">Q {step + 1} of {sym.questions.length}</span>
            </div>
            <div className="quiz-prog-bg">
              <div
                className="quiz-prog-fill"
                style={{ width: `${(step / sym.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="quiz-info">{sym.info}</div>

          {/* Question + Options */}
          <div className="quiz-body">
            <div className="quiz-question">{sym.questions[step].q}</div>
            <div className="quiz-options">
              {sym.questions[step].opts.map((opt, i) => (
                <button
                  key={i}
                  className="quiz-opt"
                  onClick={() => answer(opt.s, opt.t)}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  {opt.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {sym && done && (
        <div className="quiz-card result-card">
          <div className="result-hdr">
            <span className="result-hdr-title">{sym.emoji} {sym.label} — Quiz Complete</span>
            <span className="result-done">✓ {sym.questions.length}/{sym.questions.length} answered</span>
          </div>
          <div className="result-body">
            {/* Risk Banner */}
            <div
              className="risk-banner"
              style={{ background: risk.bg, border: `1px solid ${risk.border}` }}
            >
              <div className="risk-banner-top">
                <span className="risk-level-text" style={{ color: risk.color }}>{risk.level}</span>
                <span className="risk-pct" style={{ color: risk.color }}>
                  {Math.round((total / maxScore) * 100)}%
                </span>
              </div>
              <div className="risk-advice">{risk.advice}</div>
            </div>

            {/* Score Bar */}
            <div className="score-label-row">
              <span>Risk Score</span>
              <span>{total} / {maxScore} points</span>
            </div>
            <div className="score-bar-bg">
              <div
                className="score-bar-fill"
                style={{ width: `${(total / maxScore) * 100}%`, background: risk.color }}
              />
            </div>

            {/* Answer Summary */}
            <div className="ans-label">Your Answers</div>
            {sym.questions.map((q, i) => (
              <div key={i} className="ans-row">
                <span className="ans-num">Q{i + 1}.</span>
                <div className="ans-content">
                  <div className="ans-q">{q.q}</div>
                  <div className="ans-a">→ {answers[i]?.text}</div>
                </div>
                <span
                  className="ans-tag"
                  style={
                    answers[i]?.score >= 3
                      ? { background: '#fee2e2', color: '#dc2626' }
                      : answers[i]?.score === 2
                      ? { background: '#ffedd5', color: '#ea580c' }
                      : { background: '#dcfce7', color: '#15803d' }
                  }
                >
                  {answers[i]?.score >= 3 ? 'High' : answers[i]?.score === 2 ? 'Med' : 'Low'}
                </span>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="result-btns">
              <button
                className="rbtn rbtn-sec"
                onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
              >
                Retake Quiz
              </button>
              <button
                className="rbtn rbtn-pri"
                onClick={() =>
                  onAskChat(
                    `I have ${sym.label.toLowerCase()}. My risk level is ${risk.level}. What should I do?`
                  )
                }
              >
                💬 Ask AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
