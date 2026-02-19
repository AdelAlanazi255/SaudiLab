import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import { getCourseProgress, COURSE_EVENT } from '@site/src/utils/progress';

export default function Account() {
  const auth = useAuth();
  const [msg, setMsg] = useState('');
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
    const onStorage = (e) => {
      if (!e?.key) return;
      if (e.key.includes('saudilab_') && e.key.includes('progress')) bump();
      if (e.key === 'saudilab_completed_lessons') bump();
    };

    window.addEventListener(COURSE_EVENT, bump);
    window.addEventListener('storage', onStorage);
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

  const html = useMemo(() => getCourseProgress('html'), [progressTick, auth?.subscribed]);
  const css = useMemo(() => getCourseProgress('css'), [progressTick, auth?.subscribed]);

  if (!auth || auth.loading) return null;

  const toPath = (nextLessonId, course, fallback) => {
    if (!nextLessonId) return fallback;
    const s = String(nextLessonId).replace(/^\/+/, '');
    if (s.startsWith('html/') || s.startsWith('css/')) return `/${s}`;
    if (s.startsWith('lesson')) {
      return course === 'css' ? `/css/${s}` : `/html/${s}`;
    }
    if (s.startsWith('css-lesson')) return `/css/${s.replace('css-', '')}`;
    if (s.startsWith('html-lesson')) return `/html/${s.replace('html-', '')}`;
    return `/${s}`;
  };

  const htmlContinueHref = toPath(html.nextLessonId, 'html', '/html/html-complete');
  const cssContinueHref = toPath(css.nextLessonId, 'css', '/css/lesson1');

  return (
    <Layout title="Account">
      <div style={pageWrap}>
        <header style={headerBlock}>
          <h1 style={pageTitle}>Account Dashboard</h1>
          <p style={pageSub}>Profile, subscription status, and course progress in one place.</p>
        </header>

        <section style={card}>
          <h2 style={sectionTitle}>Profile</h2>

          <div style={profileGrid}>
            <Row label="Username" value={auth.user?.username || '-'} />
            <Row label="Email" value={auth.user?.email || '-'} />
            <div style={rowBox}>
              <div style={label}>Subscription</div>
              <div style={value}>
                {auth.subscribed ? (
                  <span style={statusActive}>Active</span>
                ) : (
                  <span style={statusFree}>Free</span>
                )}
              </div>
            </div>
          </div>

          {!auth.subscribed ? <p style={freeNote}>Free includes HTML lessons 1-3.</p> : null}

          <div style={actionRow}>
            <Link to="/html/lesson1" style={ghostLink}>
              Go to Lessons
            </Link>

            {auth.subscribed ? (
              <Link to="/manage-subscription" style={ghostLink}>
                Manage subscription
              </Link>
            ) : (
              <button onClick={startCheckout} style={primaryBtn}>
                Upgrade to Pro
              </button>
            )}
          </div>

          {msg ? <div style={message}>{msg}</div> : null}
        </section>

        <section style={coursesSection}>
          <h2 style={sectionTitle}>Courses and Progress</h2>
          <div style={coursesGrid}>
            <CourseCard
              title="HTML Course"
              subtitle={`${html.completedCount} / ${html.total} lessons completed`}
              percent={html.percent}
              primaryHref={htmlContinueHref}
              primaryText={html.nextLessonId ? 'Continue Learning' : 'View Completion'}
              secondaryHref="/html/lesson1"
              secondaryText="Start from Lesson 1"
            />

            <CourseCard
              title="CSS Course"
              subtitle={`${css.completedCount} / ${css.total} lessons completed`}
              percent={css.percent}
              primaryHref={cssContinueHref}
              primaryText={css.nextLessonId ? 'Continue Learning' : 'Start CSS Course'}
              secondaryHref="/css/lesson1"
              secondaryText="Start from Lesson 1"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function CourseCard({ title, subtitle, percent, primaryHref, primaryText, secondaryHref, secondaryText }) {
  return (
    <div style={card}>
      <div style={cardHeaderRow}>
        <div>
          <div style={courseTitle}>{title}</div>
          <div style={courseSubtitle}>{subtitle}</div>
        </div>
        <Circle percent={percent} />
      </div>

      <div style={cardActions}>
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
    <div style={rowBox}>
      <div style={label}>{l}</div>
      <div style={value}>{v}</div>
    </div>
  );
}

function Circle({ percent }) {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  const size = 82;
  const stroke = 9;
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
      <div style={circleValue}>{p}%</div>
    </div>
  );
}

const pageWrap = {
  padding: '3.25rem 1.25rem 4rem',
  maxWidth: 1120,
  margin: '0 auto',
};

const headerBlock = {
  marginBottom: '1rem',
};

const pageTitle = {
  margin: 0,
  fontWeight: 950,
};

const pageSub = {
  marginTop: '0.45rem',
  opacity: 0.76,
};

const sectionTitle = {
  margin: 0,
  fontWeight: 900,
  fontSize: '1.2rem',
};

const coursesSection = {
  marginTop: '1.1rem',
};

const card = {
  marginTop: '1rem',
  padding: '1.4rem',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(124, 242, 176, 0.08)',
};

const profileGrid = {
  marginTop: '1rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: '0.8rem',
};

const rowBox = {
  padding: '0.8rem 0.9rem',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
};

const label = {
  fontSize: '0.84rem',
  fontWeight: 900,
  opacity: 0.65,
  marginBottom: '0.2rem',
};

const value = {
  fontSize: '1rem',
  fontWeight: 900,
};

const statusActive = {
  color: '#7cf2b0',
};

const statusFree = {
  color: 'rgba(255,255,255,0.82)',
};

const freeNote = {
  marginTop: '0.8rem',
  marginBottom: 0,
  opacity: 0.78,
  fontSize: '0.93rem',
};

const actionRow = {
  marginTop: '1rem',
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const message = {
  marginTop: '0.9rem',
  fontWeight: 900,
  opacity: 0.92,
};

const coursesGrid = {
  marginTop: '1rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1rem',
};

const cardHeaderRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap',
};

const courseTitle = {
  fontWeight: 950,
  fontSize: '1.15rem',
};

const courseSubtitle = {
  opacity: 0.76,
  marginTop: '0.25rem',
};

const cardActions = {
  marginTop: '1rem',
  display: 'flex',
  gap: '0.65rem',
  flexWrap: 'wrap',
};

const circleValue = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  fontWeight: 950,
  fontSize: '1rem',
};

const primaryBtn = {
  padding: '0.78rem 1.15rem',
  borderRadius: 14,
  border: 'none',
  fontWeight: 950,
  cursor: 'pointer',
  background: '#7cf2b0',
  color: '#0b0f14',
  boxShadow: '0 10px 28px rgba(124, 242, 176, 0.24)',
};

const ghostBtn = {
  padding: '0.78rem 1.15rem',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 900,
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
