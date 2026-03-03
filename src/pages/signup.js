import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { hasSupabaseConfig, supabase } from '@site/src/utils/supabaseClient';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';
import OAuthButtons from '@site/src/components/auth/OAuthButtons';

export default function SignUp() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMsg('');
    setLoading(true);
    try {
      if (!supabase || !hasSupabaseConfig) {
        setMsg('Supabase is not configured.');
        return;
      }

      const emailTrimmed = email.trim().toLowerCase();
      const nicknameTrimmed = nickname.trim();
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

      const { data, error } = await supabase.auth.signUp({
        email: emailTrimmed,
        password,
        options: {
          data: {
            username: nicknameTrimmed || null,
            display_name: nicknameTrimmed || null,
          },
        },
      });

      if (error) throw error;

      if (data?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: data.user.id,
              username: nicknameTrimmed || null,
              email: emailTrimmed,
            },
            { onConflict: 'id' },
          );

        if (profileError && data?.session) {
          throw profileError;
        }
      }

      if (!data?.session) {
        setMsg('Check your email to confirm your account.');
        return;
      }

      window.location.href = '/';
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err?.message || String(err));
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign Up">
      <PageContainer size="narrow">
        <Section className="sl-auth-section">
          <h1 style={{ fontWeight: 900, margin: 0 }}>Sign Up</h1>

          <form onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
            <OAuthButtons
              disabled={!hasSupabaseConfig}
              onError={(nextMsg) => {
                if (nextMsg || !hasSupabaseConfig) setMsg(nextMsg || 'OAuth login is not configured.');
              }}
            />

            <div style={dividerWrapStyle} aria-hidden="true">
              <span style={dividerLineStyle} />
              <span style={dividerTextStyle}>or</span>
              <span style={dividerLineStyle} />
            </div>

            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="First name / Nickname"
              aria-label="First name / Nickname"
              style={inputStyle}
              disabled={loading}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              aria-label="Email"
              style={inputStyle}
              disabled={loading}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 chars)"
              type="password"
              aria-label="Password"
              style={inputStyle}
              disabled={loading}
            />

            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>

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
