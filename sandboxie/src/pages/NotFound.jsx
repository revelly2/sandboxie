import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { lang } = useLanguage();

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100vh - var(--nav-height) - 100px)',
      padding: '40px 24px', textAlign: 'center', flexDirection: 'column', gap: '20px'
    }}>
      <div style={{
        fontSize: '80px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 800,
        background: 'linear-gradient(135deg, var(--accent-light), #c084fc, #f472b6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1
      }}>
        404
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {lang === 'il' ? 'Saan a Nabirukan ti Panid' : 'Page Not Found'}
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
        {lang === 'il'
          ? 'Ti panid a birbirukem ket awan ditoy. Agsubli ka idiay Dashboard.'
          : "The page you're looking for doesn't exist. Head back to the Dashboard."}
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', borderRadius: 'var(--radius-sm)',
          background: 'var(--accent)', color: '#fff',
          textDecoration: 'none', fontWeight: 600, fontSize: '14px',
          transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(124, 92, 252, 0.3)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        {lang === 'il' ? 'Agsubli iti Dashboard' : 'Back to Dashboard'}
      </Link>
    </div>
  );
};

export default NotFound;
