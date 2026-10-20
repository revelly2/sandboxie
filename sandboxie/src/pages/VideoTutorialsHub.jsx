import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const VideoTutorialsHub = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const tutorials = [
    {
      id: 1,
      path: '/video-tutorials/disk-cleanup',
      title: lang === 'il' ? 'Disk Cleanup' : 'Disk Cleanup',
      desc: lang === 'il'
        ? 'Suroten ti video tutorial tapno maammuan no kasano ti aglinis iti disk ti kompiuter tapno rumang-ay ti performance na.'
        : 'Watch this video tutorial to learn how to clean up your computer disk to improve its performance.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="2" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
        </svg>
      ),
      color: '#00d4ff',
      bg: 'rgba(0, 212, 255, 0.1)'
    },
    {
      id: 2,
      path: '/video-tutorials/windows-defender',
      title: lang === 'il' ? 'Windows Defender Quick Scan ken Virus Removal' : 'Windows Defender Quick Scan & Virus Removal',
      desc: lang === 'il'
        ? 'Agscan iti Windows Defender tapno makita ken maipaalis dagiti virus ken malware iti sistema mo.'
        : 'Run a Windows Defender Quick Scan to detect and remove viruses and malware from your system.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      color: '#00ff88',
      bg: 'rgba(0, 255, 136, 0.1)'
    },
    {
      id: 3,
      path: '/video-tutorials/temp-cleanup',
      title: lang === 'il' ? 'Temp Data Cleanup' : 'Temp Data Cleanup',
      desc: lang === 'il'
        ? 'Suroten ti video tutorial tapno maammuan no kasano ti agdalus iti temporary files tapno maka-save iti espasyo ken rumang-ay ti speed.'
        : 'Follow this video tutorial to learn how to clean up temporary files to save space and improve speed.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
          <line x1="12" y1="12" x2="12" y2="18"/>
        </svg>
      ),
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div className="dashboard-hero-glow"></div>
        <div className="dashboard-hero-content">
          <nav className="module-breadcrumb" aria-label="breadcrumb">
            <Link to="/">Dashboard</Link>
            <span className="module-breadcrumb-sep">›</span>
            <span className="module-breadcrumb-current">
              {lang === 'il' ? 'Video Tutorials' : 'Video Tutorials'}
            </span>
          </nav>
          <h1 className="dashboard-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
            {lang === 'il' ? 'Video Tutorials' : 'Video Tutorials'}
          </h1>
          <p className="dashboard-subtitle">
            {lang === 'il'
              ? 'Buyaen dagiti step-by-step a video tutorials tapno masursuruan no ti panag-maintain ken panag-protekta iti kompiuter mo.'
              : 'Watch step-by-step video tutorials to learn how to maintain and protect your computer.'}
          </p>
        </div>
      </div>

      <div className="dashboard-folders-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {tutorials.map(tut => (
            <div
              key={tut.id}
              className="module-folder-card"
              style={{
                cursor: 'pointer',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                border: `1px solid ${tut.bg}`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate(tut.path)}
            >
              <div style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                background: tut.bg,
                borderRadius: '50%',
                filter: 'blur(40px)',
                zIndex: 0
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{tut.icon}</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  {tut.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {tut.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', color: tut.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  {lang === 'il' ? 'BUYAEN ▸' : 'WATCH ▸'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoTutorialsHub;
