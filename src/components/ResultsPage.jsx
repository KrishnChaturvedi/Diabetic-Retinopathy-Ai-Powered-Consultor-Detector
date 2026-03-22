import React from 'react';
import { LESION_NAMES, LESION_COLORS, LESION_DOTS } from '../data/grades';
import './ResultsPage.css';

const GRADE_COLORS = { none: '#16a34a', mild: '#ca8a04', moderate: '#ea580c', severe: '#dc2626' };
const RISK_BG      = { none: '#dcfce7', mild: '#fef9c3', moderate: '#ffedd5', severe: '#fee2e2' };
const RISK_TXT     = { none: '#15803d', mild: '#a16207', moderate: '#c2410c', severe: '#b91c1c' };
const REF_BG       = { success: '#f0fdf4', warning: '#fff7ed', danger: '#fef2f2' };
const REF_BORDER   = { success: '#bbf7d0', warning: '#fed7aa', danger: '#fecaca' };
const REF_TXT      = { success: '#15803d', warning: '#c2410c', danger: '#dc2626' };

export default function ResultsPage({ result, preview, patient, onHome, onAskChat }) {
  const detected = Object.entries(result.lesions).filter(([, v]) => v).map(([k]) => k);

  return (
    <div className="results-grid">

      {/* LEFT: IMAGE PANEL */}
      <div className="img-panel">
        <div className="panel-hdr">
          <span className="panel-title">🔬 Retinal Fundus Image</span>
          <span className="analyzed-badge">Analysis Complete</span>
        </div>

        <div className="retina-box">
          <img src={preview} alt="retinal scan" />
          {LESION_DOTS.filter((d) => result.lesions[d.t]).map((d, i) => (
            <div
              key={i}
              className="ldot"
              style={{
                top: d.top,
                left: d.left,
                width: d.t === 'neo' ? '13px' : d.t === 'hemo' ? '11px' : '9px',
                height: d.t === 'neo' ? '13px' : d.t === 'hemo' ? '11px' : '9px',
                background: LESION_COLORS[d.t],
                border: `1.5px solid ${LESION_COLORS[d.t]}`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {detected.length > 0 && (
          <div className="legend">
            <div className="legend-title">DETECTED LESIONS</div>
            {detected.map((k) => (
              <div key={k} className="leg-item">
                <div className="leg-dot" style={{ background: LESION_COLORS[k] }} />
                {LESION_NAMES[k]}
              </div>
            ))}
          </div>
        )}

        <div className="img-meta">
          <div className="meta-row">Patient: <span>{patient.name || '—'}</span></div>
          <div className="meta-row">Age: <span>{patient.age || '—'}</span></div>
          <div className="meta-row">Diabetes: <span>{patient.dia || '—'}</span></div>
          <div className="meta-row">
            Date: <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="panel-btns">
          <button className="pbtn" onClick={onHome}>← Home</button>
          <button className="pbtn pri" onClick={() => alert('Download available in full app!')}>⬇ Download</button>
        </div>
      </div>

      {/* RIGHT: REPORT */}
      <div className="report-col">

        {/* Grade */}
        <div className="r-card">
          <div className="r-hdr">
            <span className="r-title">DR Classification</span>
            <button className="new-scan-btn" onClick={onHome}>New Scan</button>
          </div>
          <div className="grade-body">
            <div className="grade-row">
              <div>
                <div className="grade-name" style={{ color: GRADE_COLORS[result.grade] }}>{result.label}</div>
                <div className="grade-sub">{result.full}</div>
              </div>
              <span className="risk-badge" style={{ background: RISK_BG[result.grade], color: RISK_TXT[result.grade] }}>
                {result.risk} Risk
              </span>
            </div>
            <div className="conf-row">
              <span className="conf-label">AI Confidence</span>
              <div className="conf-bg">
                <div className="conf-fill" style={{ width: `${result.conf}%` }} />
              </div>
              <span className="conf-pct">{result.conf}%</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="r-card">
          <div className="r-hdr"><span className="r-title">Key Metrics</span></div>
          <div className="metrics-grid">
            <div className="metric"><div className="m-val">{result.conf}%</div><div className="m-lbl">Confidence</div></div>
            <div className="metric"><div className="m-val">{result.next}</div><div className="m-lbl">Next Screening</div></div>
            <div className="metric"><div className="m-val">{detected.length}</div><div className="m-lbl">Lesion Types</div></div>
          </div>
        </div>

        {/* Findings */}
        <div className="r-card">
          <div className="r-hdr"><span className="r-title">Detected Findings</span></div>
          <div className="findings-body">
            {Object.entries(result.lesions).map(([k, v]) => (
              <div key={k} className="f-row">
                <div className="f-name">
                  <div className="f-dot" style={{ background: v ? '#ef4444' : '#22c55e' }} />
                  {LESION_NAMES[k]}
                </div>
                <span className="f-tag" style={v
                  ? { background: '#fee2e2', color: '#dc2626' }
                  : { background: '#dcfce7', color: '#15803d' }}>
                  {v ? 'Detected' : 'Clear'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div className="r-card">
          <div className="r-hdr"><span className="r-title">Referral Recommendation</span></div>
          <div className="ref-body">
            <div className="ref-box" style={{ background: REF_BG[result.ref], border: `1px solid ${REF_BORDER[result.ref]}` }}>
              <div className="ref-ttl" style={{ color: REF_TXT[result.ref] }}>{result.refTitle}</div>
              <div className="ref-txt">{result.refText}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="r-card">
          <div className="act-body">
            <button className="act-btn act-dark" onClick={() => alert('Download available in full app!')}>
              ⬇ Download Full Report (PDF)
            </button>
            <button
              className="act-btn act-blue"
              onClick={() => onAskChat(`I have ${result.label}. What does this mean and what should I do?`)}
            >
              💬 Ask AI About My Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
