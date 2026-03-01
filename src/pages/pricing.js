import React from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '@site/src/utils/authState';
import PricingPlansSection from '@site/src/components/PricingPlansSection';
import './homepage.css';

export default function PricingPage() {
  const auth = useAuth();
  const isLoggedIn = auth?.isLoggedIn === true;
  const isSubscribed = auth?.subscribed === true;
  const showPricing = !isSubscribed;
  const pricingCtaHref = isLoggedIn ? '/checkout' : '/login';
  const pricingCtaLabel = isLoggedIn ? 'Subscribe Now' : 'Log in';

  return (
    <Layout title="Pricing">
      <main className="home-page">
        {showPricing ? (
          <PricingPlansSection pricingCtaHref={pricingCtaHref} pricingCtaLabel={pricingCtaLabel} />
        ) : (
          <section className="pricing-section">
            <div className="section-head">
              <h2 className="section-title">Free vs Pro</h2>
            </div>
            <div className="plan-card plan-card-pro" style={{ maxWidth: 720, margin: '0 auto' }}>
              <h3 className="plan-name">You are on Pro</h3>
              <p style={{ margin: 0, opacity: 0.85 }}>
                Your subscription is active. You already have access to all current premium courses.
              </p>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
