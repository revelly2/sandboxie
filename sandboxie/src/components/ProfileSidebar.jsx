import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import './ProfileSidebar.css';

const ProfileSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'is-open' : ''}`} 
        onClick={onClose}
      ></div>
      <div className={`profile-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{lang === 'il' ? 'Propayl' : 'Profile'}</h2>
          <button className="sidebar-close" onClick={onClose} aria-label="Close Sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="sidebar-content">
          {user ? (
            <div className="sidebar-user-info">
              <div className="sidebar-avatar" style={{
                fontSize: '18px', fontWeight: 700, fontFamily: "'Rajdhani', sans-serif"
              }}>
                {(user.user_metadata?.full_name || user.email || '?').charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">{user.user_metadata?.full_name || (lang === 'il' ? 'Agar-usar' : 'User')}</div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="sidebar-user-info">
              <div className="sidebar-avatar">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">{lang === 'il' ? 'Bisita' : 'Guest'}</div>
                <div className="sidebar-user-email">{lang === 'il' ? 'Pangngaasi ag-log in' : 'Please log in'}</div>
              </div>
            </div>
          )}
          
          <nav className="sidebar-nav">
            {user && (
              <Link to="/profile" className="sidebar-link" onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {lang === 'il' ? 'Ti Propayl Ko' : 'My Profile'}
              </Link>
            )}
            {!user ? (
              <>
                <Link to="/login" className="sidebar-link sidebar-link-accent" onClick={onClose}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  {lang === 'il' ? 'Ag-Log In' : 'Log In'}
                </Link>
                <Link to="/register" className="sidebar-link" onClick={onClose}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  {lang === 'il' ? 'Ag-Rehistro' : 'Register'}
                </Link>
              </>
            ) : (
              <button className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }} onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                {lang === 'il' ? 'Ag-Log Out' : 'Log Out'}
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
