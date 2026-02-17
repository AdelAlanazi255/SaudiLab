import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '@site/src/utils/authState';
import { api } from '@site/src/utils/auth';

export default function Checkout() {
  const auth = useAuth();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const plan = params.get('plan') || 'student';

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // keep these inputs for later (UI), but we won't send them anymore
  const [name, setName] = useState('SaudiLab User');
  const [number, setNumber] = useState('4111111111111111');
  const [month, setMonth] = useState('12');
  const [year, setYear] = useState('28');
  const [cvc, setCvc] = useState('123');

  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/billing/moyasar/pk')
      .then((r) => r.json())
      .then((d) => setPublicKey(d.pk))
      .catch(() => setPublicKey(null));
  }, []);

  const pay = async () => {
    setMsg('');
    setLoading(true);

    try {
      if (!publicKey) throw new Error('Missing Moyasar public key');
      if (!auth || auth.loading) throw new Error('Auth not ready yet');
      if (!auth.isLoggedIn) throw new Error('You must be logged in');

      // ✅ call backend to create hosted payment page (no tokens)
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
        <h1>Checkout (Test)</h1>
        <p>
          Plan: <b>{plan}</b>
        </p>

        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          {/* UI only for now */}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Card Number" />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input style={{ flex: 1 }} value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" />
            <input style={{ flex: 1 }} value={year} onChange={(e) => setYear(e.target.value)} placeholder="YY" />
            <input style={{ flex: 1 }} value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" />
          </div>

          <button
            onClick={pay}
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.8rem 1rem',
              background: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Redirecting...' : 'Pay (Test)'}
          </button>

          <div style={{ fontWeight: 800, opacity: 0.8 }}>
            PK loaded: {publicKey ? '✅' : '❌'}
          </div>

          {msg && (
            <div style={{ marginTop: '0.5rem', color: '#ffb4b4', fontWeight: 800 }}>
              {msg}
            </div>
          )}

          <Link to="/account">← Back to Account</Link>
        </div>
      </div>
    </Layout>
  );
}
