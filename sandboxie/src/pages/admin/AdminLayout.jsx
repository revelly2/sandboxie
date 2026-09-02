import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Sandboxie Admin</h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/tutorials" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Tutorials
          </NavLink>
          <NavLink to="/admin/quizzes" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Quizzes
          </NavLink>
          <NavLink to="/admin/simulations" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Simulations
          </NavLink>
        </nav>
        <div className="admin-footer-nav">
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="admin-back-btn" onClick={() => navigate('/')}>
            Back to App
          </button>
        </div>
      </aside>
      
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>Admin Panel</h1>
          </div>
          <div className="admin-header-user">
            <span>{user?.email}</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
