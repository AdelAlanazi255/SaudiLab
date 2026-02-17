import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import { api } from '@site/src/utils/auth';
import { resetProgress } from '@site/src/utils/progress';
import ConfirmModal from '@site/src/components/ConfirmModal';
import CircleProgress from '@site/src/components/CircleProgress';
import { getCourseProgress } from '@site/src/utils/progress';

export default function Account() {
  const auth = useAuth();

  const [msg, setMsg] = useState('');
  const [openReset, setOpenReset] = useState(false);

  const progress = useMemo(() => {
    if (typeof window === 'undefined') return { total: 10, completedCount: 0, percent: 0 };
    return getCourseProgress();
  }, [auth?.subscribed, auth?.isLoggedIn]); // recompute on auth changes

  useEffect(() => {
    if (!auth) return;
    if (!auth.loading && !auth.isLoggedIn) {
      window.location.href = '/login';
    }
  }, [auth]);

  if (!auth || auth.loading) return null;

  const doSubscribe = async (plan) => {
    setMsg('');
    try {
      // hosted payment create
      const out = await api('/billing/moyasar/hosted', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });

      if (!out?.transactionUrl) throw new Error('No transaction URL returned');
      window.location.href = out.transactionUrl;
    } catch (e) {
      setMsg(e.message);
    }
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
    setMsg('Progress reset ✅ (refresh page)');
  };

  const nextLesson = progress.completedCount < 10 ? `/docs/lesson${Math.max(1, progress.completedCount + 1)}` : '/docs/lesson10';

  return (
    <>
      <Layout title="Account">
        <div style={{ padding: '4rem 1.5rem', maxWidth: 980, margin: '0 auto' }}>
          <h1 style={{ fontWeight: 950, marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ opacity: 0.75, marginTop: 0 }}>
            Progress, subscription, and account settings.
          </p>

          {/* TOP GRID */}
          <div style={grid}>
            {/* Progress card */}
            <div style={card}>
              <div style={cardTitle}>HTML Course</div>

              <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <CircleProgress percent={progress.percent} label={`${progress.completedCount}/${progress.total} lessons`} />

                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontWeight: 950, fontSize: '1.15rem' }}>
                    {progress.completedCount === 10 ? 'Course completed ✅' : 'Keep going'}
                  </div>

                  <div style={{ marginTop: '0.35rem', opacity: 0.8, fontWeight: 800 }}>
                    Next: <span style={{ color: '#7cf2b0' }}>{progress.completedCount === 10 ? 'Review Lesson 10' : `Lesson ${progress.completedCount + 1}`}</span>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                    <Link to={nextLesson} style={primaryLink}>
                      {progress.completedCount === 10 ? 'Open Lesson 10' : 'Continue →'}
                    </Link>

                    <Link to="/docs/lesson1" style={ghostLink}>
                      Lessons
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Account card */}
            <div style={card}>
              <div style={cardTitle}>Your Account</div>

              <div style={{ display: 'grid', gap: '0.7rem' }}>
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
                      <span style={{ color: '#7cf2b0', fontWeight: 950 }}>Active</span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 950 }}>Not active</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
                {!auth.subscribed ? (
                  <>
                    <button onClick={() => doSubscribe('student')} style={primaryBtn}>
                      Subscribe Student (test)
                    </button>
                    <button onClick={() => doSubscribe('normal')} style={ghostBtn}>
                      Subscribe Normal (test)
                    </button>
                  </>
                ) : (
                  <button onClick={doUnsubscribe} style={ghostBtn}>
                    Unsubscribe (test)
                  </button>
                )}

                <button onClick={() => setOpenReset(true)} style={dangerBtn}>
                  Reset Progress (device)
                </button>
              </div>

              {msg ? <div style={{ marginTop: '1rem', fontWeight: 900, opacity: 0.9 }}>{msg}</div> : null}
            </div>
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

const grid = {
  display: 'grid',
  gridTemplateColumns: '1.15fr 0.85fr',
  gap: '1.2rem',
};

const card = {
  padding: '1.4rem',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(124, 242, 176, 0.08)',
};

const cardTitle = {
  fontWeight: 950,
  color: 'rgba(255,255,255,0.92)',
  marginBottom: '0.9rem',
  fontSize: '1.1rem',
};

const label = {
  fontSize: '0.85rem',
  fontWeight: 900,
  opacity: 0.65,
  marginBottom: '0.15rem',
};

const value = {
  fontSize: '1.05rem',
  fontWeight: 950,
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

const primaryLink = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: 'none',
  fontWeight: 950,
  textDecoration: 'none',
  background: '#7cf2b0',
  color: '#0b0f14',
  display: 'inline-flex',
  alignItems: 'center',
};

const ghostLink = {
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
