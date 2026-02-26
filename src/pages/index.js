import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
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
        <section className="hero-section reveal">
          <div className="hero-inner">
            <h1 className="hero-title">Start Your Cyber Security Journey</h1>
            <p className="hero-subtitle">
              Build a strong foundation in security, web technologies, and practical skills - designed for complete beginners.
            </p>
            <div className="hero-cta-row">
              <a href="/html/lesson1" className="btn btn-primary">
                Start Learning
              </a>
              <a href="#pricing" className="btn btn-ghost">
                View Plans
              </a>
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-section reveal">
          <div className="section-head">
            <h2 className="section-title">Free vs Pro</h2>
          </div>
          <div className="pricing-grid">
            <article className="plan-card">
              <h3 className="plan-name">Free</h3>
              <ul className="feature-list">
                <li>
                  <span className="mark mark-ok" aria-hidden="true">+</span>
                  <span>First 3 HTML lessons</span>
                </li>
                <li>
                  <span className="mark mark-no" aria-hidden="true">-</span>
                  <span>Full HTML course</span>
                </li>
                <li>
                  <span className="mark mark-no" aria-hidden="true">-</span>
                  <span>CSS course</span>
                </li>
                <li>
                  <span className="mark mark-no" aria-hidden="true">-</span>
                  <span>JavaScript course</span>
                </li>
              </ul>
            </article>

            <article className="plan-card plan-card-pro">
              <h3 className="plan-name">Pro</h3>
              <p className="price-row">
                <span className="price-main">19 SAR</span>
                <span className="price-sub">/month</span>
              </p>
              <ul className="feature-list">
                <li>
                  <span className="mark mark-ok" aria-hidden="true">+</span>
                  <span>Full HTML course</span>
                </li>
                <li>
                  <span className="mark mark-ok" aria-hidden="true">+</span>
                  <span>Full CSS course</span>
                </li>
                <li>
                  <span className="mark mark-ok" aria-hidden="true">+</span>
                  <span>Full JavaScript course</span>
                </li>
                <li>
                  <span className="mark mark-ok" aria-hidden="true">+</span>
                  <span>Future course content</span>
                </li>
              </ul>
              <a href="/checkout" className="btn btn-primary plan-cta">
                Subscribe Now
              </a>
            </article>
          </div>
        </section>

        <section className="courses-section reveal">
          <div className="section-head">
            <h2 className="section-title">Courses</h2>
          </div>
          <div className="courses-grid">
            {COURSES.map((course) => (
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
                      Notify me -
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="faq-section reveal">
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
        </section>
      </main>
    </Layout>
  );
}

const FAQ_ITEMS = [
  { q: 'Do I need coding experience?', a: 'No. SaudiLab is designed for complete beginners and starts from zero.' },
  {
    q: 'What can I try for free?',
    a: 'You can access the first 3 HTML lessons for free. Full courses unlock with subscription.',
  },
  {
    q: 'Will my price change after more courses are added?',
    a: 'No. Your 19 SAR rate stays locked while your subscription is active. Re-subscribing later may use the current price.',
  },
  { q: 'Do I need to install anything?', a: 'No. All lessons and Try-It exercises run directly in your browser.' },
  {
    q: 'Are cyber security topics included?',
    a: 'Yes. Security fundamentals and applied cryptography content are planned in the learning path.',
  },
  { q: 'How do subscriptions work?', a: 'One subscription unlocks all current and upcoming premium courses.' },
];

const COURSES = [
  { title: 'HTML', description: 'Learn the structure of the web.', active: true, ctaHref: '/html/lesson1' },
  { title: 'CSS', description: 'Style and layout your websites.', active: true, ctaHref: '/css/lesson1' },
  { title: 'JavaScript', description: 'Make your websites interactive.', active: false, notify: true },
  {
    title: 'Cyber Security Essentials',
    description: 'Learn core security concepts, threats, and safe practices.',
    active: false,
    notify: true,
  },
  {
    title: 'Applied Cryptography',
    description: 'Understand encryption, hashing, and real-world crypto usage.',
    active: false,
    notify: true,
  },
  {
    title: 'Web Security',
    description: 'Learn how websites are protected against real attacks.',
    active: false,
    notify: true,
  },
  {
    title: 'Network Basics',
    description: 'Learn how the internet works: IP, DNS, HTTP/S, and routing.',
    active: false,
    notify: true,
  },
  {
    title: 'JavaScript Advanced',
    description: 'Go deeper into modern JavaScript and real projects.',
    active: false,
    notify: true,
  },
  {
    title: 'Backend Fundamentals',
    description: 'APIs, databases, authentication, and server basics.',
    active: false,
    notify: true,
  },
  {
    title: 'React Fundamentals',
    description: 'Build modern UIs with components, state, and routing.',
    active: false,
    notify: true,
  },
  {
    title: 'TypeScript Basics',
    description: 'Safer JavaScript with types, interfaces, and tooling.',
    active: false,
    notify: true,
  },
];
