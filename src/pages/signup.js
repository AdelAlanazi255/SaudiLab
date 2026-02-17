import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { api, setToken } from '../utils/auth';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <Layout title="Sign Up">
      <div style={{ padding: '4rem 1.5rem', maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontWeight: 900 }}>Sign Up</h1>

        <form onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={inputStyle} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)" type="password" style={inputStyle} />

          <button type="submit" style={btnStyle}>
            Create account
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
