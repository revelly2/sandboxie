import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fireConfetti } from '../lib/confetti';
import './Auth.css'; // Reusing auth styles for cards

const QuizView = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // Fetch quiz and questions
  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      const { data: quizData, error: quizError } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
      
      if (quizError || !quizData) {
        toast.error('Failed to load quiz');
        navigate('/');
        return;
      }
      setQuiz(quizData);

      const { data: qData, error: qError } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizId);
      
      if (!qError && qData) {
        let finalQuestions = [...qData];
        if (quizData.is_shuffled) {
          // Fisher-Yates shuffle
          for (let i = finalQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
          }
        }
        setQuestions(finalQuestions);
      }
      setLoading(false);
    };

    fetchQuizData();
  }, [quizId, navigate, toast]);

  // Timer logic
  useEffect(() => {
    if (started && timeLeft > 0 && !showResult) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, timeLeft, showResult]);

  const handleStart = () => {
    setStarted(true);
    if (quiz.time_limit_minutes > 0) {
      setTimeLeft(quiz.time_limit_minutes * 60); // convert to seconds
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the quiz? Your current progress will be lost.")) {
      setCurrentQ(0);
      setSelected(null);
      setAnswers([]);
      setShowResult(false);
      setConfirmed(false);
      if (quiz.time_limit_minutes > 0) {
        setTimeLeft(quiz.time_limit_minutes * 60);
      }
    }
  };

  const handleAutoSubmit = () => {
    toast.info('Time is up! Submitting your current progress.');
    finishQuiz(answers);
  };

  const handleSelect = (index) => {
    if (confirmed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    
    setConfirmed(true);
    const question = questions[currentQ];
    const newAnswers = [...answers, { selected, correct: question.correct_option_index }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setConfirmed(false);
      } else {
        finishQuiz(newAnswers);
      }
    }, 1200);
  };

  const finishQuiz = (finalAnswers) => {
    clearInterval(timerRef.current);
    setShowResult(true);
    
    const score = finalAnswers.filter(a => a.selected === a.correct).length;
    const total = questions.length;
    
    if (score === total && total > 0) {
      fireConfetti();
    }

    if (user) {
      supabase.from('quiz_scores').upsert({
        user_id: user.id,
        quiz_id: quiz.id, 
        score,
        total: total,
        completed_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.error('Failed to save quiz score:', error);
      });
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', color: '#9aa0b4' }}>Loading Quiz...</div>;
  if (!quiz || questions.length === 0) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', color: '#9aa0b4' }}>Quiz is empty or unavailable.</div>;

  // Pre-quiz screen
  if (!started) {
    return (
      <div className="module-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="auth-card" style={{ padding: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>{quiz.title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Module: {quiz.module}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', minWidth: '120px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{questions.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Questions</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', minWidth: '120px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{quiz.time_limit_minutes > 0 ? `${quiz.time_limit_minutes}m` : 'None'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Time Limit</div>
            </div>
          </div>

          <button className="auth-submit-btn" onClick={handleStart} style={{ maxWidth: '250px', padding: '16px', fontSize: '1.1rem' }}>
            Start Quiz
          </button>
          <button className="auth-submit-btn" onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', maxWidth: '250px', marginTop: '12px' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const score = answers.filter(a => a.selected === a.correct).length;
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="module-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="auth-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Quiz Completed!</h2>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: "'Rajdhani', sans-serif" }}>
            {score} / {total}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {percentage >= 80 ? 'Excellent job! You mastered this quiz.' : percentage >= 50 ? 'Good effort, but there is room for improvement.' : 'Keep studying and try again!'}
          </p>
          
          <button className="auth-submit-btn" onClick={() => navigate('/')} style={{ maxWidth: '250px' }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active quiz screen
  const question = questions[currentQ];

  return (
    <div className="module-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>
      
      {/* Quiz Header with Timer and Reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '4px', height: '18px', background: 'var(--accent)', borderRadius: '4px' }}></div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{quiz.title}</h2>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>Question {currentQ + 1} / {questions.length}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {quiz.time_limit_minutes > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 60 ? '#f87171' : 'var(--text-primary)' }}>
              <span style={{ fontSize: '1.2rem' }}>⏱</span>
              <strong style={{ fontSize: '1.5rem', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</strong>
            </div>
          )}
          <button 
            onClick={handleReset}
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              color: 'var(--text-primary)', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontSize: '0.9rem',
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)' }}
            title="Reset Quiz"
          >
            ↻ Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '6px', borderRadius: '999px',
            background: i < currentQ ? 'var(--accent)' : i === currentQ ? 'var(--accent-light)' : 'var(--bg-elevated)',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      {/* Question Card */}
      <div className="auth-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', lineHeight: 1.5 }}>
          {question.question_text}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((opt, i) => {
            let borderColor = 'var(--border-subtle)';
            let bg = 'var(--bg-elevated)';
            let textColor = 'var(--text-secondary)';

            if (confirmed) {
              if (i === question.correct_option_index) {
                borderColor = 'rgba(63,190,138,0.5)';
                bg = 'rgba(63,190,138,0.1)';
                textColor = '#6ee7b7';
              } else if (i === selected && i !== question.correct_option_index) {
                borderColor = 'rgba(248,113,113,0.5)';
                bg = 'rgba(248,113,113,0.1)';
                textColor = '#f87171';
              }
            } else if (i === selected) {
              borderColor = 'rgba(124,92,252,0.5)';
              bg = 'rgba(124,92,252,0.1)';
              textColor = 'var(--accent-light)';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={confirmed}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px', borderRadius: 'var(--radius-md)',
                  border: `1px solid ${borderColor}`, background: bg,
                  color: textColor, fontSize: '1rem', fontFamily: 'inherit',
                  cursor: confirmed ? 'default' : 'pointer',
                  transition: 'all 0.2s', textAlign: 'left',
                  fontWeight: i === selected ? 600 : 400
                }}
              >
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: `2px solid ${borderColor}`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                  background: i === selected ? (confirmed ? bg : 'rgba(124,92,252,0.2)') : 'transparent'
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {!confirmed && (
          <button
            className="auth-submit-btn"
            onClick={handleConfirm}
            disabled={selected === null}
            style={{ 
              marginTop: '24px', maxWidth: '200px',
              opacity: selected === null ? 0.5 : 1,
              cursor: selected === null ? 'not-allowed' : 'pointer'
            }}
          >
            Confirm
          </button>
        )}

        {confirmed && (
          <div style={{ 
            marginTop: '20px', fontSize: '1rem', fontWeight: 600,
            color: selected === question.correct_option_index ? 'var(--mod-green)' : 'var(--mod-red)'
          }}>
            {selected === question.correct_option_index ? '✓ Correct!' : '✕ Incorrect'}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
