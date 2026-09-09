import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const Quizzes = () => {
  const { lang } = useLanguage();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data, error } = await supabase.from('quizzes').select('*');
      if (!error && data) {
        setQuizzes(data);
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

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
              {lang === 'il' ? 'Dagiti Quiz' : 'Quizzes'}
            </span>
          </nav>
          <h1 className="dashboard-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
            {lang === 'il' ? 'Dagiti Quiz' : 'Quizzes'}
          </h1>
          <p className="dashboard-subtitle">
            {lang === 'il'
              ? 'Suboken ti ammom babaen kadagiti quiz. Pilien ti quiz tapno mangrugi.'
              : 'Test your knowledge with quizzes. Select a quiz to begin.'}
          </p>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="dashboard-folders-section">
        <h2 className="dashboard-section-title">
          {lang === 'il' ? 'Dagiti Magun-od a Quiz' : 'Available Quizzes'}
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            {lang === 'il' ? 'Ag-loading...' : 'Loading...'}
          </p>
        ) : quizzes.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            {lang === 'il' ? 'Awan pay ti quiz.' : 'No quizzes available yet.'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {quizzes.map(quiz => (
              <div
                key={quiz.id}
                className="module-folder-card"
                style={{ cursor: 'pointer', padding: '24px', transition: 'all 0.3s ease', minHeight: '160px', display: 'flex', flexDirection: 'column' }}
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{quiz.title}</h3>
                  <p style={{ color: 'var(--accent-light)', fontSize: '0.9rem', fontWeight: 500 }}>{quiz.module}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  {quiz.time_limit_minutes > 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      ⏱ {quiz.time_limit_minutes} {lang === 'il' ? 'min' : 'mins'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⏱ {lang === 'il' ? 'Awan limit' : 'No limit'}
                    </span>
                  )}
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>{lang === 'il' ? 'Irugi' : 'Start'} →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
