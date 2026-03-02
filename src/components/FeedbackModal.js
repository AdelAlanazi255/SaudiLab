import React, { useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from '@site/src/utils/supabaseClient';

export default function FeedbackModal({ open, onClose, userEmail = '', userId = null }) {
  const [category, setCategory] = useState('Bug');
  const [email, setEmail] = useState(userEmail || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setCategory('Bug');
    setEmail(userEmail || '');
    setMessage('');
    setMsg('');
    setLoading(false);
  }, [open, userEmail]);

  const canSubmit = useMemo(
    () => !loading && message.trim().length > 0,
    [loading, message],
  );

  if (!open) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && !loading) onClose();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setMsg('');
    if (!message.trim()) {
      setMsg('Message is required.');
      return;
    }

    if (!supabase || !hasSupabaseConfig) {
      setMsg('Supabase is not configured.');
      return;
    }

    if (!userId) {
      setMsg('Please login to submit feedback.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: userId,
        email: email.trim() || null,
        category,
        message: message.trim(),
        page_url: typeof window !== 'undefined' ? window.location.pathname : null,
      };

      const { error } = await supabase.from('feedback').insert([payload]);
      if (error) throw error;

      setMsg('Thanks for the feedback.');
      window.setTimeout(() => {
        onClose();
      }, 650);
    } catch (error) {
      setMsg(error?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sl-modalBackdrop" onMouseDown={onBackdrop}>
      <div className="sl-modal" role="dialog" aria-modal="true" aria-label="Give Feedback">
        <div className="sl-modalHead">
          <div>
            <div className="sl-modalTitle">Give Feedback</div>
            <div className="sl-modalMsg">Share bugs, ideas, or content suggestions.</div>
          </div>
          <button onClick={onClose} className="sl-modalX" aria-label="Close" disabled={loading}>
            x
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: '0.9rem' }}>
          <label htmlFor="feedback-category" className="sl-feedbackLabel">
            Category
          </label>
          <select
            id="feedback-category"
            className="sl-feedbackInput"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="Bug">Bug</option>
            <option value="Idea">Idea</option>
            <option value="Content">Content</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="feedback-email" className="sl-feedbackLabel">
            Email (optional)
          </label>
          <input
            id="feedback-email"
            className="sl-feedbackInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <label htmlFor="feedback-message" className="sl-feedbackLabel">
            Message
          </label>
          <textarea
            id="feedback-message"
            className="sl-feedbackInput sl-feedbackTextarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            required
          />

          {msg ? <div className="sl-feedbackMsg">{msg}</div> : null}

          <div className="sl-modalActions">
            <button type="button" onClick={onClose} className="sl-btn-ghost" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="sl-btn-primary" disabled={!canSubmit}>
              {loading ? 'Sending...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
