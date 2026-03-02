import React, { useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from '@site/src/utils/supabaseClient';

export default function FeedbackModal({ open, onClose, userEmail = '', userId = null }) {
  const [email, setEmail] = useState(userEmail || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (!open) {
      setEmail('');
      setMessage('');
      setMsg('');
      setLoading(false);
      setEmailError('');
      return;
    }

    setEmail(userEmail || '');
    setMessage('');
    setMsg('');
    setLoading(false);
    setEmailError('');
  }, [open, userEmail]);

  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  const isEmailValid = useMemo(() => {
    const at = trimmedEmail.indexOf('@');
    const dot = trimmedEmail.lastIndexOf('.');
    return at > 0 && dot > at + 1 && dot < trimmedEmail.length - 1;
  }, [trimmedEmail]);

  const canSubmit = useMemo(
    () =>
      !loading &&
      trimmedEmail.length > 0 &&
      trimmedMessage.length > 0 &&
      isEmailValid,
    [loading, trimmedEmail, trimmedMessage, isEmailValid],
  );
  const liveEmailFormatError =
    trimmedEmail.length > 0 && !isEmailValid ? 'Enter a valid email address.' : '';
  const visibleEmailError = emailError || liveEmailFormatError;

  if (!open) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && !loading) onClose();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setMsg('');
    if (!trimmedEmail) {
      setEmailError('Email is required.');
      return;
    }

    if (!isEmailValid) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setEmailError('');

    if (!trimmedMessage) {
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
        email: trimmedEmail,
        message: trimmedMessage,
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
          <label htmlFor="feedback-email" className="sl-feedbackLabel">
            Email
            <span className="sl-feedbackRequired">*</span>
          </label>
          <input
            id="feedback-email"
            className="sl-feedbackInput"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) {
                const nextTrimmedEmail = e.target.value.trim();
                const at = nextTrimmedEmail.indexOf('@');
                const dot = nextTrimmedEmail.lastIndexOf('.');
                if (nextTrimmedEmail && at > 0 && dot > at + 1 && dot < nextTrimmedEmail.length - 1) {
                  setEmailError('');
                }
              }
            }}
            disabled={loading}
            required
          />
          {visibleEmailError ? <div className="sl-feedbackFieldError">{visibleEmailError}</div> : null}

          <label htmlFor="feedback-message" className="sl-feedbackLabel">
            Message
            <span className="sl-feedbackRequired">*</span>
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
            <button
              type="submit"
              className="sl-btn-primary"
              disabled={!canSubmit}
              style={!canSubmit ? { opacity: 0.62, cursor: 'not-allowed' } : undefined}
            >
              {loading ? 'Sending...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
