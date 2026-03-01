import React from 'react';

export default function PricingPlansSection({ pricingCtaHref, pricingCtaLabel, className = '', sectionId = 'pricing' }) {
  return (
    <section id={sectionId} className={`pricing-section ${className}`.trim()}>
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
          <a href={pricingCtaHref} className="btn btn-primary plan-cta">
            {pricingCtaLabel}
          </a>
        </article>
      </div>
    </section>
  );
}
