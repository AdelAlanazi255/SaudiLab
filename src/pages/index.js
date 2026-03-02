import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { HOMEPAGE_COURSES } from '@site/src/course/courseCatalog';
import PageContainer from '@site/src/components/layout/PageContainer';
import Section from '@site/src/components/layout/Section';
import CardGrid from '@site/src/components/layout/CardGrid';
import './homepage.css';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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
            <div className="hero-cta-row">
              <a href="/html/lesson1" className="btn btn-primary">
                Start Learning
              </a>
            </div>
            </div>
          </PageContainer>
        </Section>

        <Section className="courses-section reveal" id="courses">
          <PageContainer>
            <div className="section-head">
              <h2 className="section-title">Courses</h2>
            </div>
            <CardGrid className="courses-grid" columns="four">
              {HOMEPAGE_COURSES.map((course) => (
                <article
                  key={course.title}
                  className={`course-card ${course.active ? 'course-card-active' : 'course-card-soon'}`}
                >
                  <div className="course-head">
                    <h3>{course.title}</h3>
                    {course.notify ? <span className="soon-pill">Soon</span> : null}
                  </div>
                  <p>{course.description}</p>
                  <div className="course-actions">
                    {course.ctaHref ? (
                      <a href={course.ctaHref} className="btn btn-primary btn-small">
                        Start
                      </a>
                    ) : (
                      <span className="coming-soon">Coming soon</span>
                    )}
                    {course.notify ? (
                      <a href="/account" className="notify-link">
                        Notify me
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </CardGrid>
          </PageContainer>
        </Section>

        <Section className="faq-section reveal">
          <PageContainer className="sl-page-container--narrow">
            <div className="section-head">
              <h2 className="section-title">FAQ</h2>
            </div>
            <div className="faq-list">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <article key={item.q} className={`faq-card ${isOpen ? 'faq-card-open' : ''}`}>
                    <h3 className="faq-heading">
                      <button
                        type="button"
                        className="faq-question-button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${index}`}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      >
                        <span className="faq-question">{item.q}</span>
                        <span className="faq-icon" aria-hidden="true">
                          {isOpen ? '-' : '+'}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-hidden={!isOpen}
                      className={`faq-answer-wrap ${isOpen ? 'faq-answer-open' : ''}`}
                    >
                      <p className="faq-answer">{item.a}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </PageContainer>
        </Section>
      </main>
    </Layout>
  );
}

const FAQ_ITEMS = [
  { q: 'Do I need coding experience?', a: 'No. SaudiLab is designed for complete beginners and starts from zero.' },
  { q: 'What can I access?', a: 'All currently published lessons and Try-It exercises are available to every learner.' },
  { q: 'Do I need to install anything?', a: 'No. All lessons and Try-It exercises run directly in your browser.' },
  {
    q: 'Are cyber security topics included?',
    a: 'Yes. Security fundamentals and applied cryptography content are planned in the learning path.',
  },
  { q: 'Do I need to pay to use SaudiLab?', a: 'No. SaudiLab is fully free to use.' },
];
