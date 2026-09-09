import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SimulationsHub = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const simulations = [
    {
      id: 1,
      path: '/simulations/1',
      title: lang === 'il' ? 'Virus vs Worm' : 'Virus vs Worm',
      desc: lang === 'il'
        ? 'Diferensiaen ti Virus ken Worm babaen kadagiti real-world scenarios iti retro-style a pagay-ayaman.'
        : 'Differentiate between a Virus and a Worm through real-world scenarios in a retro-style mini-game.',
      icon: '🛡️',
      color: '#00ff88',
      bg: 'rgba(0, 255, 136, 0.1)'
    },
    {
      id: 2,
      path: '/simulations/2',
      title: lang === 'il' ? 'Trojan ken Ransomware' : 'Trojan & Ransomware',
      desc: lang === 'il'
        ? 'Padasen a solbaren ti Trojan ken Ransomware attacks iti uneg ti pek-peke a PC desktop usaren ti Sandbox.'
        : 'Experience handling Trojan and Ransomware attacks inside a mock PC desktop using the Sandbox.',
      icon: '💻',
      color: '#7c5cfc',
      bg: 'rgba(124, 92, 252, 0.1)'
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-glow"></div>
        <div className="dashboard-hero-content">
          <nav className="module-breadcrumb" aria-label="breadcrumb">
            <Link to="/">Dashboard</Link>
            <span className="module-breadcrumb-sep">›</span>
            <span className="module-breadcrumb-current">
              {lang === 'il' ? 'Simulations' : 'Simulations'}
            </span>
          </nav>
          <h1 className="dashboard-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
            {lang === 'il' ? 'Simulations Hub' : 'Simulations Hub'}
          </h1>
          <p className="dashboard-subtitle">
            {lang === 'il'
              ? 'Usaren dagiti simulations tapno ad-adda a maawatan no kasano agtrabaho dagiti malware.'
              : 'Play through interactive simulations to better understand how malware operates.'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="dashboard-folders-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {simulations.map(sim => (
            <div
              key={sim.id}
              className="module-folder-card"
              style={{
                cursor: 'pointer',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                border: `1px solid ${sim.bg}`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate(sim.path)}
            >
              {/* Background accent */}
              <div style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                background: sim.bg,
                borderRadius: '50%',
                filter: 'blur(40px)',
                zIndex: 0
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{sim.icon}</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  {sim.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {sim.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', color: sim.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  {lang === 'il' ? 'LUKTAN ▸' : 'OPEN ▸'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationsHub;
