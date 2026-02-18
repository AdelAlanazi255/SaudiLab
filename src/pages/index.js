import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import './homepage.css';

export default function Home() {
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
        <h1 className="fade-up hero-title">
          Saudi<span className="hero-accent">Lab</span>
        </h1>
        <p className="hero-subtitle fade-up">
          Learn web development step by step — built for Saudi learners.
        </p>

        <a href="/html/lesson1" className="fade-up start-button">
          <b>Try The HTML Lessons !</b>
        </a>
      </section>

      {/* SUBSCRIPTION SECTION */}
<section className="subscription-section reveal">
  <h2 className="subscription-title">Free vs Pro</h2>

  <div className="plans-container">
    {/* FREE PLAN */}
    <div className="plan-card reveal">
      <h3>Free</h3>
      

      <ul className="plan-features">
        <li>✅ First 3 HTML lessons</li>
        <li>❌ Full HTML course</li>
        <li>❌ CSS course</li>
        <li>❌ JavaScript course</li>
      </ul>
    </div>

    {/* PRO PLAN */}
    <div className="plan-card highlight reveal">
      <h1>Pro</h1>
      <p className="price">
        14.99ريال <span>/month</span>
      </p>

      <ul className="plan-features">
        <li>✅ Full HTML course</li>
        <li>✅ Full CSS course</li>
        <li>✅ Full JavaScript course</li>
        <li>✅ Future course content</li>
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
      <section className="simple-section reveal">
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
            <h3>CSS 🔒</h3>
            <p>Style and layout your websites.</p>
            <span className="coming-soon">Coming soon</span>
          </div>

          <div className="info-card locked reveal">
            <h3>JavaScript 🔒</h3>
            <p>Make your websites interactive.</p>
            <span className="coming-soon">Coming soon</span>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="simple-section reveal">
        <h2 className="section-title">FAQ</h2>
        <div className="faq">
          <div className="faq-item reveal">
            <h4>Do I need coding experience?</h4>
            <p>No. The lessons start from zero.</p>
          </div>

          <div className="faq-item reveal">
            <h4>Can I try before paying?</h4>
            <p>Yes. The first 3 lessons are completely free.</p>
          </div>

          <div className="faq-item reveal">
            <h4>Do I need to install anything?</h4>
            <p>No. Everything runs in your browser.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
