import React, { useState, useEffect } from 'react';
import './PasswordGate.css';

/** sessionStorage: gate shows again on new tab or after closing tab; no gate on refresh in same tab. */
const STORAGE_KEY = 'portfolio-2026-unlocked';
const CORRECT_PASSWORD = 'sherbetlemon';

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setUnlocked(true);
  }, [mounted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const trimmed = password.trim();
    if (trimmed === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setUnlocked(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!mounted) return null;
  if (unlocked) return children;

  return (
    <div className="password-gate">
      <div className="password-gate__backdrop" />
      <div className="password-gate__modal">
        <h1 className="password-gate__title">What is the password to Dumbledore's office?</h1>
        <form onSubmit={handleSubmit} className="password-gate__form">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Enter password"
            className="password-gate__input"
            autoFocus
            autoComplete="current-password"
            aria-label="Password"
          />
          {error && <p className="password-gate__error" role="alert">{error}</p>}
          <button type="submit" className="password-gate__submit">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
