import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import { HOMEPAGE_COURSES } from '@site/src/course/courseCatalog';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';
import SaudiLabRoadmap from '@site/src/components/SaudiLabRoadmap';
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
                          const isAvailable = course.available === true;
                          const logoSrc = COURSE_LOGOS[course.courseId] || null;
                          const tooltipId = `course-desc-${course.courseId}`;
                          return (
                            <article
                              key={course.title}
                              className={`course-card ${isAvailable ? 'course-card-active' : 'course-card-unavailable'}`}
                              aria-disabled={!isAvailable}
                            >
                              <div className="course-head">
                                <h3>{course.title}</h3>
                                <div className="course-headMeta">
                                  {course.notify ? <span className="soon-pill">Soon</span> : null}
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
                                {isAvailable && course.ctaHref ? (
                                  <a href={course.ctaHref} className="btn btn-primary btn-small">
                                    Start
                                  </a>
                                ) : (
                                  <span className="coming-soon">Coming soon</span>
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

      </main>
    </Layout>
  );
}
