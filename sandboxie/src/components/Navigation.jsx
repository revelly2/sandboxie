import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navigation = ({ onOpenProfile }) => {
  const { lang, toggleLanguage, setLanguage } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`app-nav ${scrolled ? 'app-nav--scrolled' : ''}`}>
        <div className="app-nav-inner">
          <Link to="/" className="app-nav-brand">
            <div className="app-nav-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <path d="M9 9h6M9 12h6M9 15h4"/>
              </svg>
            </div>
            <span className="app-nav-brand-text">Sandboxie</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="app-nav-links desktop-only">
            <Link
              to="/"
              className={`app-nav-link ${location.pathname === '/' ? 'app-nav-link--active' : ''}`}
            >
              {lang === 'il' ? 'Dashboard' : 'Dashboard'}
            </Link>
            <Link
              to="/simulations"
              className={`app-nav-link ${location.pathname.startsWith('/simulation') ? 'app-nav-link--active' : ''}`}
            >
              {lang === 'il' ? 'Simulation' : 'Simulation'}
            </Link>
            <Link
              to="/video-tutorials"
              className={`app-nav-link ${location.pathname.startsWith('/video-tutorial') ? 'app-nav-link--active' : ''}`}
            >
              {lang === 'il' ? 'Video Tutorials' : 'Video Tutorials'}
            </Link>
            <Link
              to="/quizzes"
              className={`app-nav-link ${location.pathname.startsWith('/quiz') ? 'app-nav-link--active' : ''}`}
            >
              {lang === 'il' ? 'Quiz' : 'Quiz'}
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="app-nav-actions desktop-only">
            <button className="app-nav-lang-btn" onClick={toggleLanguage} aria-label="Toggle language">
              <span className="lang-globe">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </span>
              <span className="lang-name">{lang === 'il' ? 'Ilocano' : 'English'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            
            <button 
              className="app-nav-profile-btn" 
              onClick={onOpenProfile}
              aria-label="Open Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>

          {/* Mobile Top-Bar Quick Controls */}
          <div className="app-nav-mobile-bar mobile-only">
            {/* Quick 1-tap Language Switcher on mobile navbar */}
            <button 
              className="nav-mobile-lang-pill"
              onClick={toggleLanguage}
              aria-label={`Current language: ${lang === 'il' ? 'Ilocano' : 'English'}. Tap to switch language.`}
              title={lang === 'il' ? 'Sukatan iti English' : 'Switch to Ilocano'}
            >
              <span className="mobile-lang-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </span>
              <span className="mobile-lang-badge">{lang === 'il' ? 'IL' : 'EN'}</span>
            </button>

            {/* Profile trigger on mobile */}
            <button 
              className="nav-mobile-action-btn"
              onClick={onOpenProfile}
              aria-label="Open Profile"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {/* Mobile Hamburger toggle */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Unified Mobile Drawer Backdrop */}
      <div 
        className={`app-mobile-backdrop ${mobileOpen ? 'is-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Unified Mobile Drawer Content */}
      <div className={`app-mobile-drawer ${mobileOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-title">
            {lang === 'il' ? 'Direksion & Pagsasao' : 'Navigation & Language'}
          </div>
          <button 
            className="mobile-drawer-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Primary Links */}
        <div className="mobile-drawer-nav">
          <Link
            to="/"
            className={`mobile-drawer-link ${location.pathname === '/' ? 'is-active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="mobile-link-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </span>
            <span className="mobile-link-text">{lang === 'il' ? 'Dashboard' : 'Dashboard'}</span>
            <span className="mobile-link-chevron">›</span>
          </Link>

          <Link
            to="/simulations"
            className={`mobile-drawer-link ${location.pathname.startsWith('/simulation') ? 'is-active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="mobile-link-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <span className="mobile-link-text">{lang === 'il' ? 'Simulation Lab' : 'Simulation Lab'}</span>
            <span className="mobile-link-chevron">›</span>
          </Link>

          <Link
            to="/video-tutorials"
            className={`mobile-drawer-link ${location.pathname.startsWith('/video-tutorial') ? 'is-active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="mobile-link-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </span>
            <span className="mobile-link-text">{lang === 'il' ? 'Video Tutorials' : 'Video Tutorials'}</span>
            <span className="mobile-link-chevron">›</span>
          </Link>

          <Link
            to="/quizzes"
            className={`mobile-drawer-link ${location.pathname.startsWith('/quiz') ? 'is-active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="mobile-link-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </span>
            <span className="mobile-link-text">{lang === 'il' ? 'Quiz & Assessment' : 'Quiz & Assessment'}</span>
            <span className="mobile-link-chevron">›</span>
          </Link>
        </div>

        {/* Dedicated Mobile Language Switcher Card */}
        <div className="mobile-drawer-lang-card">
          <div className="mobile-lang-card-header">
            <span className="mobile-lang-title">
              {lang === 'il' ? 'Pagsasao (Language)' : 'Language (Pagsasao)'}
            </span>
            <span className="mobile-lang-current">
              {lang === 'il' ? 'Ilocano' : 'English'}
            </span>
          </div>

          <div className="mobile-lang-toggle-group">
            <button
              type="button"
              className={`mobile-lang-choice-btn ${lang === 'il' ? 'is-active' : ''}`}
              onClick={() => setLanguage('il')}
            >
              <span className="choice-code">IL</span>
              <span className="choice-label">Ilocano</span>
              {lang === 'il' && <span className="choice-check">✓</span>}
            </button>

            <button
              type="button"
              className={`mobile-lang-choice-btn ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              <span className="choice-code">EN</span>
              <span className="choice-label">English</span>
              {lang === 'en' && <span className="choice-check">✓</span>}
            </button>
          </div>
        </div>

        {/* Quick Profile Footer Action */}
        <div className="mobile-drawer-footer">
          <button 
            type="button" 
            className="mobile-drawer-profile-btn"
            onClick={() => {
              setMobileOpen(false);
              onOpenProfile();
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>{lang === 'il' ? 'Luktan ti Propayl' : 'View Profile'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
