import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import { getCourseProgress, COURSE_EVENT } from '@site/src/utils/progress';

export default function Account() {
  const auth = useAuth();
  const [msg, setMsg] = useState('');

  // ✅ makes the page re-calc progress after completing lessons
  const [progressTick, setProgressTick] = useState(0);

  useEffect(() => {
    if (!auth) return;
    if (!auth.loading && !auth.isLoggedIn) {
      window.location.href = '/login';
    }
  }, [auth]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bump = () => setProgressTick((t) => t + 1);

    // 1) when we explicitly dispatch a course progress event
    window.addEventListener(COURSE_EVENT, bump);

    // 2) when localStorage changes (another tab)
    const onStorage = (e) => {
      if (!e?.key) return;
      if (e.key.includes('saudilab_') && e.key.includes('progress')) bump();
      if (e.key === 'saudilab_completed_lessons') bump();
    };
    window.addEventListener('storage', onStorage);

    // 3) when user comes back to this tab (common after completing lessons)
    window.addEventListener('focus', bump);

    return () => {
      window.removeEventListener(COURSE_EVENT, bump);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', bump);
    };
  }, []);

  const startCheckout = async () => {
    setMsg('');
    try {
      window.location.href = '/checkout';
    } catch (e) {
      setMsg(e.message);
    }
  };

  // ✅ recompute when progress changes (not only when subscription changes)
  const html = useMemo(() => getCourseProgress('html'), [progressTick, auth?.subscribed]);
  const css = useMemo(() => getCourseProgress('css'), [progressTick, auth?.subscribed]);

  if (!auth || auth.loading) return null;

  /**
   * IMPORTANT:
   * Your getCourseProgress().nextLessonId should be one of:
   * - "html/lesson4"  (recommended) OR
   * - "lesson4" (legacy)
   *
   * This handles BOTH safely:
   */
  const toPath = (nextLessonId, fallback) => {
    if (!nextLessonId) return fallback;
    const s = String(nextLessonId).replace(/^\/+/, '');
    if (s.startsWith('html/') || s.startsWith('css/')) return `/${s}`;
    // legacy ids like "lesson4" or "css-lesson4"
    if (s.startsWith('lesson')) return `/html/${s}`;
    if (s.startsWith('css-lesson')) return `/css/${s.replace('css-', '')}`;
    return `/${s}`;
  };

  const htmlContinueHref = toPath(html.nextLessonId, '/html/html-complete');
  const cssContinueHref = toPath(css.nextLessonId, '/css/css-complete');

  return (
    <Layout title="Account">
      <div style={{ padding: '4rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontWeight: 950, marginBottom: '0.5rem' }}>Account</h1>
        <p style={{ opacity: 0.75, marginTop: 0 }}>Your profile and learning progress.</p>

        {/* ACCOUNT STATS */}
        <div style={card}>
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            <div style={grid2}>
              <Row label="Username" value={auth.user?.username || '-'} />
              <Row label="Email" value={auth.user?.email || '-'} />
            </div>

            <div>
              <div style={label}>Subscription</div>
              <div style={value}>
                {auth.subscribed ? (
                  <span style={{ color: '#7cf2b0', fontWeight: 950 }}>Active</span>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 950 }}>
                    Free (HTML Lessons 1–3)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
            <Link to="/html/lesson1" style={primaryLink}>
              Go to Lessons →
            </Link>

            <Link to="/manage-subscription" style={ghostLink}>
              Manage Subscription
            </Link>

            {!auth.subscribed && (
              <button onClick={startCheckout} style={ghostBtn}>
                Subscribe
              </button>
            )}
          </div>

          {msg ? <div style={{ marginTop: '1rem', fontWeight: 900, opacity: 0.92 }}>{msg}</div> : null}
        </div>

        {/* COURSES */}
        <div style={coursesGrid}>
          <CourseCard
            title="HTML Course"
            subtitle={`${html.completedCount} / ${html.total} lessons completed`}
            percent={html.percent}
            primaryHref={htmlContinueHref}
            primaryText={html.nextLessonId ? 'Continue Learning →' : 'View Completion →'}
            secondaryHref="/html/lesson1"
            secondaryText="Start from Lesson 1"
          />

          <CourseCard
            title="CSS Course"
            subtitle={`${css.completedCount} / ${css.total} lessons completed`}
            percent={css.percent}
            primaryHref={cssContinueHref}
            primaryText={css.nextLessonId ? 'Continue Learning →' : 'View Completion →'}
            secondaryHref="/css/lesson1"
            secondaryText="Start from Lesson 1"
            //badge="Coming soon"
          />
        </div>
      </div>
    </Layout>
  );
}

function CourseCard({ title, subtitle, percent, primaryHref, primaryText, secondaryHref, secondaryText, badge }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ fontWeight: 950, fontSize: '1.15rem' }}>{title}</div>
            {badge && (
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 950,
                  padding: '0.18rem 0.55rem',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.06)',
                  opacity: 0.9,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div style={{ opacity: 0.75, marginTop: '0.25rem' }}>{subtitle}</div>
        </div>

        <Circle percent={percent} />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to={primaryHref} style={primaryLink}>
          {primaryText}
        </Link>
        <Link to={secondaryHref} style={ghostLink}>
          {secondaryText}
        </Link>
      </div>
    </div>
  );
}

function Row({ label: l, value: v }) {
  return (
    <div>
      <div style={label}>{l}</div>
      <div style={value}>{v}</div>
    </div>
  );
}

function Circle({ percent }) {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  const size = 86;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (p / 100) * c;

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#7cf2b0"
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 450ms ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontWeight: 950, fontSize: '1.05rem' }}>
        {p}%
      </div>
    </div>
  );
}

const card = {
  marginTop: '1.2rem',
  padding: '1.4rem',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(124, 242, 176, 0.08)',
};

const coursesGrid = {
  marginTop: '1.25rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1.25rem',
};

const grid2 = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1rem',
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

const primaryLink = {
  ...primaryBtn,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const ghostLink = {
  ...ghostBtn,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};
