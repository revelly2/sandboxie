import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const toast = useMemo(() => ({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        top: 'calc(var(--nav-height) + 12px)',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
        maxWidth: '380px',
        width: '100%',
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: "'Space Grotesk', sans-serif",
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              animation: 'toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              ...(t.type === 'success' && {
                background: 'rgba(63,190,138,0.15)',
                border: '1px solid rgba(63,190,138,0.3)',
                color: '#6ee7b7',
              }),
              ...(t.type === 'error' && {
                background: 'rgba(248,113,113,0.15)',
                border: '1px solid rgba(248,113,113,0.3)',
                color: '#f87171',
              }),
              ...(t.type === 'info' && {
                background: 'rgba(124,92,252,0.15)',
                border: '1px solid rgba(124,92,252,0.3)',
                color: '#9d82fd',
              }),
              ...(t.type === 'warning' && {
                background: 'rgba(224,154,63,0.15)',
                border: '1px solid rgba(224,154,63,0.3)',
                color: '#fbbf24',
              }),
            }}
          >
            <span style={{ fontSize: '16px' }}>
              {t.type === 'success' && '✓'}
              {t.type === 'error' && '✕'}
              {t.type === 'info' && 'ℹ'}
              {t.type === 'warning' && '⚠'}
            </span>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
