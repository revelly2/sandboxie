import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { StudentAvatarIcon } from '../components/StudentVectorIllustration';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const { lang, setLanguage } = useLanguage();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container--compact">
        <div className="auth-card">
          <div className="auth-mobile-student-avatar">
            <StudentAvatarIcon size={64} className="mobile-avatar-svg" />
          </div>

          {/* In-Card Quick Language Switcher */}
          <div className="auth-lang-switch">
            <button
              type="button"
              className={`auth-lang-pill ${lang === 'il' ? 'is-active' : ''}`}
              onClick={() => setLanguage('il')}
              aria-label="Switch to Ilocano"
            >
              Ilocano
            </button>
            <button
              type="button"
              className={`auth-lang-pill ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
            >
              English
            </button>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">
              {lang === 'il' ? 'I-Reset ti Password' : 'Reset Password'}
            </h1>
            <p className="auth-subtitle">
              {lang === 'il'
                ? 'Isurat ti email mo ket mangipatulod kami ti link tapno ma-reset ti password mo.'
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>

          {error && (
            <div className="auth-error-msg" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {sent && (
            <div className="auth-success-msg" role="status">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>
                {lang === 'il'
                  ? 'Naipatulod ti reset link! Kitaem ti email mo.'
                  : 'Reset link sent! Check your email inbox.'}
              </span>
            </div>
          )}

          {!sent ? (
            <form className="auth-form" onSubmit={handleReset} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  {lang === 'il' ? 'Email Address' : 'Email Address'}
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder={lang === 'il' ? 'Isurat ti email mo' : 'Enter your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading
                  ? (lang === 'il' ? 'Agipatpatulod...' : 'Sending...')
                  : (lang === 'il' ? 'Ipatulod ti Reset Link' : 'Send Reset Link')}
              </button>
            </form>
          ) : (
            <Link to="/login" className="auth-submit-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              {lang === 'il' ? 'Agsubli iti Login' : 'Back to Login'}
            </Link>
          )}

          <div className="auth-footer">
            <span>{lang === 'il' ? 'Malagip mo metten?' : 'Remember your password?'}</span>
            <Link to="/login" className="auth-link">
              {lang === 'il' ? 'Ag-Log In' : 'Log In'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
