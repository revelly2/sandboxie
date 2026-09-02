import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0d0f14', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid rgba(124,92,252,0.2)',
          borderTopColor: '#7c5cfc', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ color: '#9aa0b4', fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif' }}>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TODO: Implement actual admin check here based on your database setup
  // For example: if (user.user_metadata?.role !== 'admin' && user.email !== 'admin@sandboxie.com') { return <Navigate to="/" replace />; }

  return children;
};

export default AdminRoute;
