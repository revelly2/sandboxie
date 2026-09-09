import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    tutorials: 0,
    quizzes: 0,
    simulations: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch counts
      const [
        { count: tutorialsCount },
        { count: quizzesCount },
        { count: simulationsCount },
        { data: progressData }
      ] = await Promise.all([
        supabase.from('tutorials').select('*', { count: 'exact', head: true }),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }),
        supabase.from('simulations').select('*', { count: 'exact', head: true }),
        supabase.from('user_progress').select('user_id')
      ]);

      // Calculate unique students
      const uniqueStudents = new Set(progressData?.map(p => p.user_id) || []).size;

      setStats({
        students: uniqueStudents,
        tutorials: tutorialsCount || 0,
        quizzes: quizzesCount || 0,
        simulations: simulationsCount || 0
      });

      // Fetch recent activity
      const { data: recent } = await supabase
        .from('user_progress')
        .select('module_id, status, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(5);
        
      setRecentActivity(recent || []);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ margin: 0, fontWeight: 600 }}>Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <div className="admin-glass-card">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9aa0b4' }}>Total Students</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{loading ? '-' : stats.students}</p>
        </div>

        <div className="admin-glass-card">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9aa0b4' }}>Active Tutorials</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#a78bfa' }}>{loading ? '-' : stats.tutorials}</p>
        </div>

        <div className="admin-glass-card">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9aa0b4' }}>Total Quizzes</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#34d399' }}>{loading ? '-' : stats.quizzes}</p>
        </div>

        <div className="admin-glass-card">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9aa0b4' }}>Simulations</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#f59e0b' }}>{loading ? '-' : stats.simulations}</p>
        </div>
      </div>

      <div className="admin-glass-card" style={{ marginTop: '16px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Recent Activity</h3>
        {loading ? (
          <p style={{ color: '#9aa0b4' }}>Loading activity...</p>
        ) : recentActivity.length === 0 ? (
          <p style={{ color: '#9aa0b4' }}>No recent activity to show.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((act, i) => (
              <li key={i} style={{ 
                padding: '12px', background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span>A student marked <strong>Module {act.module_id}</strong> as {act.status}</span>
                <span style={{ color: '#9aa0b4', fontSize: '0.85rem' }}>
                  {new Date(act.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
