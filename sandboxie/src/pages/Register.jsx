import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', labelIl: 'Nakapuy', color: '#e05c5c' };
  if (score <= 3) return { level: 2, label: 'Medium', labelIl: 'Kasla Imbag', color: '#e09a3f' };
  return { level: 3, label: 'Strong', labelIl: 'Natibker', color: '#3fbe8a' };
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const strength = getPasswordStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {lang === 'il' ? 'Agaramid ti Account' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {lang === 'il' ? 'Sumali ka iti Sandboxie ita' : 'Join Sandboxie today'}
          </p>
        </div>
        
        {error && <div className="auth-error-msg">{error}</div>}
        {success && (
          <div className="auth-success-msg">
            {lang === 'il' 
              ? 'Nagballigi ti rehistrasyon! Agturong idiay login...' 
              : 'Registration successful! Redirecting to login...'}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {lang === 'il' ? 'Kompleto a Nagan' : 'Full Name'}
            </label>
            <input 
              type="text" 
              id="name" 
              className="form-input" 
              placeholder={lang === 'il' ? 'Isurat ti nagan mo' : 'Enter your name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
                placeholder={lang === 'il' ? 'Agaramid ti password' : 'Create a password'}
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
            {/* Password strength indicator */}
            {password && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div 
                    className="password-strength-fill" 
                    style={{ 
                      width: `${(strength.level / 3) * 100}%`, 
                      background: strength.color 
                    }} 
                  />
                </div>
                <span className="password-strength-label" style={{ color: strength.color }}>
                  {lang === 'il' ? strength.labelIl : strength.label}
                </span>
              </div>
            )}
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading 
              ? (lang === 'il' ? 'Ag-sign up...' : 'Signing Up...') 
              : (lang === 'il' ? 'Ag-Sign Up' : 'Sign Up')}
          </button>
        </form>
        
        <div className="auth-footer">
          {lang === 'il' ? 'Adda metten account mo?' : 'Already have an account?'} 
          <Link to="/login" className="auth-link">
            {lang === 'il' ? 'Ag-Log In' : 'Log In'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
