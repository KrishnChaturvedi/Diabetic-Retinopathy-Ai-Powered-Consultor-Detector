import React, { useState } from 'react';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import UploadPage   from './components/UploadPage';
import Analyzing    from './components/Analyzing';
import ResultsPage  from './components/ResultsPage';
import HowItWorks   from './components/HowItWorks';
import About        from './components/About';
import Contact      from './components/Contact';
import ChatFAB      from './components/ChatFAB';
import { mockAnalyze } from './data/grades';
import './App.css';

const ANALYSIS_STEPS = ['Uploading', 'Preprocessing', 'AI model', 'Lesion mapping', 'Report'];

export default function App() {
  const [page, setPage]       = useState('home');       // 'home' | 'analyzing' | 'results'
  const [preview, setPreview] = useState(null);
  const [patient, setPatient] = useState({});
  const [result, setResult]   = useState(null);
  const [aStep, setAStep]     = useState(0);
  const [pending, setPending] = useState(null);         // pending chat message

  // Called when user clicks "Analyze"
  async function handleAnalyze(file, prev, pat) {
    setPreview(prev);
    setPatient(pat);
    setPage('analyzing');
    setAStep(0);

    // Simulate AI analysis steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 620));
      setAStep(i + 1);
    }
    await new Promise((r) => setTimeout(r, 350));

    // In production: replace mockAnalyze() with real API call
    // const res = await fetch('/api/analyze', { method: 'POST', body: formData });
    // const data = await res.json();
    setResult(mockAnalyze());
    setPage('results');
  }

  function handleHome() {
    setPage('home');
    setPreview(null);
    setPatient({});
    setResult(null);
    setAStep(0);
  }

  // Navigate to About / Contact pages. These pages display their content
  // and keep the footer visible while hiding the main app containers.
  function handleNavigate(to) {
    if (to === 'about' || to === 'contact') {
      setPage(to);
      return;
    }
    // fallback: treat as home
    setPage('home');
  }

  function openChat(msg) {
    setPending(msg);
  }

  return (
    <div className="app">
      <Navbar page={page} onHome={handleHome} onNavigate={handleNavigate} />

      {page === 'home' && (
        <>
          <Hero />

          <div className="wrap">
            <UploadPage onAnalyze={handleAnalyze} onAskChat={openChat} />

            {page === 'analyzing' && (
              <Analyzing activeStep={aStep} />
            )}

            {page === 'results' && result && (
              <ResultsPage
                result={result}
                preview={preview}
                patient={patient}
                onHome={handleHome}
                onAskChat={openChat}
              />
            )}
          </div>

          <HowItWorks />
        </>
      )}

      {page === 'about' && <About />}
      {page === 'contact' && <Contact />}

      <footer className="footer">
        Retinopathy Detector · AI-Powered Early Screening · HackXTract 2026 · MAIT
      </footer>

      {/* Floating AI Chat Button — fixed bottom right */}
      <ChatFAB
        pending={pending}
        onUsed={() => setPending(null)}
      />
    </div>
  );
}
