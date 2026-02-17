// src/pages/account.js
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import { api } from '@site/src/utils/auth';
import { resetProgress } from '@site/src/utils/progress';
import ConfirmModal from '@site/src/components/ConfirmModal';

export default function Account() {
  const auth = useAuth();
  const [msg, setMsg] = useState('');
  const [openReset, setOpenReset] = useState(false);

  useEffect(() => {
    if (!auth) return;
    if (!auth.loading && !auth.isLoggedIn) {
      window.location.href = '/login';
    }
  }, [auth]);

  if (!auth || auth.loading) return null;

  // ✅ Step 4 change: go to our checkout page (token flow)
  const doSubscribe = (plan) => {
    window.location.href = `/checkout?plan=${encodeURIComponent(plan)}`;
  };

  const doUnsubscribe = async () => {
    setMsg('');
    try {
      await api('/billing/unsubscribe', { method: 'POST' });
      await auth.refresh();
      setMsg('Subscription removed ✅');
    } catch (e) {
      setMsg(e.message);
    }
  };

  const doResetProgress = () => {
    resetProgress();
    setMsg('Progress reset ✅');
  };

  return (
    <>
      <Layout title="Account">
        <div style={{ padding: '4rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontWeight: 950, marginBottom: '0.5rem' }}>Account</h1>
          <p style={{ opacity: 0.75, marginTop: 0 }}>
            Manage your profile, subscription and progress.
          </p>

          <div style={card}>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <div>
                <div style={label}>Username</div>
                <div style={value}>{auth.user?.username}</div>
              </div>

              <div>
                <div style={label}>Email</div>
                <div style={value}>{auth.user?.email}</div>
              </div>

              <div>
                <div style={label}>Subscription</div>
                <div style={value}>
                  {auth.subscribed ? (
                    <span style={{ color: '#7cf2b0', fontWeight: 900 }}>Active</span>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 900 }}>
                      Not active
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
              <button onClick={() => doSubscribe('student')} style={primaryBtn}>
                Subscribe Student (test)
              </button>

              <button onClick={() => doSubscribe('normal')} style={ghostBtn}>
                Subscribe Normal (test)
              </button>

              <button onClick={() => setOpenReset(true)} style={dangerBtn}>
                Reset Progress (device)
              </button>

              <Link to="/docs/lesson1" style={linkBtn}>
                Go to Lessons →
              </Link>
            </div>

            {msg ? (
              <div style={{ marginTop: '1rem', fontWeight: 800, opacity: 0.9 }}>{msg}</div>
            ) : null}
          </div>
        </div>
      </Layout>

      <ConfirmModal
        open={openReset}
        title="Reset Progress"
        message="This will reset your course progress on this device. Continue?"
        confirmText="Reset"
        cancelText="Cancel"
        onCancel={() => setOpenReset(false)}
        onConfirm={() => {
          setOpenReset(false);
          doResetProgress();
        }}
      />
    </>
  );
}

const card = {
  marginTop: '1.5rem',
  padding: '1.4rem',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(124, 242, 176, 0.08)',
};

const label = {
  fontSize: '0.85rem',
  fontWeight: 900,
  opacity: 0.65,
  marginBottom: '0.15rem',
};

const value = {
  fontSize: '1.05rem',
  fontWeight: 900,
};

const primaryBtn = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: 'none',
  fontWeight: 950,
  cursor: 'pointer',
  background: '#7cf2b0',
  color: '#0b0f14',
};

const ghostBtn = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 950,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.92)',
};

const dangerBtn = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 950,
  cursor: 'pointer',
  background: 'rgba(255, 60, 60, 0.12)',
  color: 'rgba(255,255,255,0.92)',
};

const linkBtn = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 950,
  textDecoration: 'none',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.92)',
  display: 'inline-flex',
  alignItems: 'center',
};
