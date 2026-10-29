import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    tutorials: 0,
    quizzes: 0
  });
  const [studentsList, setStudentsList] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch counts and profiles
      const [
        { count: tutorialsCount },
        { count: quizzesCount },
        { data: progressData },
        { data: profilesData, error: profilesError }
      ] = await Promise.all([
        supabase.from('tutorials').select('*', { count: 'exact', head: true }),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }),
        supabase.from('user_progress').select('user_id'),
        supabase.from('profiles').select('*').order('created_at', { ascending: false })
      ]);

      const profilesMap = {};
      let totalStudentsCount = 0;

      if (!profilesError && profilesData) {
        // Exclude admins from student roster/count
        const studentsOnly = profilesData.filter(
          p => p.role !== 'admin' && p.email !== 'ced_admin@gmail.com' && p.email !== 'admin@sandboxie.com'
        );
        totalStudentsCount = studentsOnly.length;
        setStudentsList(studentsOnly);
        profilesData.forEach(p => {
          profilesMap[p.id] = p;
        });
        setNeedsSetup(false);
      } else {
        // Fallback to unique users from user_progress
        const uniqueStudents = new Set(progressData?.map(p => p.user_id) || []).size;
        totalStudentsCount = uniqueStudents;
        setNeedsSetup(true);
      }

      setStats({
        students: totalStudentsCount,
        tutorials: tutorialsCount || 0,
        quizzes: quizzesCount || 0
      });

      // Fetch recent activity
      const { data: recent } = await supabase
        .from('user_progress')
        .select('module_id, status, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(6);
        
      const enrichedRecent = (recent || []).map(act => {
        const student = profilesMap[act.user_id];
        return {
          ...act,
          studentIdentifier: student?.full_name || student?.email || `Student (${act.user_id?.slice(0, 8)}...)`
        };
      });

      setRecentActivity(enrichedRecent);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const filteredStudents = studentsList.filter(s => 
    (s.full_name && s.full_name.toLowerCase().includes(searchStudent.toLowerCase())) ||
    (s.email && s.email.toLowerCase().includes(searchStudent.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ margin: 0, fontWeight: 600 }}>Overview</h2>
      
      {needsSetup && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <strong style={{ color: '#facc15' }}>Profiles Table Not Yet Synced</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
            Total Students currently counts only users with recorded module progress (2 active). To detect and list all registered users automatically from Supabase Auth, run the provided SQL setup script in your Supabase SQL Editor.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
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
      </div>

      {/* Registered Students Roster */}
      {studentsList.length > 0 && (
        <div className="admin-glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Registered Students ({studentsList.length})</h3>
            <input
              type="text"
              placeholder="Search student name or email..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              style={{
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                minWidth: '240px'
              }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9aa0b4' }}>
                  <th style={{ padding: '12px 16px' }}>Student</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Role</th>
                  <th style={{ padding: '12px 16px' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr key={st.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c5cfc, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {(st.full_name || st.email || 'S')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{st.full_name || 'No Name'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#9aa0b4' }}>{st.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: 'rgba(124, 92, 252, 0.15)',
                        color: '#a78bfa',
                        textTransform: 'uppercase'
                      }}>
                        {st.role || 'student'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#9aa0b4' }}>
                      {st.created_at ? new Date(st.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="admin-glass-card" style={{ marginTop: '8px' }}>
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
                <span>
                  <strong>{act.studentIdentifier}</strong> marked <strong>Module {act.module_id}</strong> as {act.status}
                </span>
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
