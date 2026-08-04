import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Folder from '../components/Folder';
import MagicBento from '../components/MagicBento';
import { WindowIcon, VirusIcon, ShieldIcon, BroomIcon } from '../components/GlassIcons';
import BlurText from '../components/BlurText';

const modules = {
  il: [
    {
      id: 1,
      title: 'Modul 1',
      subtitle: 'Panglukat ti Windows Sandbox',
      description: 'Ammuen no kasanot panang-setup ken panagusar ti Windows Sandbox.',
      color: '#e05c5c',
      icon: <WindowIcon color="#e05c5c" />
    },
    {
      id: 2,
      title: 'Modul 2',
      subtitle: 'Panangbigbig Kadagiti Virus ken Worms',
      description: 'Adalen no kasano a bigbigen ken isina dagitoy a kita ti malware.',
      color: '#e09a3f',
      icon: <VirusIcon color="#e09a3f" />
    },
    {
      id: 3,
      title: 'Modul 3',
      subtitle: 'Panangiggem ti Trojans ken Ransomware',
      description: 'Natalged a panangtaming kadagiti napeggad a Trojans ken Ransomware.',
      color: '#5c7fe0',
      icon: <ShieldIcon color="#5c7fe0" />
    },
    {
      id: 4,
      title: 'Modul 4',
      subtitle: 'Panangikkat ti Adware',
      description: 'No kasano a dalusan ti computer manipud kadagiti makasuron nga adware.',
      color: '#3fbe8a',
      icon: <BroomIcon color="#3fbe8a" />
    }
  ],
  en: [
    {
      id: 1,
      title: 'Module 1',
      subtitle: 'Getting Started with Windows Sandbox',
      description: 'Learn how to set up and use Windows Sandbox.',
      color: '#e05c5c',
      icon: <WindowIcon color="#e05c5c" />
    },
    {
      id: 2,
      title: 'Module 2',
      subtitle: 'Identifying Viruses and Worms',
      description: 'Study how to identify and isolate these types of malware.',
      color: '#e09a3f',
      icon: <VirusIcon color="#e09a3f" />
    },
    {
      id: 3,
      title: 'Module 3',
      subtitle: 'Handling Trojans and Ransomware',
      description: 'Safely handle dangerous Trojans and Ransomware.',
      color: '#5c7fe0',
      icon: <ShieldIcon color="#5c7fe0" />
    },
    {
      id: 4,
      title: 'Module 4',
      subtitle: 'Removing Adware',
      description: 'Learn how to clean your computer from annoying adware.',
      color: '#3fbe8a',
      icon: <BroomIcon color="#3fbe8a" />
    }
  ]
};

const Dashboard = () => {
  const { lang } = useLanguage();
  const [progress, setProgress] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('sandboxie_progress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch {
      // corrupted localStorage — start fresh
      setProgress({});
    }
  }, []);

  const toggleStatus = (e, moduleId, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    const updatedProgress = { ...progress, [moduleId]: newStatus };
    setProgress(updatedProgress);
    localStorage.setItem('sandboxie_progress', JSON.stringify(updatedProgress));
  };

  const completedCount = modules.en.filter(m => progress[m.id] === 'completed').length;
  const totalCount = modules.en.length;

  return (
    <div className="dashboard-page">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-glow"></div>
        <div className="dashboard-hero-content">
          <h1 className="dashboard-title" style={{ display: 'flex', justifyContent: 'center' }}>
            <BlurText 
              text={lang === 'il' ? 'Agtukad iti Kabaelam' : 'Level Up Your Skills'}
              delay={150}
              animateBy="words"
              direction="top"
            />
          </h1>
          <p className="dashboard-subtitle">
            {lang === 'il'
              ? 'Agadal no kasano ti natalged a panag-handle kadagiti malware usaren ti Windows Sandbox. Pilien ti folder tapno luktan ti modul.'
              : 'Learn how to safely handle malware using Windows Sandbox. Click a folder to open a module.'}
          </p>

          {/* Progress Bar */}
          <div className="dashboard-progress-wrapper">
            <div className="dashboard-progress-header">
              <span>{lang === 'il' ? 'Nalpas' : 'Progress'}</span>
              <span className="dashboard-progress-count">{completedCount} / {totalCount}</span>
            </div>
            <div className="dashboard-progress-bar">
              <div
                className="dashboard-progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Folders Grid */}
      <div className="dashboard-folders-section">
        <h2 className="dashboard-section-title">
          {lang === 'il' ? 'Dagiti Modul' : 'Modules'}
        </h2>
        <MagicBento 
          className="dashboard-folders-grid"
          textAutoHide={false}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        >
          {modules[lang].map((mod) => {
            const status = progress[mod.id] || 'not_started';
            const isCompleted = status === 'completed';

            return (
              <div key={mod.id} className={`module-folder-card ${isCompleted ? 'is-completed' : ''}`}>
                {isCompleted && (
                  <div className="module-completed-badge" aria-label="Completed" role="img">
                    <span aria-hidden="true">✓</span>
                  </div>
                )}
                <div
                  className="module-folder-wrapper"
                  onClick={() => navigate(`/module/${mod.id}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/module/${mod.id}`); }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${mod.subtitle}`}
                  title={mod.subtitle}
                >
                  <Folder
                    color={mod.color}
                    size={1.6}
                    items={[]}
                  />
                </div>
                <div className="module-folder-info">
                  <div className="module-folder-icon">{mod.icon}</div>
                  <h3 className="module-folder-title">{mod.title}</h3>
                  <p className="module-folder-subtitle">{mod.subtitle}</p>
                  <p className="module-folder-desc">{mod.description}</p>
                  <div className="module-folder-actions">
                    <button
                      className="btn-open-module"
                      onClick={() => navigate(`/module/${mod.id}`)}
                    >
                      {lang === 'il' ? 'Luktan' : 'Open'}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                    <button
                      className={`btn-mark-complete ${isCompleted ? 'is-done' : ''}`}
                      onClick={(e) => toggleStatus(e, mod.id, status)}
                    >
                      {isCompleted
                        ? (lang === 'il' ? 'Undo' : 'Undo')
                        : (lang === 'il' ? 'Markaan' : 'Mark Done')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </MagicBento>
      </div>
    </div>
  );
};

export default Dashboard;
