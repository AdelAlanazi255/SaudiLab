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
          <a href="/#courses" className="secondary-button">
            Explore Courses
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


      {/* HOW IT WORKS SECTION */}
      <section id="courses" className="simple-section reveal">
        <h2 className="section-title">How It Works</h2>
        <div className="three-grid">
          <div className="info-card reveal">
            <h3>1. Start Free</h3>
            <p>Try the first 3 HTML lessons with the built-in editor.</p>
          </div>
          <div className="info-card reveal">
            <h3>2. Subscribe</h3>
            <p>Unlock the full course and continue learning.</p>
          </div>
          <div className="info-card reveal">
            <h3>3. Build Skills</h3>
            <p>Practice directly in the browser with real code.</p>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="simple-section reveal">
        <h2 className="section-title">Courses</h2>
        <div className="three-grid">
          <div className="info-card reveal">
            <h3>HTML</h3>
            <p>Learn the structure of the web.</p>
            <a href="/html/lesson1" className="mini-button">
              Start
            </a>
          </div>

          <div className="info-card locked reveal">
            <h3><span dir="ltr" style={{ unicodeBidi: 'isolate' }}>CSS</span></h3>
            <p>Style and layout your websites.</p>
            <a href="/css/lesson1" className="mini-button">
              Start
            </a>
          </div>

          <div className="info-card locked reveal">
            <h3><span dir="ltr" style={{ unicodeBidi: 'isolate' }}>JavaScript</span></h3>
            <p>Make your websites interactive.</p>
            <span className="coming-soon">Coming soon</span>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>Cyber Security Essentials</h3>
            <p>Learn core security concepts, threats, and safe practices.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>Applied Cryptography</h3>
            <p>Understand encryption, hashing, and real-world crypto usage.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>Web Security</h3>
            <p>Learn how websites are protected against real attacks.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>Network Basics</h3>
            <p>Learn how the internet works: IP, DNS, HTTP/S, and routing.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>JavaScript Advanced</h3>
            <p>Go deeper into modern JavaScript and real projects.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>Backend Fundamentals</h3>
            <p>APIs, databases, authentication, and server basics.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>React Fundamentals</h3>
            <p>Build modern UIs with components, state, and routing.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>

          <div className="info-card locked reveal" style={{ position: 'relative' }}>
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
            <h3>TypeScript Basics</h3>
            <p>Safer JavaScript with types, interfaces, and tooling.</p>
            <span className="coming-soon">Coming soon</span>
            <a href="/account" style={{ marginTop: '0.42rem', fontSize: '0.86rem', opacity: 0.8, textDecoration: 'none' }}>
              Notify me →
            </a>
          </div>
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
    a: 'You can access the first lessons for free. Full courses unlock with subscription.',
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
