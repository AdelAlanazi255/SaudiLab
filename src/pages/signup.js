import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { hasSupabaseConfig, supabase } from '@site/src/utils/supabaseClient';

export default function SignUp() {
  const [username, setUsername] = useState('');
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

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim() || null,
          },
        },
      });

      if (error) throw error;

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

  const onGoogle = async () => {
    if (!supabase || !hasSupabaseConfig) {
      setMsg('Google login is not configured.');
      return;
    }
    setMsg('');
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) setMsg(error.message);
  };

  return (
    <Layout title="Sign Up">
      <div style={{ padding: '4rem 1.5rem', maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontWeight: 900 }}>Sign Up</h1>

        <form onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={inputStyle} disabled={loading} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} disabled={loading} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)" type="password" style={inputStyle} disabled={loading} />

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>

          <button type="button" onClick={onGoogle} style={oauthBtnStyle}>
            Continue with Google
          </button>

          {msg ? (
            <div style={{ marginTop: '1rem', color: '#ff8a8a', fontWeight: 700 }}>
              {msg}
            </div>
          ) : null}
        </form>
      </div>
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

const oauthBtnStyle = {
  width: '100%',
  padding: '0.95rem 1rem',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 900,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.92)',
  marginTop: '0.75rem',
};
