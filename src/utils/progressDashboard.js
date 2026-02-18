import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '@site/src/utils/authState';
import { api } from '@site/src/utils/auth';

export default function Checkout() {
  const auth = useAuth();
  const location = useLocation();

  const plan = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const p = (params.get('plan') || 'student').toLowerCase();
    return p === 'normal' ? 'normal' : 'student';
  }, [location.search]);

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const price = plan === 'student' ? 'SAR 1 / month' : 'SAR 1 / month';
  const label = plan === 'student' ? 'Student Plan' : 'Normal Plan';

  const pay = async () => {
    setMsg('');
    setLoading(true);

    try {
      if (!auth || auth.loading) throw new Error('Auth not ready yet');
      if (!auth.isLoggedIn) {
        window.location.href = '/login';
        return;
      }

      const out = await api('/billing/moyasar/hosted', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });

      if (!out?.transactionUrl) throw new Error('No payment URL returned');
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
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={kicker}>Checkout</div>
              <h1 style={title}>{label}</h1>
              <div style={sub}>Secure payment powered by Moyasar (test mode).</div>
            </div>

            <div style={badge}>
              <div style={{ fontWeight: 950, fontSize: '1.05rem' }}>{price}</div>
              <div style={{ opacity: 0.75, fontWeight: 800, fontSize: '0.9rem' }}>
                Cancel anytime
              </div>
            </div>
          </div>

          <div style={divider} />

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <button onClick={pay} disabled={loading} style={primaryBtn(loading)}>
              {loading ? 'Redirecting…' : 'Continue to Payment'}
            </button>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/account" style={ghostLink}>
                ← Back to Account
              </Link>
              <Link to="/html/lesson1" style={ghostLink}>
                Browse Lessons
              </Link>
            </div>

            {msg ? <div style={errorBox}>{msg}</div> : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const wrap = {
  minHeight: 'calc(100vh - 60px)',
  padding: '3.25rem 1.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
};

const card = {
  width: '100%',
  maxWidth: 860,
  borderRadius: 22,
  padding: '1.6rem',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.40)',
  boxShadow: '0 22px 70px rgba(0,0,0,0.55), 0 0 80px rgba(124, 242, 176, 0.12)',
  backdropFilter: 'blur(8px)',
};

const kicker = {
  fontWeight: 950,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.65)',
  marginBottom: '0.35rem',
};

const title = {
  margin: 0,
  fontSize: '2.2rem',
  fontWeight: 950,
  color: 'rgba(255,255,255,0.95)',
};

const sub = {
  marginTop: '0.5rem',
  color: 'rgba(255,255,255,0.7)',
  fontWeight: 700,
  lineHeight: 1.6,
};

const badge = {
  minWidth: 210,
  alignSelf: 'flex-start',
  padding: '0.9rem 1rem',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.92)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
};

const divider = {
  height: 1,
  background: 'rgba(255,255,255,0.12)',
  margin: '1.25rem 0',
};

const primaryBtn = (disabled) => ({
  width: '100%',
  padding: '0.95rem 1.1rem',
  borderRadius: 14,
  border: 'none',
  fontWeight: 950,
  cursor: disabled ? 'not-allowed' : 'pointer',
  background: '#7cf2b0',
  color: '#0b0f14',
  boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 70px rgba(124, 242, 176, 0.18)',
  transition: 'transform 180ms ease, box-shadow 250ms ease, filter 250ms ease',
  filter: disabled ? 'grayscale(0.25) opacity(0.85)' : 'none',
});

const ghostLink = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.65rem 0.95rem',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.92)',
  textDecoration: 'none',
  fontWeight: 900,
};

const errorBox = {
  marginTop: '0.25rem',
  padding: '0.85rem 1rem',
  borderRadius: 14,
  border: '1px solid rgba(255, 120, 120, 0.25)',
  background: 'rgba(255, 80, 80, 0.10)',
  color: 'rgba(255, 210, 210, 0.95)',
  fontWeight: 900,
  lineHeight: 1.4,
};
