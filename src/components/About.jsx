import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="page-card about-page">
      <div className="page-body">
        <h2>About Retinopathy Detector</h2>
        <p>
          This project helps with early screening for diabetic retinopathy using a lightweight
          AI model and simple upload tools. It was built as a demo to showcase an end-to-end
          flow: capture, upload, AI analysis, and a concise report.
        </p>

        <h3>Mission</h3>
        <p>
          Make accessible and affordable tools to assist clinicians and communities in early
          detection of retinal disease.
        </p>

        <h3>Credits</h3>
        <p>HackXTract 2026 · MAIT · Open-source contributors</p>
      </div>
    </div>
  );
}
