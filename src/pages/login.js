import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { getSupabaseConfigStatus, supabase } from '@site/src/utils/supabaseClient';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';
import OAuthButtons from '@site/src/components/auth/OAuthButtons';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const supabaseConfig = getSupabaseConfigStatus();
  const supabaseMissingMsg = `Supabase is not configured. Missing: ${supabaseConfig.missing.join(', ')}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (!supabase || !supabaseConfig.ok) {
        setMsg(supabaseMissingMsg);
        return;
      }

      const identifier = usernameOrEmail.trim();
      if (!identifier.includes('@')) {
        setMsg('Use email for password login (username login not supported yet).');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      if (error) throw error;
      window.location.href = '/';
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
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Username or Email"
              style={inputStyle}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
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
