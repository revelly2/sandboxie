import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navigation = ({ onOpenProfile }) => {
  const { lang, toggleLanguage } = useLanguage();
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

  return (
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

        {/* Hamburger button (mobile only) */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
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

        <div className={`app-nav-links ${mobileOpen ? 'is-open' : ''}`}>
          <Link
            to="/"
            className={`app-nav-link ${location.pathname === '/' ? 'app-nav-link--active' : ''}`}
          >
            {lang === 'il' ? 'Dashboard' : 'Dashboard'}
          </Link>
        </div>

        <div className={`app-nav-actions ${mobileOpen ? 'is-open' : ''}`}>
          <button className="app-nav-lang-btn" onClick={toggleLanguage} aria-label="Toggle language">
            <span className="lang-globe">
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" className="nc-icon-wrapper">
                  <path d="M12 15.1099V12.134H18.5C19.3284 12.134 20 11.4624 20 10.634L20 6.63397C20 5.80555 19.3284 5.13398 18.5 5.13398L12 5.13398V2.15802C12 0.917543 10.58 0.213184 9.59238 0.963774L1.07138 7.43974C0.281546 8.04001 0.281546 9.22795 1.07138 9.82822L9.59238 16.3042C10.58 17.0548 12 16.3504 12 15.1099Z" fill="url(#nav_lang_g1)" data-glass="origin" mask="url(#nav_lang_mask)"></path>
                  <path d="M12 15.1099V12.134H18.5C19.3284 12.134 20 11.4624 20 10.634L20 6.63397C20 5.80555 19.3284 5.13398 18.5 5.13398L12 5.13398V2.15802C12 0.917543 10.58 0.213184 9.59238 0.963774L1.07138 7.43974C0.281546 8.04001 0.281546 9.22795 1.07138 9.82822L9.59238 16.3042C10.58 17.0548 12 16.3504 12 15.1099Z" fill="url(#nav_lang_g1)" data-glass="clone" filter="url(#nav_lang_filter)" clipPath="url(#nav_lang_clip)"></path>
                  <path d="M12 21.976L12 19L5.50001 19C4.67158 19 4 18.3284 4.00001 17.5L4.00003 13.5C4.00003 12.6716 4.67161 12 5.50003 12L12 12L12 9.02404C12 7.78356 13.42 7.07921 14.4076 7.8298L22.9286 14.3058C23.7185 14.906 23.7185 16.094 22.9286 16.6942L14.4076 23.1702C13.42 23.9208 12 23.2164 12 21.976Z" fill="url(#nav_lang_g2)" data-glass="blur"></path>
                  <path d="M4 17.4996V13.4996C4.0001 12.6712 4.67165 11.9996 5.5 11.9996H12V9.024C12 7.78361 13.4196 7.07932 14.4072 7.82966L22.9287 14.3052C23.7185 14.9055 23.7184 16.0936 22.9287 16.6939L14.4072 23.1695C13.4505 23.8966 12.0881 23.2588 12.0039 22.0904L12 21.9761V18.9996H5.5V18.2496H12.75V21.9761C12.7503 22.5961 13.4604 22.948 13.9541 22.5728L22.4746 16.0972C22.8695 15.7971 22.8695 15.203 22.4746 14.9029L13.9541 8.42634C13.4603 8.05104 12.75 8.40376 12.75 9.024V12.7496H5.5C5.08586 12.7496 4.7501 13.0855 4.75 13.4996V17.4996C4.75 17.9138 5.08579 18.2496 5.5 18.2496V18.9996L5.34668 18.9918C4.59028 18.915 4 18.2762 4 17.4996Z" fill="url(#nav_lang_g3)"></path>
                  <defs>
                    <linearGradient id="nav_lang_g1" x1="10.239" y1=".655" x2="10.239" y2="16.613" gradientUnits="userSpaceOnUse">
                      <stop stopColor="rgba(87, 87, 87, 1)"></stop>
                      <stop offset="1" stopColor="rgba(21, 21, 21, 1)"></stop>
                    </linearGradient>
                    <linearGradient id="nav_lang_g2" x1="24.5" y1="15.5" x2="4" y2="15.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="rgba(227, 227, 229, 0.6)"></stop>
                      <stop offset="1" stopColor="rgba(187, 187, 192, 0.6)"></stop>
                    </linearGradient>
                    <linearGradient id="nav_lang_g3" x1="13.761" y1="7.521" x2="13.761" y2="16.762" gradientUnits="userSpaceOnUse">
                      <stop stopColor="rgba(255, 255, 255, 1)"></stop>
                      <stop offset="1" stopColor="rgba(255, 255, 255, 1)" stopOpacity="0"></stop>
                    </linearGradient>
                    <filter id="nav_lang_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                      <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                    </filter>
                    <clipPath id="nav_lang_clip">
                      <path d="M12 21.976L12 19L5.50001 19C4.67158 19 4 18.3284 4.00001 17.5L4.00003 13.5C4.00003 12.6716 4.67161 12 5.50003 12L12 12L12 9.02404C12 7.78356 13.42 7.07921 14.4076 7.8298L22.9286 14.3058C23.7185 14.906 23.7185 16.094 22.9286 16.6942L14.4076 23.1702C13.42 23.9208 12 23.2164 12 21.976Z" fill="url(#nav_lang_g2)"></path>
                    </clipPath>
                    <mask id="nav_lang_mask">
                      <rect width="100%" height="100%" fill="#FFF"></rect>
                      <path d="M12 21.976L12 19L5.50001 19C4.67158 19 4 18.3284 4.00001 17.5L4.00003 13.5C4.00003 12.6716 4.67161 12 5.50003 12L12 12L12 9.02404C12 7.78356 13.42 7.07921 14.4076 7.8298L22.9286 14.3058C23.7185 14.906 23.7185 16.094 22.9286 16.6942L14.4076 23.1702C13.42 23.9208 12 23.2164 12 21.976Z" fill="#000"></path>
                    </mask>
                  </defs>
                </g>
              </svg>
            </span>
            <span>{lang === 'il' ? 'Ilocano' : 'English'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          
          <button 
            className="app-nav-lang-btn" 
            style={{ padding: '8px', borderRadius: '50%' }}
            onClick={onOpenProfile}
            aria-label="Open Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
