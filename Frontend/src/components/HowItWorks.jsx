import React from 'react';
import './HowItWorks.css';

const STEPS = [
  { n: 1, name: 'Capture',     desc: 'Fundus / smartphone' },
  { n: 2, name: 'Upload',      desc: 'Web platform' },
  { n: 3, name: 'AI Analysis', desc: 'CNN + EfficientNet' },
  { n: 4, name: 'Lesion Map',  desc: 'Semantic segmentation' },
  { n: 5, name: 'Report',      desc: 'Risk + referral' },
];

export default function HowItWorks() {
  return (
    <div className="how">
      <h2>How It Works</h2>
      <div className="steps-row">
        {STEPS.map((st, i) => (
          <div key={st.n} className={`how-step ${i < STEPS.length - 1 ? 'has-arrow' : ''}`}>
            <div className="step-num">{st.n}</div>
            <div className="step-name">{st.name}</div>
            <div className="step-desc">{st.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
