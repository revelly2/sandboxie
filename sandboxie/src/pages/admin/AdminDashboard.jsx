import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ margin: 0, fontWeight: 600 }}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        
        <div className="admin-glass-card">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9aa0b4' }}>Total Students</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>24</p>
        </div>

        <div className="admin-glass-card">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9aa0b4' }}>Active Tutorials</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#a78bfa' }}>4</p>
        </div>

        <div className="admin-glass-card">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9aa0b4' }}>Total Quizzes</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#34d399' }}>12</p>
        </div>

      </div>

      <div className="admin-glass-card" style={{ marginTop: '16px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Recent Activity</h3>
        <p style={{ color: '#9aa0b4' }}>No recent activity to show.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
