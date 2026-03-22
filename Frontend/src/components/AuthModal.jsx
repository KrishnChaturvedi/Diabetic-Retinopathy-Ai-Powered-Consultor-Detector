import React, { useState } from 'react';
import './AuthModal.css';

export default function AuthModal({ onCancel, onSuccess }) {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setError('');
  };

  const submitRegister = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your name');
    if (!email.trim()) return setError('Please enter an email');
    if (!password) return setError('Please enter a password');
    // Minimal phone validation
    if (phone && phone.length < 6) return setError('Please enter a valid phone');
    setError('');
    const u = { name: name.trim(), email: email.trim(), phone: phone.trim() };
    onSuccess(u);
    reset();
  };

  const submitLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Please enter your email');
    if (!password) return setError('Please enter your password');
    setError('');
    // For demo, we just accept the credentials and set name as the email prefix
    const username = email.split('@')[0] || email;
    const u = { name: username, email: email.trim() };
    onSuccess(u);
    reset();
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <div className="auth-card">
        <button className="auth-close" aria-label="Close" onClick={onCancel}>
          ✕
        </button>

        <div className="auth-header">
          <h3>Welcome</h3>
          <p className="auth-sub">Create an account or sign in to continue</p>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
        </div>

        {mode === 'register' ? (
          <form className="auth-form" onSubmit={submitRegister}>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </label>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>
            <label>
              Phone (optional)
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 555 5555" />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-actions">
              <button type="submit" className="btn-primary">Create account</button>
              <button type="button" className="btn-ghost" onClick={() => { setMode('login'); setError(''); }}>
                Have an account? Login
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitLogin}>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-actions">
              <button type="submit" className="btn-primary">Sign in</button>
              <button type="button" className="btn-ghost" onClick={() => { setMode('register'); setError(''); }}>
                New here? Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
