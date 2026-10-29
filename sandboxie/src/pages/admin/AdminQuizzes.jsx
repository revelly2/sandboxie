import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

const AdminQuizzes = () => {
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' | 'results'
  const [quizzes, setQuizzes] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingScores, setLoadingScores] = useState(false);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewQuiz, setPreviewQuiz] = useState(null);

  const toast = useToast();
  
  const [formData, setFormData] = useState({ 
    title: '', 
    module: 'Module 1',
    time_limit_minutes: 0
  });
  
  const [questions, setQuestions] = useState([]);

  // Fetch Quizzes from Supabase
  const fetchQuizzes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      toast.error('Failed to load quizzes');
    } else {
      setQuizzes(data || []);
    }
    setLoading(false);
  };

  // Fetch Student Quiz Scores & Submissions
  const fetchScores = async () => {
    setLoadingScores(true);
    let remoteScores = [];
    try {
      const { data, error } = await supabase.from('quiz_scores').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        remoteScores = data;
      }
    } catch (err) {
      console.error('Error fetching quiz_scores:', err);
    }

    // Try fetching profiles to match user_id with student name/email
    let profilesMap = {};
    try {
      const { data: profs } = await supabase.from('profiles').select('id, email, full_name');
      if (profs) {
        profs.forEach(p => { profilesMap[p.id] = p; });
      }
    } catch (_err) {}

    // Merge with local submissions log for richer student metadata (e.g. emails)
    let localSubmissions = [];
    try {
      const stored = localStorage.getItem('student_quiz_submissions');
      if (stored) localSubmissions = JSON.parse(stored);
    } catch (e) {}

    // Combine and deduplicate
    const combined = [...localSubmissions];
    remoteScores.forEach(r => {
      const exists = combined.some(c => c.id === r.id || (c.user_id === r.user_id && Math.abs(new Date(c.created_at) - new Date(r.created_at)) < 5000));
      if (!exists) {
        const studentProfile = profilesMap[r.user_id];
        const studentIdentifier = studentProfile?.full_name
          ? `${studentProfile.full_name} (${studentProfile.email})`
          : (studentProfile?.email || `Student (${r.user_id?.slice(0, 8)}...)`);

        combined.push({
          id: r.id,
          user_id: r.user_id,
          user_email: studentIdentifier,
          module: `Module ${r.module_id}`,
          quiz_title: `Module ${r.module_id} Quiz`,
          score: r.score,
          max_score: r.max_score,
          created_at: r.created_at
        });
      }
    });

    // Sort descending by date
    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setScores(combined);
    setLoadingScores(false);
  };

  useEffect(() => {
    fetchQuizzes();
    fetchScores();
  }, []);

  const handleOpenModal = async (quiz = null) => {
    if (quiz) {
      setEditingId(quiz.id);
      let timeLimit = quiz.time_limit_minutes || 0;
      try {
        const meta = JSON.parse(localStorage.getItem(`quiz_meta_${quiz.id}`) || '{}');
        if (meta.time_limit_minutes) timeLimit = meta.time_limit_minutes;
      } catch (e) {}

      setFormData({ 
        title: quiz.title, 
        module: quiz.module,
        time_limit_minutes: timeLimit
      });

      // Try fetching questions from Supabase, fallback to localStorage
      try {
        const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id).order('created_at', { ascending: true });
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          const savedQ = localStorage.getItem(`quiz_questions_${quiz.id}`);
          setQuestions(savedQ ? JSON.parse(savedQ) : []);
        }
      } catch (err) {
        const savedQ = localStorage.getItem(`quiz_questions_${quiz.id}`);
        setQuestions(savedQ ? JSON.parse(savedQ) : []);
      }
    } else {
      setEditingId(null);
      setFormData({ title: '', module: 'Module 1', time_limit_minutes: 0 });
      setQuestions([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenPreview = async (quiz) => {
    let qList = [];
    try {
      const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id).order('created_at', { ascending: true });
      if (data && data.length > 0) {
        qList = data;
      } else {
        const savedQ = localStorage.getItem(`quiz_questions_${quiz.id}`);
        if (savedQ) qList = JSON.parse(savedQ);
      }
    } catch (e) {
      const savedQ = localStorage.getItem(`quiz_questions_${quiz.id}`);
      if (savedQ) qList = JSON.parse(savedQ);
    }

    let timeLimit = quiz.time_limit_minutes || 0;
    try {
      const meta = JSON.parse(localStorage.getItem(`quiz_meta_${quiz.id}`) || '{}');
      if (meta.time_limit_minutes) timeLimit = meta.time_limit_minutes;
    } catch (e) {}

    setPreviewQuiz({
      ...quiz,
      time_limit_minutes: timeLimit,
      questions: qList
    });
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_option_index: 0 }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let quizId = editingId;
    const quizPayload = {
      title: formData.title,
      module: formData.module
    };

    if (editingId) {
      const { error } = await supabase.from('quizzes').update(quizPayload).eq('id', editingId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { data, error } = await supabase.from('quizzes').insert([quizPayload]).select().single();
      if (error) { toast.error(error.message); return; }
      quizId = data.id;
    }

    // Persist questions and metadata
    if (quizId) {
      try {
        localStorage.setItem(`quiz_meta_${quizId}`, JSON.stringify({
          time_limit_minutes: parseInt(formData.time_limit_minutes, 10) || 0
        }));
      } catch (e) {}

      try {
        localStorage.setItem(`quiz_questions_${quizId}`, JSON.stringify(questions));
      } catch (e) {}

      try {
        await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);
        if (questions.length > 0) {
          const questionsToInsert = questions.map(q => ({
            quiz_id: quizId,
            question_text: q.question_text,
            options: q.options,
            correct_option_index: parseInt(q.correct_option_index, 10)
          }));
          await supabase.from('quiz_questions').insert(questionsToInsert);
        }
      } catch (ignore) {}
    }

    toast.success(editingId ? 'Quiz updated!' : 'Quiz created!');
    fetchQuizzes();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) toast.error(error.message);
      else { 
        try {
          localStorage.removeItem(`quiz_meta_${id}`);
          localStorage.removeItem(`quiz_questions_${id}`);
        } catch (e) {}
        toast.success('Quiz deleted!'); 
        fetchQuizzes(); 
      }
    }
  };

  // Helper for question counts on cards
  const getQuestionCount = (quizId) => {
    try {
      const saved = localStorage.getItem(`quiz_questions_${quizId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length;
      }
    } catch (e) {}
    return null;
  };

  // Helper for time limit on cards
  const getTimeLimit = (quiz) => {
    if (quiz.time_limit_minutes) return quiz.time_limit_minutes;
    try {
      const meta = JSON.parse(localStorage.getItem(`quiz_meta_${quiz.id}`) || '{}');
      if (meta.time_limit_minutes) return meta.time_limit_minutes;
    } catch (e) {}
    return null;
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(q => {
    const matchesModule = moduleFilter === 'All' || q.module === moduleFilter;
    const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // Filter scores
  const filteredScores = scores.filter(s => {
    const matchesModule = moduleFilter === 'All' || (s.module && s.module.includes(moduleFilter.replace('Module ', ''))) || s.module === moduleFilter;
    const matchesSearch = !searchQuery || 
      (s.user_email && s.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.quiz_title && s.quiz_title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  // Calculate score statistics
  const totalAttempts = scores.length;
  const avgPercentage = totalAttempts > 0 
    ? Math.round(scores.reduce((acc, cur) => acc + ((cur.score / (cur.max_score || 1)) * 100), 0) / totalAttempts) 
    : 0;
  const passedAttempts = scores.filter(s => ((s.score / (s.max_score || 1)) * 100) >= 75).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Quiz Management</h2>
          <p style={{ margin: '6px 0 0', color: '#9aa0b4', fontSize: '0.95rem' }}>
            Build and organize quizzes, manage questions, and monitor student test results.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{
            padding: '11px 22px', 
            background: 'linear-gradient(135deg, #7c5cfc, #3b82f6)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: 600,
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(124, 92, 252, 0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Quiz
        </button>
      </div>

      {/* Navigation Tabs & Module Filter Bar */}
      <div className="admin-tabs-row">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <span>Quizzes</span>
            <span className="admin-tab-count">{quizzes.length}</span>
          </button>
          <button 
            className={`admin-tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => { setActiveTab('results'); fetchScores(); }}
          >
            <span>Student Results & Scores</span>
            <span className="admin-tab-count">{scores.length}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Module 1', 'Module 2', 'Module 3', 'Module 4'].map((mod) => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: moduleFilter === mod ? 'rgba(124, 92, 252, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: moduleFilter === mod ? '#a78bfa' : '#9aa0b4',
                border: moduleFilter === mod ? '1px solid rgba(124, 92, 252, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: '420px' }}>
        <input
          type="text"
          placeholder={activeTab === 'quizzes' ? "Search quiz title or module..." : "Search student email or quiz..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            background: 'rgba(15, 18, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(124, 92, 252, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        />
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* TAB 1: QUIZZES VIEW */}
      {activeTab === 'quizzes' && (
        <div>
          {loading ? (
            <div className="admin-glass-card" style={{ textAlign: 'center', padding: '48px', color: '#9aa0b4' }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid rgba(124,92,252,0.2)',
                borderTopColor: '#7c5cfc', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
              }} />
              <span>Loading quizzes...</span>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="admin-glass-card" style={{ textAlign: 'center', padding: '56px 24px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(124, 92, 252, 0.1)', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#a78bfa'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fff' }}>No quizzes found</h3>
              <p style={{ color: '#9aa0b4', maxWidth: '360px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
                {searchQuery || moduleFilter !== 'All' 
                  ? 'No quizzes match the current search or filter criteria.' 
                  : 'Get started by creating your first interactive module quiz.'}
              </p>
              <button 
                onClick={() => handleOpenModal()}
                style={{
                  padding: '9px 18px', background: 'rgba(124, 92, 252, 0.2)', color: '#a78bfa',
                  border: '1px solid rgba(124, 92, 252, 0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                }}
              >
                + Create New Quiz
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '20px' 
            }}>
              {filteredQuizzes.map((quiz) => {
                const qCount = getQuestionCount(quiz.id);
                const timeLimit = getTimeLimit(quiz);

                return (
                  <div 
                    key={quiz.id} 
                    className="admin-glass-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      transition: 'transform 0.2s, border-color 0.2s',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'rgba(124, 92, 252, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    {/* Card Header Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        background: 'rgba(124, 92, 252, 0.15)',
                        border: '1px solid rgba(124, 92, 252, 0.3)',
                        borderRadius: '6px',
                        color: '#c4b5fd',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {quiz.module}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {timeLimit ? (
                          <span style={{ fontSize: '0.8rem', color: '#9aa0b4', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px' }}>
                            {timeLimit} mins
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#64748b', background: 'rgba(255,255,255,0.03)', padding: '3px 8px', borderRadius: '6px' }}>
                            No limit
                          </span>
                        )}
                        {qCount !== null && (
                          <span style={{ fontSize: '0.8rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                            {qCount} {qCount === 1 ? 'Q' : 'Qs'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quiz Title */}
                    <div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                        {quiz.title}
                      </h3>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        Added {new Date(quiz.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <button 
                        onClick={() => handleOpenPreview(quiz)} 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.04)', 
                          border: '1px solid rgba(255, 255, 255, 0.12)', 
                          color: '#e2e8f0', 
                          padding: '7px 12px', 
                          borderRadius: '8px', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview
                      </button>

                      <button 
                        onClick={() => handleOpenModal(quiz)} 
                        style={{ 
                          background: 'rgba(59, 130, 246, 0.1)', 
                          border: '1px solid rgba(59, 130, 246, 0.25)', 
                          color: '#60a5fa', 
                          padding: '7px 12px', 
                          borderRadius: '8px', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>

                      <button 
                        onClick={() => handleDelete(quiz.id)} 
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.08)', 
                          border: '1px solid rgba(239, 68, 68, 0.2)', 
                          color: '#f87171', 
                          padding: '7px 12px', 
                          borderRadius: '8px', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                        title="Delete Quiz"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENT RESULTS & SCORES VIEW */}
      {activeTab === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="admin-glass-card" style={{ padding: '20px' }}>
              <div style={{ color: '#9aa0b4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>TOTAL ATTEMPTS</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{totalAttempts}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Student submissions recorded</div>
            </div>

            <div className="admin-glass-card" style={{ padding: '20px' }}>
              <div style={{ color: '#9aa0b4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>AVERAGE SCORE</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#38bdf8' }}>{avgPercentage}%</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Across all completed tests</div>
            </div>

            <div className="admin-glass-card" style={{ padding: '20px' }}>
              <div style={{ color: '#9aa0b4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>PASSING RATE</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34d399' }}>{passRate}%</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Scored 75% or higher</div>
            </div>

            <div className="admin-glass-card" style={{ padding: '20px' }}>
              <div style={{ color: '#9aa0b4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>ACTIVE QUIZZES</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa' }}>{quizzes.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Available across modules</div>
            </div>
          </div>

          {/* Scores Table */}
          <div className="admin-glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Student Completion Ledger</h3>
              <button 
                onClick={fetchScores}
                disabled={loadingScores}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                {loadingScores ? 'Refreshing...' : 'Refresh Scores'}
              </button>
            </div>

            {loadingScores ? (
              <p style={{ color: '#9aa0b4', textAlign: 'center', padding: '36px' }}>Loading student results...</p>
            ) : filteredScores.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#9aa0b4' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#fff' }}>No student submissions found</p>
                <span style={{ fontSize: '0.88rem' }}>When students complete quizzes from the portal, their results and completion history will appear here.</span>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Module / Quiz</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Status</th>
                      <th>Date Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScores.map((s, idx) => {
                      const max = s.max_score || 1;
                      const percentage = Math.round((s.score / max) * 100);
                      const isPassed = percentage >= 75;
                      const isReview = percentage >= 50 && percentage < 75;

                      return (
                        <tr key={s.id || idx}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'rgba(124, 92, 252, 0.2)', color: '#c4b5fd',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 600, fontSize: '0.8rem'
                              }}>
                                {(s.user_email || 'S')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#fff' }}>{s.user_email || 'Student'}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.user_id ? `${s.user_id.slice(0, 8)}...` : 'Local Student'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{s.quiz_title || s.module || 'Module Quiz'}</div>
                            <span style={{ fontSize: '0.75rem', color: '#9aa0b4' }}>{s.module}</span>
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.95rem' }}>{s.score}</strong>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}> / {s.max_score}</span>
                          </td>
                          <td>
                            <span style={{
                              fontWeight: 700,
                              color: isPassed ? '#34d399' : isReview ? '#fbbf24' : '#f87171'
                            }}>
                              {percentage}%
                            </span>
                          </td>
                          <td>
                            <span className={`admin-status-pill ${isPassed ? 'admin-status-pill--pass' : isReview ? 'admin-status-pill--review' : 'admin-status-pill--fail'}`}>
                              {isPassed ? 'Passed' : isReview ? 'Needs Review' : 'Failed'}
                            </span>
                          </td>
                          <td style={{ color: '#9aa0b4', fontSize: '0.85rem' }}>
                            {s.created_at ? new Date(s.created_at).toLocaleString() : 'Recent'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewQuiz && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'rgba(25, 30, 42, 1)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px', borderRadius: '16px', width: '750px', maxHeight: '85vh', overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ padding: '3px 8px', background: 'rgba(124, 92, 252, 0.2)', color: '#c4b5fd', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {previewQuiz.module}
                </span>
                <h3 style={{ margin: '8px 0 4px', fontSize: '1.4rem' }}>{previewQuiz.title}</h3>
                <span style={{ fontSize: '0.85rem', color: '#9aa0b4' }}>
                  Time Limit: {previewQuiz.time_limit_minutes ? `${previewQuiz.time_limit_minutes} mins` : 'No limit'} • Total Questions: {previewQuiz.questions?.length || 0}
                </span>
              </div>
              <button 
                onClick={() => setPreviewQuiz(null)}
                style={{ background: 'transparent', border: 'none', color: '#9aa0b4', cursor: 'pointer', padding: '6px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {previewQuiz.questions && previewQuiz.questions.length > 0 ? (
                previewQuiz.questions.map((q, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '12px', color: '#fff', fontSize: '0.95rem' }}>
                      <span style={{ color: '#a78bfa', marginRight: '6px' }}>Q{idx + 1}.</span> {q.question_text}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {q.options?.map((opt, oIdx) => {
                        const isCorrect = parseInt(q.correct_option_index, 10) === oIdx;
                        return (
                          <div 
                            key={oIdx} 
                            style={{ 
                              padding: '8px 12px', 
                              borderRadius: '6px', 
                              fontSize: '0.85rem',
                              background: isCorrect ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255,255,255,0.02)',
                              border: isCorrect ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                              color: isCorrect ? '#34d399' : '#cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{opt}</span>
                            {isCorrect && (
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: 'rgba(52, 211, 153, 0.2)', borderRadius: '4px' }}>
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9aa0b4', textAlign: 'center', padding: '32px' }}>No questions configured for this quiz yet.</p>
              )}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button 
                onClick={() => setPreviewQuiz(null)}
                style={{ padding: '8px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'rgba(25, 30, 42, 1)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px', borderRadius: '16px', width: '800px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.5rem' }}>{editingId ? 'Edit Quiz' : 'Create Quiz'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Settings Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9aa0b4', fontSize: '0.9rem' }}>Quiz Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9aa0b4', fontSize: '0.9rem' }}>Module</label>
                  <select name="module" value={formData.module} onChange={handleChange} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                    <option value="Module 1" style={{ color: '#000' }}>Module 1</option>
                    <option value="Module 2" style={{ color: '#000' }}>Module 2</option>
                    <option value="Module 3" style={{ color: '#000' }}>Module 3</option>
                    <option value="Module 4" style={{ color: '#000' }}>Module 4</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9aa0b4', fontSize: '0.9rem' }}>Time Limit (Minutes)</label>
                  <input type="number" name="time_limit_minutes" value={formData.time_limit_minutes} onChange={handleChange} min="0" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} placeholder="0 for no limit" />
                </div>
              </div>

              {/* Questions Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Questions ({questions.length})</h4>
                  <button type="button" onClick={addQuestion} style={{ padding: '6px 14px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.5)', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>+ Add Question</button>
                </div>
                
                {questions.map((q, qIndex) => (
                  <div key={qIndex} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong style={{ color: '#a78bfa' }}>Question {qIndex + 1}</strong>
                      <button type="button" onClick={() => removeQuestion(qIndex)} style={{ background: 'transparent', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                    </div>
                    
                    <textarea 
                      required
                      placeholder="Enter question text..."
                      value={q.question_text}
                      onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', marginBottom: '16px', minHeight: '60px' }}
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`} 
                            checked={parseInt(q.correct_option_index) === oIndex} 
                            onChange={() => updateQuestion(qIndex, 'correct_option_index', oIndex)}
                            required
                            title="Select as correct option"
                          />
                          <input 
                            required
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.2)', border: parseInt(q.correct_option_index) === oIndex ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {questions.length === 0 && <p style={{ color: '#9aa0b4', textAlign: 'center', padding: '24px' }}>No questions added yet. Click "+ Add Question" above.</p>}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #7c5cfc, #3b82f6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  {editingId ? 'Save Quiz' : 'Create Quiz'}
                </button>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '14px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes;
