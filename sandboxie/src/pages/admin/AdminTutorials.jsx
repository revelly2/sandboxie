import React from 'react';

const AdminTutorials = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600 }}>Manage Tutorials</h2>
        <button style={{
          padding: '10px 20px', background: '#7c5cfc', color: '#fff', 
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
        }}>
          + Add New Tutorial
        </button>
      </div>
      
      <div className="admin-glass-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', color: '#9aa0b4' }}>Title</th>
              <th style={{ padding: '12px', color: '#9aa0b4' }}>Module</th>
              <th style={{ padding: '12px', color: '#9aa0b4' }}>Status</th>
              <th style={{ padding: '12px', color: '#9aa0b4' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '16px 12px' }}>Introduction to Variables</td>
              <td style={{ padding: '16px 12px' }}>Module 1</td>
              <td style={{ padding: '16px 12px' }}><span style={{ padding: '4px 8px', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', borderRadius: '4px', fontSize: '0.85rem' }}>Published</span></td>
              <td style={{ padding: '16px 12px' }}>
                <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
              </td>
            </tr>
            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '16px 12px' }}>Loops and Logic</td>
              <td style={{ padding: '16px 12px' }}>Module 2</td>
              <td style={{ padding: '16px 12px' }}><span style={{ padding: '4px 8px', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', borderRadius: '4px', fontSize: '0.85rem' }}>Published</span></td>
              <td style={{ padding: '16px 12px' }}>
                <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTutorials;
