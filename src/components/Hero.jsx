import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <div className="hero">
      <h1>
        Detect Diabetic Retinopathy<br />
        <span>Before Vision is Lost</span>
      </h1>
      <p>
        Upload a retinal fundus image. AI analyzes it in seconds — detecting
        early signs with clinical-grade accuracy.
      </p>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="stat-val">3M+</div>
          <div className="stat-lbl">Indians at risk</div>
        </div>
        <div className="hero-stat">
          <div className="stat-val">80%</div>
          <div className="stat-lbl">Preventable</div>
        </div>
        <div className="hero-stat">
          <div className="stat-val">30s</div>
          <div className="stat-lbl">Analysis time</div>
        </div>
      </div>
    </div>
  );
}
