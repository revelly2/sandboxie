import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const tutorials = {
  'disk-cleanup': {
    title: { il: 'Disk Cleanup', en: 'Disk Cleanup' },
    description: {
      il: 'Daytoy a video tutorial ipakitana no kasano ti ag-perform iti Disk Cleanup iti Windows. Ti Disk Cleanup ket agdalus kadagiti saan a kasapulan a files kas dagiti temporary files, cached data, ken dadduma pay tapno maka-free iti disk space ken rumang-ay ti performance ti kompiuter.',
      en: 'This video tutorial shows how to perform a Disk Cleanup on Windows. Disk Cleanup removes unnecessary files such as temporary files, cached data, and more to free up disk space and improve computer performance.'
    },
    video: '/videos/disk.mp4',
    color: '#00d4ff'
  },
  'windows-defender': {
    title: { il: 'Windows Defender Quick Scan ken Virus Removal', en: 'Windows Defender Quick Scan & Virus Removal' },
    description: {
      il: 'Daytoy a video tutorial ipakitana no kasano ti ag-run iti Quick Scan babaen ti Windows Defender tapno makita dagiti virus ken malware. Ipakitana met no kasano ti agpaalis kadagiti nakita a threats tapno masaluadan ti sistema mo.',
      en: 'This video tutorial shows how to run a Quick Scan using Windows Defender to detect viruses and malware. It also demonstrates how to remove detected threats to keep your system safe.'
    },
    video: '/videos/def.mp4',
    color: '#00ff88'
  },
  'temp-cleanup': {
    title: { il: 'Temp Data Cleanup', en: 'Temp Data Cleanup' },
    description: {
      il: 'Daytoy a video tutorial ipakitana no kasano ti agdalus iti temporary data iti kompiuter mo. Dagiti temp files ket maurnong bayat ti panagtrabaho ken mabalin a mangpabagal iti sistema no adu unay ti naipondar.',
      en: 'This video tutorial shows how to clean up temporary data on your computer. Temp files accumulate during use and can slow down your system when too many pile up.'
    },
    video: '/videos/temp.mp4',
    color: '#f59e0b'
  }
};

const VideoTutorial = () => {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const tutorial = tutorials[slug];

  if (!tutorial) {
    return (
      <div className="dashboard-page" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Tutorial not found</h2>
        <Link to="/video-tutorials" style={{ color: '#a78bfa', marginTop: '16px', display: 'inline-block' }}>
          ← Back to Video Tutorials
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div className="dashboard-hero-glow"></div>
        <div className="dashboard-hero-content">
          <nav className="module-breadcrumb" aria-label="breadcrumb">
            <Link to="/">Dashboard</Link>
            <span className="module-breadcrumb-sep">›</span>
            <Link to="/video-tutorials">Video Tutorials</Link>
            <span className="module-breadcrumb-sep">›</span>
            <span className="module-breadcrumb-current">
              {tutorial.title[lang] || tutorial.title.en}
            </span>
          </nav>
          <h1 className="dashboard-title" style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}>
            {tutorial.title[lang] || tutorial.title.en}
          </h1>
        </div>
      </div>

      <div className="dashboard-folders-section">
        <div className="module-folder-card" style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#000',
            marginBottom: '24px'
          }}>
            <video
              controls
              style={{ width: '100%', display: 'block', borderRadius: '12px' }}
              preload="metadata"
            >
              <source src={tutorial.video} type="video/mp4" />
              {lang === 'il'
                ? 'Saan a masuportaran ti browser mo ti video.'
                : 'Your browser does not support the video tag.'}
            </video>
          </div>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '24px'
          }}>
            {tutorial.description[lang] || tutorial.description.en}
          </p>

          <Link
            to="/video-tutorials"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: tutorial.color,
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none'
            }}
          >
            ← {lang === 'il' ? 'Agsubli kadagiti Video Tutorials' : 'Back to Video Tutorials'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoTutorial;
