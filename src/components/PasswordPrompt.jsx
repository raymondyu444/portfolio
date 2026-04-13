import React, { useState } from 'react';
import './PasswordGate.css';

/** Case-study-only gate (old full-page gate used `portfolio-2026-unlocked` — do not reuse). */
export const CASE_STUDY_UNLOCK_KEY = 'portfolio-2026-case-study-unlocked';
const CORRECT_PASSWORD = 'slem';

export function readCaseStudyUnlocked() {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(CASE_STUDY_UNLOCK_KEY) === 'true';
}

/**
 * Password card only (no full-screen shell). Used inside case study modal; styles from PasswordGate.css.
 */
export default function PasswordPrompt({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const trimmed = password.trim();
    if (trimmed === CORRECT_PASSWORD) {
      sessionStorage.setItem(CASE_STUDY_UNLOCK_KEY, 'true');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div
      className="password-gate__modal case-study-modal__password-card"
      onClick={(e) => e.stopPropagation()}
    >
      <h1 id="case-study-password-title" className="password-gate__title">
        What is the password to Dumbledore&apos;s office?
      </h1>
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
        {error && (
          <p className="password-gate__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="password-gate__submit">
          Enter
        </button>
      </form>
    </div>
  );
}
