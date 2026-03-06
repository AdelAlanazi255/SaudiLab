import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { HOMEPAGE_COURSES } from '@site/src/course/courseCatalog';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';
import SaudiLabRoadmap from '@site/src/components/SaudiLabRoadmap';
import { useAuth } from '@site/src/utils/authState';
import { LEARNING_MODE_FREE, normalizeLearningMode } from '@site/src/utils/learningMode';
import { canAccessCourse } from '@site/src/utils/lessonAccess';
import './homepage.css';

const COURSE_LOGOS = {
  html: '/img/html-logo.png',
  css: '/img/css-logo.png',
  javascript: '/img/javascript-logo.png',
  cse: '/img/cse-logo.png',
  crypto: '/img/crypto-logo.png',
};

const COURSE_LEVELS = [
  {
    id: 'beginner',
    label: 'BEGINNER',
    courseIds: ['html', 'css', 'javascript'],
    rowType: 'level',
  },
  {
    id: 'intermediate',
    label: 'INTERMEDIATE',
    courseIds: ['pcs', 'cse', 'ethics'],
    rowType: 'level',
  },
  {
    id: 'upper-intermediate',
    label: 'UPPER-INTERMEDIATE',
    courseIds: ['crypto', 'websecurity', 'kalitools'],
    rowType: 'level',
  },
  {
    id: 'advanced',
    label: 'ADVANCED',
    courseIds: ['forensics', 'blueteam'],
    rowType: 'level',
  },
  {
    id: 'resources',
    label: 'RESOURCES',
    courseIds: ['career'],
    rowType: 'resources',
  },
];

export default function Home() {
  const auth = useAuth();
  const [guidedLockModalOpen, setGuidedLockModalOpen] = useState(false);
  const courseById = React.useMemo(
    () =>
      HOMEPAGE_COURSES.reduce((acc, course) => {
        acc[course.courseId] = course;
        return acc;
      }, {}),
    [],
  );

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const isFreeMode = normalizeLearningMode(auth?.learningMode) === LEARNING_MODE_FREE;
  const isGuidedMode = !isFreeMode;
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const ctaLabel = isFreeMode ? 'View' : 'Start';

  useEffect(() => {
    if (!guidedLockModalOpen || typeof window === 'undefined') return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setGuidedLockModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [guidedLockModalOpen]);

  return (
    <Layout>
      <main className="home-page">
        <Section className="hero-section reveal">
          <PageContainer>
            <div className="hero-inner">
            <h1 className="hero-title">Start Your Cyber Security Journey</h1>
            <p className="hero-subtitle">
              Build a strong foundation in security, web technologies, and practical skills  Designed for complete beginners.
            </p>
            </div>
          </PageContainer>
        </Section>

        <Section className="roadmap-section reveal" id="saudilab-roadmap">
          <PageContainer>
            <SaudiLabRoadmap />
          </PageContainer>
        </Section>

        <Section className="courses-section reveal" id="courses">
          <PageContainer>
            <div className="section-head">
              <h2 className="section-title">Courses</h2>
              {!isLoggedIn ? (
                <p className="courses-signupPrompt">
                  New to SaudiLab? <Link to="/signup">Sign up now!</Link>
                </p>
              ) : null}
            </div>
            <div className="course-tracks" role="list" aria-label="Courses grouped by level">
              {COURSE_LEVELS.map((level) => {
                const courses = level.courseIds.map((id) => courseById[id]).filter(Boolean);
                if (!courses.length) return null;

                return (
                  <section
                    key={level.id}
                    className="course-track"
                    role="listitem"
                    aria-label={level.rowType === 'resources' ? 'Resources' : `${level.label} courses`}
                  >
                    <aside className="level-panel">
                      <h3 className="level-title">{level.label}</h3>
                      {level.rowType === 'level' ? (
                        <div className="level-count">{courses.length} course{courses.length > 1 ? 's' : ''}</div>
                      ) : null}
                    </aside>

                    <div
                      className="track-scroll"
                      role="region"
                      aria-label={level.rowType === 'resources' ? 'Resources row' : `${level.label} course row`}
                    >
                      <div className="track-row">
                        {courses.map((course) => {
                          const logoSrc = COURSE_LOGOS[course.courseId] || null;
                          const tooltipId = `course-desc-${course.courseId}`;
                          const courseHref = course.ctaHref || `/${course.courseId}`;
                          const isGuidedLockedCourse = isLoggedIn && isGuidedMode && !canAccessCourse(course.courseId);
                          return (
                            <article
                              key={course.title}
                              className="course-card course-card-active"
                            >
                              <div className="course-head">
                                <h3>{course.title}</h3>
                                <div className="course-headMeta">
                                  <div className="course-descHintWrap">
                                    <button
                                      type="button"
                                      className="course-descHint"
                                      aria-label={`Course description for ${course.title}`}
                                      aria-describedby={tooltipId}
                                    >
                                      ?
                                    </button>
                                    <div id={tooltipId} role="tooltip" className="course-descTooltip">
                                      {course.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {logoSrc ? (
                                <div className="course-logoRow">
                                  <img className="course-logo" src={logoSrc} alt={`${course.title} logo`} loading="lazy" />
                                </div>
                              ) : null}
                              <div className="course-actions">
                                {!isLoggedIn ? (
                                  course.courseId === 'html' ? (
                                    <a href={courseHref} className="btn btn-primary btn-small">
                                      Preview
                                    </a>
                                  ) : (
                                    <Link to="/login" className="btn btn-primary btn-small">
                                      Log in
                                    </Link>
                                  )
                                ) : isGuidedLockedCourse ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-small course-ctaLocked"
                                    onClick={() => setGuidedLockModalOpen(true)}
                                    aria-haspopup="dialog"
                                  >
                                    {ctaLabel}
                                  </button>
                                ) : (
                                  <a href={courseHref} className="btn btn-primary btn-small">
                                    {ctaLabel}
                                  </a>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </PageContainer>
        </Section>

        {guidedLockModalOpen ? (
          <div
            className="sl-modalBackdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setGuidedLockModalOpen(false);
            }}
          >
            <div
              className="sl-modal sl-guidedLockModal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="sl-guided-lock-title"
            >
              <div className="sl-modalHead">
                <div>
                  <h2 id="sl-guided-lock-title" className="sl-modalTitle">Course locked in Guided mode</h2>
                  <p className="sl-modalMsg sl-guidedLockMsg">
                    You are currently in guided mode, if you want to freely view all courses with no progression
                    tracking switch to Free exploration in dashboard
                  </p>
                </div>
                <button
                  type="button"
                  className="sl-modalX"
                  aria-label="Close"
                  onClick={() => setGuidedLockModalOpen(false)}
                >
                  X
                </button>
              </div>
              <div className="sl-modalActions sl-guidedLockActions">
                <Link to="/account" className="sl-btn-primary">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : null}

      </main>
    </Layout>
  );
}
