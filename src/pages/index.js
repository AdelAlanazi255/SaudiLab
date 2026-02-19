import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import './homepage.css';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Smooth reveal on scroll (one-way)
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in-view');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="hero-section reveal">
        <div className="hero-badge fade-up">SaudiLab - Built for Arabic Learners</div>
        <h1 className="fade-up hero-title">
          Your Gateway to Coding & Cyber Security
        </h1>
        <p className="hero-subtitle fade-up">
          Learn HTML, CSS, and security fundamentals through structured lessons, real examples,
          and interactive Try-It exercises.
        </p>

        <div className="hero-cta-row fade-up">
          <a href="/html/lesson1" className="start-button">
            <b>Start Learning</b>
          </a>
          
        </div>
      </section>

      {/* SUBSCRIPTION SECTION */}
<section className="subscription-section reveal">
  <h2 className="subscription-title">Free vs Pro</h2>

  <div className="plans-container">
    {/* FREE PLAN */}
    <div className="plan-card reveal">
      <h3>Free</h3>
      

      <ul className="plan-features">
        <li><span role="img" aria-label="included">✓</span> First 3 HTML lessons</li>
        <li><span role="img" aria-label="not included">✕</span> Full HTML course</li>
        <li><span role="img" aria-label="not included">✕</span> CSS course</li>
        <li><span role="img" aria-label="not included">✕</span> JavaScript course</li>
      </ul>
    </div>

    {/* PRO PLAN */}
    <div className="plan-card highlight reveal">
      <h1>Pro</h1>
      <p className="price">
        19 SAR <span>/month</span>
      </p>

      <ul className="plan-features">
        <li><span role="img" aria-label="included">✓</span> Full HTML course</li>
        <li><span role="img" aria-label="included">✓</span> Full CSS course</li>
        <li><span role="img" aria-label="included">✓</span> Full JavaScript course</li>
        <li><span role="img" aria-label="included">✓</span> Future course content</li>
      </ul>

      <a
  href="/checkout"
  style={{
    display: 'inline-block',
    marginTop: '1.2rem',
    padding: '0.85rem 1.4rem',
    borderRadius: '12px',
    background: '#7cf2b0',
    color: '#0b0f14',
    fontWeight: 900,
    textDecoration: 'none',
    border: '2px solid #7cf2b0',
    boxShadow: '0 0 0 0 rgba(124,242,176,0.4)',
    transition: 'all 0.2s ease',
  }}
  className="pro-cta"
>
  Subscribe Now
</a>

    </div>
  </div>
</section>


     

      {/* COURSES SECTION */}
      <section className="simple-section courses-section reveal">
        <h2 className="section-title">Courses</h2>
        <div className="three-grid">
          {COURSES.map((course) => (
            <div
              key={course.title}
              className={`info-card courseCard ${course.active ? 'courseCard--active' : 'courseCard--inactive'} ${course.active ? '' : 'locked'} reveal`}
              style={course.notify ? { position: 'relative' } : undefined}
            >
              {course.notify ? (
                <span
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.45rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    opacity: 0.75,
                  }}
                >
                  Soon
                </span>
              ) : null}
              <h3>
                {course.ltr ? <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{course.title}</span> : course.title}
              </h3>
              <p>{course.description}</p>
              {course.ctaHref ? (
                <a href={course.ctaHref} className="mini-button">
                  Start
                </a>
              ) : null}
              {!course.ctaHref ? <span className="coming-soon">Coming soon</span> : null}
              {course.notify ? (
                <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
                  Notify me →
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="simple-section reveal" style={faqSection}>
        <h2 className="section-title" style={faqTitle}>FAQ</h2>
        <div style={faqList}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <article
                key={item.q}
                className="reveal"
                style={{ ...faqCard, ...(isOpen ? faqCardOpen : null) }}
                onMouseEnter={(e) => {
                  if (!isOpen) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                  e.currentTarget.style.background = isOpen ? 'rgba(255,255,255,0.065)' : 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = isOpen ? 'rgba(255,255,255,0.065)' : 'rgba(255,255,255,0.04)';
                }}
              >
                <h3 style={faqHeadingWrap}>
                  <button
                    type="button"
                    style={faqQuestionButton}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  >
                    <span style={faqQuestion}>{item.q}</span>
                    <span style={faqIcon} aria-hidden="true">{isOpen ? '-' : '+'}</span>
                  </button>
                </h3>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-hidden={!isOpen}
                  style={{
                    ...faqAnswerWrap,
                    maxHeight: isOpen ? 220 : 0,
                    opacity: isOpen ? 0.85 : 0,
                    marginTop: isOpen ? '0.55rem' : 0,
                  }}
                >
                  <p style={faqAnswer}>{item.a}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}

const FAQ_ITEMS = [
  {
    q: 'Do I need coding experience?',
    a: 'No. SaudiLab is designed for complete beginners and starts from zero.',
  },
  {
    q: 'What can I try for free?',
    a: 'You can access the first 3 HTML lessons for free. Full courses unlock with subscription.',
  },
  {
    q: 'Will my price change after more courses are added?',
    a: 'No. Your 19 SAR rate stays locked in while your subscription is active. If you cancel and re-subscribe later, you may be charged the current price.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. All lessons and Try-It exercises run directly in your browser.',
  },
  {
    q: 'Are cyber security topics included?',
    a: 'Yes. Security fundamentals and applied cryptography content are planned as part of the learning path.',
  },
  {
    q: 'How do subscriptions work?',
    a: 'One subscription unlocks all current and upcoming premium courses.',
  },
];

const COURSES = [
  {
    title: 'HTML',
    description: 'Learn the structure of the web.',
    active: true,
    ctaHref: '/html/lesson1',
  },
  {
    title: 'CSS',
    description: 'Style and layout your websites.',
    active: true,
    ctaHref: '/css/lesson1',
    ltr: true,
  },
  {
    title: 'JavaScript',
    description: 'Make your websites interactive.',
    active: false,
    ltr: true,
    notify: true,
  },
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

const faqSection = {
  paddingTop: '1rem',
  paddingBottom: '3.4rem',
};

const faqTitle = {
  fontSize: '2.1rem',
  fontWeight: 900,
  marginBottom: '1.4rem',
};

const faqList = {
  width: '100%',
  maxWidth: 850,
  margin: '0 auto',
  display: 'grid',
  gap: '0.75rem',
};

const faqCard = {
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  padding: '0.9rem 1rem',
  transition: 'background 0.2s ease, border-color 0.2s ease',
};

const faqCardOpen = {
  borderColor: 'rgba(124, 242, 176, 0.32)',
  background: 'rgba(255,255,255,0.065)',
};

const faqHeadingWrap = {
  margin: 0,
};

const faqQuestionButton = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.85rem',
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  padding: 0,
};

const faqQuestion = {
  margin: 0,
  color: '#ffffff',
  fontSize: '1.02rem',
  fontWeight: 800,
  lineHeight: 1.4,
};

const faqIcon = {
  width: 22,
  flexShrink: 0,
  textAlign: 'center',
  color: '#ffffff',
  opacity: 0.9,
  fontSize: '1.15rem',
  fontWeight: 700,
};

const faqAnswerWrap = {
  overflow: 'hidden',
  transition: 'max-height 0.24s ease, opacity 0.24s ease, margin-top 0.24s ease',
};

const faqAnswer = {
  margin: 0,
  color: '#e5e8ee',
  fontSize: '0.95rem',
  fontWeight: 500,
  lineHeight: 1.7,
};
