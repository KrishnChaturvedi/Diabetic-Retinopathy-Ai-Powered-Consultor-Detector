import React, { useState } from 'react';
import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import UploadPage  from './components/UploadPage';
import Analyzing   from './components/Analyzing';
import ResultsPage from './components/ResultsPage';
import HowItWorks  from './components/HowItWorks';
import About       from './components/About';
import Contact     from './components/Contact';
import ChatFAB     from './components/ChatFAB';
import AuthModal   from './components/AuthModal';
import { Toaster } from 'react-hot-toast';
import './App.css';

const STEPS = ['Uploading', 'Preprocessing', 'AI model', 'Lesion mapping', 'Report'];

export default function App() {
  const [page, setPage]     = useState('home');
  const [preview, setPreview] = useState(null);
  const [patient, setPatient] = useState({});
  const [result, setResult]   = useState(null);
  const [aStep, setAStep]     = useState(0);
  const [pending, setPending] = useState(null);
  const [user, setUser]       = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  async function handleAnalyze(file, prev, pat, mappedResult) {
    setPreview(prev);
    setPatient(pat);
    setPage('analyzing');
    setAStep(0);

    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 620));
      setAStep(i + 1);
    }
    await new Promise(r => setTimeout(r, 350));
    setResult(mappedResult);
    setPage('results');
  }

  function handleHome() {
    setPage('home');
    setPreview(null);
    setPatient({});
    setResult(null);
    setAStep(0);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <div className="app">
      <Toaster position="top-right" />

      <Navbar
        page={page}
        onHome={handleHome}
        onNavigate={to => setPage(to)}
        user={user}
        onSignIn={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      {showAuth && (
        <AuthModal
          onCancel={() => setShowAuth(false)}
          onSuccess={u => { setUser(u); setShowAuth(false); }}
        />
      )}

      {page === 'home' && (
        <>
          <Hero />
          <div className="wrap">
            <UploadPage onAnalyze={handleAnalyze} onAskChat={msg => setPending(msg)} />
          </div>
          <HowItWorks />
        </>
      )}

      {page === 'analyzing' && <Analyzing activeStep={aStep} />}

      {page === 'results' && result && (
        <ResultsPage
          result={result}
          preview={preview}
          patient={patient}
          onHome={handleHome}
          onAskChat={msg => setPending(msg)}
        />
      )}

      {page === 'about' && <About />}
      {page === 'contact' && <Contact />}

      <footer className="footer">
        Retinopathy Detector · AI-Powered Early Screening · HackXTract 2026 · MAIT
      </footer>

      <ChatFAB pending={pending} onUsed={() => setPending(null)} />
    </div>
  );
}
