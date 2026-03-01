import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import { getCourseProgress, COURSE_EVENT } from '@site/src/utils/progress';
import { getLesson } from '@site/src/course/courseMap';
import { HOMEPAGE_COURSES } from '@site/src/course/courseCatalog';
import styles from './account.module.css';

const COURSE_TABS = [
  { id: 'in_progress', label: 'In progress' },
  { id: 'not_started', label: 'Not started' },
  { id: 'completed', label: 'Completed' },
];

function resolveCourseStatus(completedLessons, totalLessons) {
  if (completedLessons <= 0) return 'not_started';
  if (completedLessons >= totalLessons) return 'completed';
  return 'in_progress';
}

export default function Account() {
  const auth = useAuth();
  const [msg, setMsg] = useState('');
  const [progressTick, setProgressTick] = useState(0);
  const [activeTab, setActiveTab] = useState('in_progress');
  const billingPortalUrl = '';
  const hasBillingPortal = billingPortalUrl.length > 0;

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

  const availableCourses = useMemo(
    () => HOMEPAGE_COURSES.filter((course) => course.active && course.ctaHref),
    [],
  );

  const courseCards = useMemo(
    () =>
      availableCourses.map((course) => {
        const progress = getCourseProgress(course.courseId);
        const totalLessons = Number(progress.total) || 0;
        const completedLessons = Number(progress.completedCount) || 0;
        const firstLessonPath = getLesson(course.courseId, 'lesson1')?.permalink || `${course.ctaHref}/lesson1`;
        const continuePath = progress.nextLessonId
          ? getLesson(course.courseId, progress.nextLessonId)?.permalink || firstLessonPath
          : firstLessonPath;
        const status = resolveCourseStatus(completedLessons, totalLessons);
        const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        const ctaText = status === 'not_started' ? 'Start' : status === 'completed' ? 'Review' : 'Continue';
        const ctaHref = status === 'not_started' ? firstLessonPath : status === 'completed' ? firstLessonPath : continuePath || firstLessonPath;

        return {
          id: course.courseId,
          title: course.title,
          totalLessons,
          completedLessons,
          status,
          percent,
          ctaHref,
          ctaText,
        };
      }),
    [availableCourses, progressTick, auth?.subscribed],
  );

  const filteredCards = useMemo(
    () => courseCards.filter((course) => course.status === activeTab),
    [courseCards, activeTab],
  );

  if (!auth || auth.loading) return null;

  return (
    <Layout title="Account">
      <div style={pageWrap}>
        <header style={headerBlock}>
          <h1 style={pageTitle}>Account Dashboard</h1>
          <p style={pageSub}>Account details, plan status, and course progress in one place.</p>
        </header>

        <section style={summaryCard}>
          <h2 style={sectionTitle}>Account Summary</h2>

          <div style={summaryGrid}>
            <SummaryItem label="Username" value={auth.user?.username || '-'} />
            <SummaryItem label="Email" value={auth.user?.email || '-'} />
            <SummaryItem label="Plan" value={<PlanBadge subscribed={auth.subscribed} />} />
          </div>

          <div style={summaryActions}>
            {hasBillingPortal ? (
              <a href={billingPortalUrl} target="_blank" rel="noopener noreferrer" style={ghostLink}>
                Billing
              </a>
            ) : (
              <button type="button" disabled style={disabledGhostBtn}>
                Billing (coming soon)
              </button>
            )}
            {!auth.subscribed ? (
              <button onClick={startCheckout} style={primaryBtn}>
                Upgrade to Pro
              </button>
            ) : null}
          </div>

          {msg ? <div style={message}>{msg}</div> : null}
        </section>

        <section style={coursesSection}>
          <h2 style={sectionTitle}>Courses and Progress</h2>
          <div className={styles.filtersWrap}>
            <div className={styles.courseFilters} role="tablist" aria-label="Course progress filters">
              {COURSE_TABS.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`${styles.filterTab} ${active ? styles.filterTabActive : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <p className={styles.filterSummary}>Showing {filteredCards.length} of {courseCards.length} courses</p>
          </div>

          <div className={styles.coursesGrid}>
            {filteredCards.map((courseCard) => (
              <CourseCard
                key={courseCard.id}
                title={courseCard.title}
                completedLessons={courseCard.completedLessons}
                totalLessons={courseCard.totalLessons}
                percent={courseCard.percent}
                ctaHref={courseCard.ctaHref}
                ctaText={courseCard.ctaText}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function CourseCard({ title, completedLessons, totalLessons, percent, ctaHref, ctaText }) {
  return (
    <div style={courseCard} className={styles.courseCard}>
      <div>
        <div style={courseTitle} className={styles.courseTitleClamp}>{title}</div>
        <div style={courseSubtitle}>{completedLessons} / {totalLessons} lessons</div>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>

      <div style={cardActions} className={styles.cardActions}>
        <Link to={ctaHref} style={coursePrimaryLink} className={styles.cardBtn}>
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

function SummaryItem({ label: l, value: v }) {
  return (
    <div style={summaryItem}>
      <div style={label}>{l}</div>
      <div style={value}>{v}</div>
    </div>
  );
}

function PlanBadge({ subscribed }) {
  const isPro = !!subscribed;
  return (
    <span
      style={{
        fontSize: '0.68rem',
        fontWeight: 800,
        lineHeight: 1,
        padding: '0.16rem 0.42rem',
        borderRadius: 999,
        color: isPro ? '#d7f7e4' : 'rgba(229,231,235,0.9)',
        background: isPro ? 'rgba(0, 108, 53, 0.32)' : 'rgba(148,163,184,0.16)',
        border: isPro ? '1px solid rgba(124, 242, 176, 0.28)' : '1px solid rgba(148,163,184,0.28)',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {isPro ? 'Pro' : 'Free'}
    </span>
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

const summaryCard = {
  ...card,
  marginTop: '0.85rem',
  padding: '1rem 1.1rem',
  borderRadius: 14,
  boxShadow: '0 10px 24px rgba(0,0,0,0.24)',
};

const summaryGrid = {
  marginTop: '0.72rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: '0.58rem',
};

const summaryItem = {
  padding: '0.6rem 0.75rem',
  borderRadius: 10,
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
  fontSize: '0.95rem',
  fontWeight: 900,
};

const summaryActions = {
  marginTop: '0.7rem',
  display: 'flex',
  gap: '0.55rem',
  flexWrap: 'wrap',
};

const message = {
  marginTop: '0.9rem',
  fontWeight: 900,
  opacity: 0.92,
};

const courseCard = {
  ...card,
  padding: '0.95rem',
  borderRadius: 14,
  boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
};

const courseTitle = {
  fontWeight: 950,
  fontSize: '1rem',
  lineHeight: 1.25,
};

const courseSubtitle = {
  opacity: 0.76,
  marginTop: '0.18rem',
  fontSize: '0.88rem',
};

const cardActions = {
  marginTop: '0.6rem',
  display: 'flex',
  gap: '0.4rem',
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

const disabledGhostBtn = {
  ...ghostBtn,
  opacity: 0.52,
  cursor: 'not-allowed',
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

const coursePrimaryLink = {
  ...primaryLink,
  padding: '0.56rem 0.84rem',
  borderRadius: 12,
  fontSize: '0.88rem',
  fontWeight: 900,
};
