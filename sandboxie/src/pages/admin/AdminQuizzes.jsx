import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();
  
  const [formData, setFormData] = useState({ 
    title: '', 
    module: 'Module 1',
    time_limit_minutes: 0,
    is_shuffled: false
  });
  
  const [questions, setQuestions] = useState([]);

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

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleOpenModal = async (quiz = null) => {
    if (quiz) {
      setEditingId(quiz.id);
      setFormData({ 
        title: quiz.title, 
        module: quiz.module,
        time_limit_minutes: quiz.time_limit_minutes || 0,
        is_shuffled: quiz.is_shuffled || false
      });
      // Fetch questions for this quiz
      const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id).order('created_at', { ascending: true });
      if (data) setQuestions(data);
    } else {
      setEditingId(null);
      setFormData({ title: '', module: 'Module 1', time_limit_minutes: 0, is_shuffled: false });
      setQuestions([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

    if (editingId) {
      const { error } = await supabase.from('quizzes').update(formData).eq('id', editingId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { data, error } = await supabase.from('quizzes').insert([formData]).select().single();
      if (error) { toast.error(error.message); return; }
      quizId = data.id;
    }

    // Replace questions
    if (quizId) {
      // Delete old questions
      await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);
      
      // Insert new questions
      if (questions.length > 0) {
        const questionsToInsert = questions.map(q => ({
          quiz_id: quizId,
          question_text: q.question_text,
          options: q.options,
          correct_option_index: parseInt(q.correct_option_index, 10)
        }));
        const { error: qError } = await supabase.from('quiz_questions').insert(questionsToInsert);
        if (qError) { toast.error('Failed to save questions: ' + qError.message); return; }
      }
    }

    toast.success(editingId ? 'Quiz updated!' : 'Quiz created!');
    fetchQuizzes();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) toast.error(error.message);
      else { toast.success('Quiz deleted!'); fetchQuizzes(); }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600 }}>Manage Quizzes</h2>
        <button 
          onClick={() => handleOpenModal()}
          style={{
            padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', 
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
          + Create Quiz
        </button>
      </div>
      
      <div className="admin-glass-card">
        {loading ? (
          <p style={{ color: '#9aa0b4' }}>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
           <p style={{ color: '#9aa0b4' }}>No quizzes found. Create one to get started.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {quizzes.map((quiz) => (
              <div key={quiz.id} style={{
                padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>{quiz.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#9aa0b4' }}>{quiz.module}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>⏳ Time Limit: {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} mins` : 'None'}</span>
                  <span>🔀 Shuffled: {quiz.is_shuffled ? 'Yes' : 'No'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'auto', paddingTop: '12px' }}>
                  <button onClick={() => handleOpenModal(quiz)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Edit</button>
                  <button onClick={() => handleDelete(quiz.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(25, 30, 42, 1)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px', borderRadius: '16px', width: '800px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.5rem' }}>{editingId ? 'Edit Quiz' : 'Create Quiz'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Settings Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff' }}>
                    <input type="checkbox" name="is_shuffled" checked={formData.is_shuffled} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                    Shuffle Question Order
                  </label>
                </div>
              </div>

              {/* Questions Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Questions</h4>
                  <button type="button" onClick={addQuestion} style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.5)', borderRadius: '6px', cursor: 'pointer' }}>+ Add Question</button>
                </div>
                
                {questions.map((q, qIndex) => (
                  <div key={qIndex} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong style={{ color: '#9aa0b4' }}>Question {qIndex + 1}</strong>
                      <button type="button" onClick={() => removeQuestion(qIndex)} style={{ background: 'transparent', color: '#f87171', border: 'none', cursor: 'pointer' }}>Remove</button>
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
                {questions.length === 0 && <p style={{ color: '#9aa0b4', textAlign: 'center', padding: '24px' }}>No questions added yet.</p>}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{ flex: 1, padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
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
