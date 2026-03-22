import React from 'react';
import './Analyzing.css';

const STEPS = ['Uploading', 'Preprocessing', 'AI model', 'Lesion mapping', 'Report'];

export default function Analyzing({ activeStep }) {
  return (
    <div className="card">
      <div className="analyzing">
        <div className="spinner" />
        <p className="a-title">Analyzing Retinal Image...</p>
        <p className="a-sub">AI model is processing your fundus image</p>
        <div className="prog-bar">
          <div className="prog-fill" />
        </div>
        <div className="a-steps">
          {STEPS.map((st, i) => (
            <span
              key={i}
              className={`a-step ${i < activeStep ? 'done' : i === activeStep ? 'active' : ''}`}
            >
              {i < activeStep ? '✓' : i === activeStep ? '⟳' : '○'} {st}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
