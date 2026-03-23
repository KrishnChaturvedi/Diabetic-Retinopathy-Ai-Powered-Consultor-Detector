import React, { useState } from 'react';
import './Navbar.css';

// Navbar shows Home / About / Contact links and a Sign In / Sign Out button.
// Props:
// - page: current page key ('home' | 'about' | 'contact' | ...)
// - onHome: callback when Home is requested
// - onNavigate: optional callback when About/Contact requested (receives page key)
export default function Navbar({ page, onHome, onNavigate, user, onSignIn, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (to) => {
    if (to === 'home') {
      if (onHome) onHome();
      return;
    }
    if (onNavigate) {
      onNavigate(to);
      setMobileOpen(false);
      return;
    }
    // Fallback: no router provided in project, so just log / alert
    // (This keeps behavior predictable during development.)
    // eslint-disable-next-line no-alert
    alert(`Navigate to: ${to}`);
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="nav-logo">
          <span className="nav-eye">👁</span>
          Retinopathy <span className="nav-blue">Detector</span>
        </div>
        <button
          className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((s) => !s)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="nav-links" role="navigation" aria-label="Main">
        <button
          className={`nav-link ${page === 'home' ? 'active' : ''}`}
          onClick={() => navigate('home')}
        >
          Home
        </button>
        <button
          className={`nav-link ${page === 'about' ? 'active' : ''}`}
          onClick={() => navigate('about')}
        >
          About
        </button>
        <button
          className={`nav-link ${page === 'contact' ? 'active' : ''}`}
          onClick={() => navigate('contact')}
        >
          Contact Us
        </button>
      </div>

      <div className="nav-right">
        <span className="nav-badge">AI-Powered · HackXTract 2026</span>

        {user ? (
          <div className="nav-user">
            <span className="nav-username">Hi, {user?.name ?? 'User'}</span>
            <button className="btn-ghost" onClick={onLogout}>Sign Out</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={onSignIn}>Sign In</button>
        )}
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} role="menu">
        <button className="mobile-link" onClick={() => navigate('home')}>Home</button>
        <button className="mobile-link" onClick={() => navigate('about')}>About</button>
        <button className="mobile-link" onClick={() => navigate('contact')}>Contact Us</button>
        {user ? (
          <div className="nav-user">
            <span className="nav-username">Hi, {user?.name ?? 'User'}</span>
            <button className="btn-ghost" onClick={onLogout}>Sign Out</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={onSignIn}>Sign In</button>
        )}
      </div>
    </nav>
  );
}
