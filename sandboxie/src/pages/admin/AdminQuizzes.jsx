import React from 'react';

const AdminQuizzes = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600 }}>Manage Quizzes</h2>
        <button style={{
          padding: '10px 20px', background: '#3b82f6', color: '#fff', 
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
        }}>
          + Create Quiz
        </button>
      </div>
      
      <div className="admin-glass-card">
        <p style={{ color: '#9aa0b4' }}>Select a module to manage its quizzes.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {[1, 2, 3, 4].map((mod) => (
            <div key={mod} style={{
              padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            >
              <h3 style={{ margin: '0 0 8px 0' }}>Module {mod}</h3>
              <span style={{ fontSize: '0.85rem', color: '#9aa0b4' }}>10 Questions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminQuizzes;
