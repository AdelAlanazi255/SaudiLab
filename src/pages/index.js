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

        <a href="/docs/lesson1" className="fade-up start-button">
          Try out FREE 3 HTML Lessons!
        </a>
      </section>

      {/* SUBSCRIPTION SECTION */}
      <section className="subscription-section reveal">
        <h2 className="subscription-title">Choose Your Plan</h2>

        <div className="plans-container">
          <div className="plan-card reveal">
            <h3>Student</h3>
            <p className="price">
              $1<span>/month</span>
            </p>
            <button className="plan-button">Subscribe</button>
          </div>

          <div className="plan-card reveal">
            <h3>Normal User</h3>
            <p className="price">
              $1<span>/month</span>
            </p>
            <button className="plan-button">Subscribe</button>
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
            <a href="/docs/lesson1" className="mini-button">
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
