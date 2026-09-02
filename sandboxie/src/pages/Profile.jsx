import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import './Auth.css';

const Profile = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || '');
      
      // Fetch progress
      const fetchProgress = async () => {
        const { data } = await supabase
          .from('user_progress')
          .select('module_id, status')
          .eq('user_id', user.id);
        if (data) {
          const map = {};
          data.forEach(item => { map[item.module_id] = item.status; });
          setProgress(map);
        }
      };
      fetchProgress();
    }
  }, [user]);

  const completedCount = [1,2,3,4].filter(id => progress[id] === 'completed').length;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName }
    });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="module-page" style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="module-breadcrumb">
        <Link to="/">Dashboard</Link>
        <span className="module-breadcrumb-sep">›</span>
        <span className="module-breadcrumb-current">
          {lang === 'il' ? 'Propayl' : 'Profile'}
        </span>
      </div>

      <div className="module-header">
        <h1 className="module-title">
          {lang === 'il' ? 'Ti Propayl Ko' : 'My Profile'}
        </h1>
      </div>
      
      <div className="module-divider"></div>
      
      <div className="auth-card" style={{ maxWidth: '100%', padding: '32px' }}>
        {/* User Info Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'var(--accent-bg)', border: '1px solid rgba(124, 92, 252, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)',
            fontSize: '28px', fontWeight: 700, fontFamily: "'Rajdhani', sans-serif",
            textTransform: 'uppercase'
          }}>
            {(user.user_metadata?.full_name || user.email || '?').charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {user.user_metadata?.full_name || (lang === 'il' ? 'Agar-usar' : 'User')}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' 
        }}>
          <div style={{
            padding: '16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-light)', fontFamily: "'Rajdhani', sans-serif" }}>
              {completedCount}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {lang === 'il' ? 'Nalpas' : 'Completed'}
            </div>
          </div>
          <div style={{
            padding: '16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
              4
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {lang === 'il' ? 'Amin a Modul' : 'Total Modules'}
            </div>
          </div>
          <div style={{
            padding: '16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: completedCount === 4 ? 'var(--mod-green)' : 'var(--mod-amber)', fontFamily: "'Rajdhani', sans-serif" }}>
              {Math.round((completedCount / 4) * 100)}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {lang === 'il' ? 'Progreso' : 'Progress'}
            </div>
          </div>
        </div>

        {/* Edit form */}
        {saved && (
          <div className="auth-success-msg">
            {lang === 'il' ? 'Naidulin dagiti panagbalbaliw!' : 'Changes saved successfully!'}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {lang === 'il' ? 'Nagan a Maipakita' : 'Display Name'}
            </label>
            <input 
              type="text" 
              id="name" 
              className="form-input" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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
              value={user.email}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={saving} style={{ maxWidth: '200px' }}>
            {saving 
              ? (lang === 'il' ? 'Ag-save...' : 'Saving...') 
              : (lang === 'il' ? 'I-Save' : 'Save Changes')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
