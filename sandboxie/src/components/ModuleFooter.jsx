import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ModuleFooter = ({ moduleId }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sandboxie_progress') || '{}');
      if (saved[moduleId] === 'completed') {
        setIsCompleted(true);
      }
    } catch (e) {
      // Ignore errors
    }
  }, [moduleId]);

  const toggleComplete = () => {
    try {
      const savedProgress = localStorage.getItem('sandboxie_progress');
      const saved = savedProgress ? JSON.parse(savedProgress) : {};
      const newStatus = isCompleted ? 'not_started' : 'completed';
      saved[moduleId] = newStatus;
      localStorage.setItem('sandboxie_progress', JSON.stringify(saved));
      setIsCompleted(!isCompleted);
    } catch (e) {
      // Ignore errors
    }
  };

  return (
    <div className="module-footer-actions">
      <button className="btn-back-dashboard" onClick={() => navigate('/')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        {lang === 'il' ? 'Agsubli' : 'Back'}
      </button>
      <button
        className={`btn-mark-complete ${isCompleted ? 'is-done' : ''}`}
        onClick={toggleComplete}
      >
        {isCompleted 
          ? (lang === 'il' ? 'Nalpas' : 'Completed') 
          : (lang === 'il' ? 'Markaan a Nalpas' : 'Mark as Completed')}
        {isCompleted && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: 6 }}>
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ModuleFooter;
