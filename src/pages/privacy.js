import React from 'react';
import Layout from '@theme/Layout';

export default function Privacy() {
  return (
    <Layout title="Privacy Policy">
      <div style={pageWrap}>
        <h1>Privacy Policy</h1>
        <div style={legalCard}>
          <p>SaudiLab collects basic account information such as username, email, and learning activity.</p>
          <p>We use this information to provide lessons, manage subscriptions, and improve the platform.</p>
          <p>Payments are handled by a secure third-party provider. SaudiLab does not store card details.</p>
          <p>We apply reasonable security measures to protect personal data.</p>
          <p>
            For privacy questions, contact <a href="mailto:support@saudilab.io">support@saudilab.io</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}

const pageWrap = {
  padding: '3rem 1.5rem',
  maxWidth: 900,
  margin: '0 auto',
};

const legalCard = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14,
  background: 'rgba(255,255,255,0.03)',
  padding: '1.2rem 1.25rem',
  display: 'grid',
  gap: '0.75rem',
};
