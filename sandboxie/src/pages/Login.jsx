import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { lang } = useLanguage();

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
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {lang === 'il' ? 'Mabalin Ka Manen' : 'Welcome Back'}
          </h1>
          <p className="auth-subtitle">
            {lang === 'il' ? 'Ag-log in tapno makasinarak' : 'Log in to continue your journey'}
          </p>
        </div>
        
        {error && <div className="auth-error-msg">{error}</div>}
        
        <form className="auth-form" onSubmit={handleLogin}>
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
          {lang === 'il' ? 'Awan pay account mo?' : "Don't have an account?"} 
          <Link to="/register" className="auth-link">
            {lang === 'il' ? 'Ag-Sign Up' : 'Sign Up'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
