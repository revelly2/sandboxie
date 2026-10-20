import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { StudentVectorIllustration, StudentAvatarIcon } from '../components/StudentVectorIllustration';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { lang, setLanguage } = useLanguage();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side: Seamless Vector Student Visual Banner */}
        <div className="auth-visual-side">
          <div className="auth-vector-wrap">
            <StudentVectorIllustration className="auth-vector-svg" />
          </div>
          <div className="auth-visual-text">
            <h2 className="auth-visual-title">
              {lang === 'il' ? 'Agtukad iti IT & Cybersecurity' : 'Master IT & Cyber Defense'}
            </h2>
            <p className="auth-visual-desc">
              {lang === 'il'
                ? 'Agadal no kasano ti natalged a panagusar ti Windows Sandbox a pang-isolate kadagiti makadadael a malware.'
                : 'Learn safe malware isolation and hands-on threat defense through guided Windows Sandbox simulations.'}
            </p>
            <div className="auth-feature-pills">
              <span className="auth-feature-pill">Windows Sandbox</span>
              <span className="auth-feature-pill">Malware Isolation</span>
              <span className="auth-feature-pill">Ilocano & English</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="auth-card">
          {/* Mobile Student Avatar Icon */}
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
              {lang === 'il' ? 'Welcome' : 'Welcome'}
            </h1>
            <p className="auth-subtitle">
              {lang === 'il' ? 'Ag-log in tapno makasinarak' : 'Log in to continue your journey'}
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
          
          <form className="auth-form" onSubmit={handleLogin} noValidate>
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
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {lang === 'il' ? 'Password' : 'Password'}
              </label>
              <div className="form-input-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  className="form-input" 
                  placeholder={lang === 'il' ? 'Isurat ti password mo' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Link to="/forgot-password" className="auth-forgot-link">
              {lang === 'il' ? 'Nalipatan ti password?' : 'Forgot password?'}
            </Link>
            
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading 
                ? (lang === 'il' ? 'Ag-log in...' : 'Logging in...') 
                : (lang === 'il' ? 'Ag-Log In' : 'Log In')}
            </button>
          </form>
          
          <div className="auth-footer">
            <span>{lang === 'il' ? 'Awan pay account mo?' : "Don't have an account?"}</span>
            <Link to="/register" className="auth-link">
              {lang === 'il' ? 'Ag-Sign Up' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
