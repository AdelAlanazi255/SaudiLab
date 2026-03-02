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
  const [progressTick, setProgressTick] = useState(0);
  const [activeTab, setActiveTab] = useState('in_progress');

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
    [availableCourses, progressTick],
  );

  const filteredCards = useMemo(
    () => courseCards.filter((course) => course.status === activeTab),
    [courseCards, activeTab],
  );

  if (!auth || auth.loading) return null;

  return (
    <Layout title="Account">
      <div className={styles.pageWrap}>
        <header className={styles.headerBlock}>
          <h1 className={styles.pageTitle}>Account Dashboard</h1>
          <p className={styles.pageSub}>Account details and course progress in one place.</p>
        </header>

        <section className={styles.summaryCard}>
          <h2 className={styles.sectionTitle}>Account Summary</h2>

          <div className={styles.summaryGrid}>
            <SummaryItem label="Username" value={auth.user?.username || '-'} />
            <SummaryItem label="Email" value={auth.user?.email || '-'} />
            <SummaryItem label="Access" value="All courses available" />
          </div>
        </section>

        <section className={styles.coursesSection}>
          <h2 className={styles.sectionTitle}>Courses and Progress</h2>
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
    <div className={styles.courseCard}>
      <div>
        <div className={styles.courseTitleClamp}>{title}</div>
        <div className={styles.courseSubtitle}>{completedLessons} / {totalLessons} lessons</div>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>

      <div className={styles.cardActions}>
        <Link to={ctaHref} className={`${styles.cardBtn} sl-btn-primary`}>
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

function SummaryItem({ label: l, value: v }) {
  return (
    <div className={styles.summaryItem}>
      <div className={styles.label}>{l}</div>
      <div className={styles.value}>{v}</div>
    </div>
  );
}
