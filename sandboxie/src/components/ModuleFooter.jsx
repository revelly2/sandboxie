import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { fireConfetti } from '../lib/confetti';

const TOTAL_MODULES = 4;

const ModuleFooter = ({ moduleId }) => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchStatus = async () => {
        const { data, error } = await supabase
          .from('user_progress')
          .select('status')
          .eq('user_id', user.id)
          .eq('module_id', moduleId)
          .maybeSingle();
        
        if (error) {
          console.error('Failed to fetch progress:', error);
          return;
        }
          
        if (data && data.status === 'completed') {
          setIsCompleted(true);
        }
      };
      fetchStatus();
    }
  }, [moduleId, user]);

  const toggleComplete = async () => {
    if (!user) return;
    
    const newStatus = isCompleted ? 'not_started' : 'completed';
    setIsCompleted(!isCompleted);
    
    const { error } = await supabase.from('user_progress').upsert({
      user_id: user.id,
      module_id: moduleId,
      status: newStatus,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,module_id' });

    if (error) {
      // Revert on failure
      setIsCompleted(isCompleted);
      toast.error(lang === 'il' ? 'Adda napasamak a biddut' : 'Something went wrong');
      return;
    }

    if (newStatus === 'completed') {
      fireConfetti();
      toast.success(
        lang === 'il' 
          ? `Modul ${moduleId} — Nalpas! 🎉` 
          : `Module ${moduleId} — Completed! 🎉`
      );
    } else {
      toast.info(
        lang === 'il' 
          ? `Modul ${moduleId} — Naikkat ti marka` 
          : `Module ${moduleId} — Unmarked`
      );
    }
  };

  const hasPrev = moduleId > 1;
  const hasNext = moduleId < TOTAL_MODULES;

  return (
    <div className="module-footer-actions" style={{ flexDirection: 'column', gap: '20px' }}>
      {/* Mark Complete */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <button
          className={`btn-mark-complete ${isCompleted ? 'is-done' : ''}`}
          onClick={toggleComplete}
          style={{ padding: '12px 24px', fontSize: '15px' }}
        >
          {isCompleted 
            ? (lang === 'il' ? '✓ Nalpas' : '✓ Completed') 
            : (lang === 'il' ? 'Markaan a Nalpas' : 'Mark as Completed')}
        </button>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
        <button className="btn-back-dashboard" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {lang === 'il' ? 'Agsubli' : 'Back'}
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {hasPrev && (
            <button 
              className="btn-back-dashboard" 
              onClick={() => navigate(`/module/${moduleId - 1}`)}
              title={lang === 'il' ? `Modul ${moduleId - 1}` : `Module ${moduleId - 1}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              {lang === 'il' ? `Modul ${moduleId - 1}` : `Module ${moduleId - 1}`}
            </button>
          )}
          {hasNext && (
            <button 
              className="btn-open-module" 
              onClick={() => navigate(`/module/${moduleId + 1}`)}
              title={lang === 'il' ? `Modul ${moduleId + 1}` : `Module ${moduleId + 1}`}
            >
              {lang === 'il' ? `Modul ${moduleId + 1}` : `Module ${moduleId + 1}`}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleFooter;
