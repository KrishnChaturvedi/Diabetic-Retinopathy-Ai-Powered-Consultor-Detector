import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AuthModal.css';

const API = 'http://localhost:8080';

export default function AuthModal({ onCancel, onSuccess }) {
  const [mode, setMode]         = useState('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const reset = () => { setName(''); setEmail(''); setPassword(''); };

  const submitRegister = async (e) => {
    e.preventDefault();
    if (!name.trim())        return toast.error('Please enter your name');
    if (!email.trim())       return toast.error('Please enter an email');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/user/register`, { name, email, password });
      if (!data.success) return toast.error(data.message);

      // auto login after register
      const { data: loginData } = await axios.post(`${API}/api/user/login`, { email, password });
      if (!loginData.success) return toast.error('Registered! Please login.');

      localStorage.setItem('token', loginData.token);
      toast.success('Account created successfully!');
      onSuccess({ name: name.trim(), email: email.trim() });
      reset();

    } catch (err) {
      toast.error('Server error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');
    if (!password)     return toast.error('Please enter your password');

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/user/login`, { email, password });
      if (!data.success) return toast.error(data.message || 'Invalid credentials');

      localStorage.setItem('token', data.token);
      toast.success(`Welcome back!`);
      onSuccess({ name: email.split('@')[0], email: email.trim() });
      reset();

    } catch (err) {
      toast.error('Server error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <div className="auth-card">
        <button className="auth-close" onClick={onCancel}>✕</button>

        <div className="auth-header">
          <h3>Welcome</h3>
          <p className="auth-sub">Create an account or sign in to continue</p>
        </div>

        <div className="auth-tabs">
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); reset(); }}>Register</button>
          <button className={mode === 'login'    ? 'active' : ''} onClick={() => { setMode('login');    reset(); }}>Login</button>
        </div>

        {mode === 'register' ? (
          <form className="auth-form" onSubmit={submitRegister}>
            <label>Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </label>
            <label>Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
            </label>
            <label>Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>
            <div className="auth-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
              <button type="button" className="btn-ghost" onClick={() => { setMode('login'); reset(); }}>
                Have an account? Login
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitLogin}>
            <label>Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
            </label>
            <label>Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>
            <div className="auth-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <button type="button" className="btn-ghost" onClick={() => { setMode('register'); reset(); }}>
                New here? Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}