import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '@site/src/utils/authState';
import { api } from '@site/src/utils/auth';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

function loadCss(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

export default function Checkout() {
  const auth = useAuth();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const plan = params.get('plan') || 'student';

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // OPTIONAL: preload moyasar assets only on checkout page
  useEffect(() => {
    loadCss('https://cdn.moyasar.com/mpf/1.6.0/moyasar.css');
    loadScript('https://cdn.moyasar.com/mpf/1.6.0/moyasar.js').catch(() => {});
  }, []);

  const pay = async () => {
    setMsg('');
    setLoading(true);

    try {
      if (!auth || auth.loading) throw new Error('Auth not ready yet');
      if (!auth.isLoggedIn) {
        window.location.href = '/login';
        return;
      }

      // create hosted payment page on backend (no tokens on frontend)
      const out = await api('/billing/moyasar/hosted', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });

      if (!out || !out.transactionUrl) {
        throw new Error('No transaction URL returned from server');
      }

      window.location.href = out.transactionUrl;
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Checkout">
      <div style={{ padding: '2rem', maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontWeight: 950 }}>Checkout</h1>
        <p style={{ opacity: 0.8 }}>
          Plan: <b>{plan}</b>
        </p>

        <button
          onClick={pay}
          disabled={loading}
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1.1rem',
            background: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 950,
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {loading ? 'Redirecting…' : 'Pay (Test)'}
        </button>

        {msg ? (
          <div style={{ marginTop: '1rem', color: '#ffb4b4', fontWeight: 900 }}>
            {msg}
          </div>
        ) : null}

        <div style={{ marginTop: '1.25rem' }}>
          <Link to="/account">← Back to Account</Link>
        </div>
      </div>
    </Layout>
  );
}
