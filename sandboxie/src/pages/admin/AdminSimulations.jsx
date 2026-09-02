import React from 'react';

const AdminSimulations = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(109, 40, 217, 0.2))',
        border: '1px solid rgba(167, 139, 250, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      </div>
      <h2 style={{ margin: 0, fontWeight: 600, fontSize: '1.8rem' }}>Simulations Management</h2>
      <p style={{ color: '#9aa0b4', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6' }}>
        This section is currently empty. Future updates will allow you to build, manage, and monitor interactive simulations for the students.
      </p>
      
      <button style={{
        padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', 
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 600,
        marginTop: '16px'
      }} disabled>
        Coming Soon
      </button>
    </div>
  );
};

export default AdminSimulations;
