import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const { lang } = useLanguage();

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
      <div className="auth-card">
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

        {error && <div className="auth-error-msg">{error}</div>}
        {sent && (
          <div className="auth-success-msg">
            {lang === 'il'
              ? 'Naipatulod ti reset link! Kitaem ti email mo.'
              : 'Reset link sent! Check your email inbox.'}
          </div>
        )}

        {!sent ? (
          <form className="auth-form" onSubmit={handleReset}>
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
          {lang === 'il' ? 'Malagip mo metten?' : 'Remember your password?'}
          <Link to="/login" className="auth-link">
            {lang === 'il' ? 'Ag-Log In' : 'Log In'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
