import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

const FeedbackForm = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || rating === 0) return;
    
    setLoading(true);
    const { error } = await supabase.from('user_feedback').insert({
      user_id: user.id,
      rating,
      comment,
      created_at: new Date().toISOString()
    });

    if (error) {
      toast.error(lang === 'il' ? 'Adda napasamak a biddut' : 'Something went wrong');
    } else {
      setSubmitted(true);
      toast.success(lang === 'il' ? 'Agyaman iti feedback mo!' : 'Thank you for your feedback!');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={{
        padding: '32px', borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {lang === 'il' ? 'Agyaman!' : 'Thank you!'}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {lang === 'il' ? 'Naidulin ti feedback mo.' : 'Your feedback has been recorded.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '28px', borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-card)', border: '1px solid var(--border-subtle)'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {lang === 'il' ? 'I-Rate ti App' : 'Rate this App'}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        {lang === 'il' 
          ? 'Tulongannak a mapasayaat daytoy nga app babaen ti feedback mo.' 
          : 'Help us improve this app with your feedback.'}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '28px', padding: '2px',
                transition: 'transform 0.15s',
                transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)',
                filter: (hoverRating || rating) >= star ? 'none' : 'grayscale(1) opacity(0.3)',
              }}
              aria-label={`Rate ${star} stars`}
            >
              ⭐
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={lang === 'il' 
            ? 'Isurat ti komentom ditoy (opsyonal)...' 
            : 'Write your comment here (optional)...'}
          rows={3}
          style={{
            width: '100%', padding: '12px 16px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
            fontFamily: 'inherit', fontSize: '14px', resize: 'vertical',
            transition: 'border-color 0.2s',
            outline: 'none', marginBottom: '16px'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
        />

        <button
          type="submit"
          disabled={rating === 0 || loading}
          className="auth-submit-btn"
          style={{ 
            maxWidth: '200px', opacity: rating === 0 ? 0.5 : 1,
            cursor: rating === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {loading 
            ? (lang === 'il' ? 'Agipatpatulod...' : 'Submitting...') 
            : (lang === 'il' ? 'Ipatulod' : 'Submit Feedback')}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
