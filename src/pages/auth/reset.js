import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { getSupabaseConfigStatus, supabase } from '@site/src/utils/supabaseClient';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';

export default function AuthReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', text: 'Preparing password reset...' });
  const [submitting, setSubmitting] = useState(false);
  const supabaseConfig = getSupabaseConfigStatus();

  useEffect(() => {
    const bootstrap = async () => {
      if (!supabase || !supabaseConfig.ok) {
        setStatus({ type: 'error', text: 'Supabase is not configured.' });
        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const hasCode = params.has('code');
        if (hasCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) {
            setStatus({ type: 'error', text: error.message || 'Reset link is invalid or expired.' });
            return;
          }
        }

        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          setStatus({ type: 'error', text: 'Open the reset link from your email to continue.' });
          return;
        }

        setStatus({ type: '', text: '' });
      } catch {
        setStatus({ type: 'error', text: 'Could not initialize password reset.' });
      }
    };

    bootstrap();
  }, [supabaseConfig.ok]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!supabase || !supabaseConfig.ok) {
      setStatus({ type: 'error', text: 'Supabase is not configured.' });
      return;
    }

    const nextPassword = password.trim();
    if (nextPassword.length < 8) {
      setStatus({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (nextPassword !== confirmPassword.trim()) {
      setStatus({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: nextPassword });
    setSubmitting(false);

    if (error) {
      setStatus({ type: 'error', text: error.message || 'Could not update password.' });
      return;
    }

    setStatus({ type: 'success', text: 'Password updated. Redirecting to account...' });
    setTimeout(() => {
      window.location.href = '/account';
    }, 900);
  };

  return (
    <Layout title="Reset Password">
      <PageContainer size="narrow">
        <Section className="sl-auth-section">
          <h1 style={{ fontWeight: 900, margin: 0 }}>Reset Password</h1>

          <form onSubmit={onSubmit} style={{ marginTop: '1.4rem' }}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              type="password"
              style={inputStyle}
              disabled={submitting}
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              type="password"
              style={inputStyle}
              disabled={submitting}
            />
            <button type="submit" style={btnStyle} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update password'}
            </button>

            {status.text ? (
              <div
                style={{
                  marginTop: '0.95rem',
                  fontWeight: 700,
                  color: status.type === 'error' ? '#ff9898' : status.type === 'success' ? '#8df0b8' : 'rgba(255,255,255,0.84)',
                }}
              >
                {status.text}
              </div>
            ) : null}
          </form>
        </Section>
      </PageContainer>
    </Layout>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.9rem 1rem',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(0,0,0,0.35)',
  color: 'white',
  marginBottom: '0.9rem',
  outline: 'none',
};

const btnStyle = {
  width: '100%',
  padding: '0.95rem 1rem',
  borderRadius: 14,
  border: 'none',
  fontWeight: 900,
  cursor: 'pointer',
  background: '#7cf2b0',
  color: '#0b0f14',
};
