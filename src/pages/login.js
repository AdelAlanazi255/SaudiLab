import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { getSupabaseConfigStatus, supabase } from '@site/src/utils/supabaseClient';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';
import OAuthButtons from '@site/src/components/auth/OAuthButtons';
import { getNextPathFromSearch } from '@site/src/utils/nextPath';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const supabaseConfig = getSupabaseConfigStatus();
  const supabaseMissingMsg = `Supabase is not configured. Missing: ${supabaseConfig.missing.join(', ')}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('verify') !== '1') return;

    setVerifyModalOpen(true);
    url.searchParams.delete('verify');
    const nextSearch = url.searchParams.toString();
    const nextPath = `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash || ''}`;
    window.history.replaceState({}, '', nextPath || '/login');
  }, []);

  const resolveNextPath = () => {
    if (typeof window === 'undefined') return '/';
    return getNextPathFromSearch(window.location.search || '', '/');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (!supabase || !supabaseConfig.ok) {
        setMsg(supabaseMissingMsg);
        return;
      }

      const emailTrimmed = email.trim().toLowerCase();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailTrimmed) {
        setMsg('Email is required.');
        return;
      }
      if (!emailPattern.test(emailTrimmed)) {
        setMsg('Enter a valid email address.');
        return;
      }
      if (!password) {
        setMsg('Password is required.');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password,
      });

      if (error) throw error;
      window.location.href = resolveNextPath();
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <Layout title="Login">
      <PageContainer size="narrow">
        <Section className="sl-auth-section">
          <h1 style={{ fontWeight: 900, margin: 0 }}>Login</h1>

          <form onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
            <OAuthButtons
              disabled={!supabaseConfig.ok}
              nextPath={resolveNextPath()}
              onError={(nextMsg) => {
                if (nextMsg || !supabaseConfig.ok) setMsg(nextMsg || supabaseMissingMsg);
              }}
            />

            <div style={dividerWrapStyle} aria-hidden="true">
              <span style={dividerLineStyle} />
              <span style={dividerTextStyle}>or</span>
              <span style={dividerLineStyle} />
            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              aria-label="Email"
              style={inputStyle}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              aria-label="Password"
              style={inputStyle}
            />

            <button type="submit" style={btnStyle}>
              Login
            </button>

            {!supabaseConfig.ok ? (
              <div style={{ marginTop: '0.85rem', color: '#ffb0b0', fontWeight: 700 }}>
                {supabaseMissingMsg}
              </div>
            ) : null}

            {msg ? (
              <div style={{ marginTop: '1rem', color: '#ff8a8a', fontWeight: 700 }}>
                {msg}
              </div>
            ) : null}
          </form>
        </Section>
      </PageContainer>
      <VerifyNoticeModal open={verifyModalOpen} onClose={() => setVerifyModalOpen(false)} />
    </Layout>
  );
}

function VerifyNoticeModal({ open, onClose }) {
  useEffect(() => {
    if (!open || typeof window === 'undefined') return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const onBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="sl-modalBackdrop" onMouseDown={onBackdrop}>
      <div className="sl-modal" role="dialog" aria-modal="true" aria-labelledby="sl-verify-title">
        <div className="sl-modalHead">
          <div>
            <div id="sl-verify-title" className="sl-modalTitle">Email verification</div>
            <div className="sl-modalMsg">Please verify your email before logging in</div>
          </div>
          <button onClick={onClose} className="sl-modalX" aria-label="Close">
            x
          </button>
        </div>

        <div className="sl-modalActions">
          <button onClick={onClose} className="sl-btn-primary">Close</button>
        </div>
      </div>
    </div>
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

const dividerWrapStyle = {
  margin: '18px 0',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const dividerLineStyle = {
  flex: 1,
  height: 1,
  background: 'rgba(255,255,255,0.18)',
};

const dividerTextStyle = {
  color: 'rgba(255,255,255,0.72)',
  fontSize: 13,
  fontWeight: 700,
  textTransform: 'lowercase',
};
