import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import { api } from '@site/src/utils/auth';

export default function Checkout() {
  const auth = useAuth();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth || auth.loading) return;
    if (!auth.isLoggedIn) window.location.href = '/login';
  }, [auth]);

  const pay = async () => {
    setMsg('');
    setLoading(true);

    try {
      if (!auth || auth.loading) throw new Error('Auth not ready yet');
      if (!auth.isLoggedIn) throw new Error('You must be logged in');

      const out = await api('/billing/moyasar/hosted', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      if (!out?.transactionUrl) throw new Error('No checkout URL returned from server');
      window.location.href = out.transactionUrl;
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Checkout">
      <div style={wrap}>
        <div style={card}>
          <div style={topRow}>
            <div>
              <div style={kicker}>Checkout</div>
              <h1 style={title}>SaudiLab Pro</h1>
              <p style={sub}>
                Full access to all lessons and future course updates.
              </p>
            </div>

            <div style={priceBox}>
              <div style={price}>﷼14.99</div>
              <div style={per}>per month</div>
            </div>
          </div>

          <div style={divider} />

          <ul style={list}>
            <li style={li}>✅ Full HTML course access</li>
            <li style={li}>✅ Full CSS course access</li>
            <li style={li}>✅ Full JavaScript course access</li>
          </ul>

          <button onClick={pay} disabled={loading} style={{ ...cta, opacity: loading ? 0.75 : 1 }}>
            {loading ? 'Opening payment…' : 'Subscribe'}
          </button>

          {msg ? <div style={error}>{msg}</div> : null}

          <div style={bottomRow}>
            <Link to="/account" style={backLink}>← Back to Account</Link>
            <span style={hint}>Secure payment via Moyasar</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const wrap = {
  padding: '3.5rem 1.25rem',
  maxWidth: 860,
  margin: '0 auto',
};

const card = {
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(124, 242, 176, 0.08)',
  padding: '1.5rem',
};

const topRow = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1.25rem',
  flexWrap: 'wrap',
};

const kicker = {
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontSize: '0.8rem',
  opacity: 0.65,
};

const title = {
  margin: '0.35rem 0 0.35rem 0',
  fontWeight: 950,
  fontSize: '2rem',
};

const sub = {
  margin: 0,
  opacity: 0.75,
  lineHeight: 1.55,
  maxWidth: 520,
};

const priceBox = {
  textAlign: 'right',
  padding: '0.75rem 0.95rem',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  minWidth: 140,
};

const price = {
  fontWeight: 950,
  fontSize: '1.6rem',
  lineHeight: 1.1,
};

const per = {
  marginTop: '0.15rem',
  opacity: 0.75,
  fontWeight: 800,
  fontSize: '0.9rem',
};

const divider = {
  height: 1,
  background: 'rgba(255,255,255,0.10)',
  margin: '1.25rem 0',
};

const list = {
  margin: 0,
  paddingLeft: '1.2rem',
  display: 'grid',
  gap: '0.5rem',
};

const li = {
  fontWeight: 850,
  opacity: 0.9,
};

const cta = {
  marginTop: '1.25rem',
  width: '100%',
  padding: '0.95rem 1rem',
  borderRadius: 14,
  border: 'none',
  background: '#7cf2b0',
  color: '#0b0f14',
  fontWeight: 950,
  cursor: 'pointer',
};

const error = {
  marginTop: '0.85rem',
  color: '#ffb4b4',
  fontWeight: 850,
  whiteSpace: 'pre-wrap',
};

const bottomRow = {
  marginTop: '1.1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const backLink = {
  textDecoration: 'none',
  fontWeight: 900,
  color: 'rgba(255,255,255,0.85)',
};

const hint = {
  fontWeight: 800,
  opacity: 0.6,
  fontSize: '0.9rem',
};
