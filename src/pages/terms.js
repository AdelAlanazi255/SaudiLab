import React from 'react';
import Layout from '@theme/Layout';

export default function Terms() {
  return (
    <Layout title="Terms of Service">
      <div style={pageWrap}>
        <h1>Terms of Service</h1>
        <div style={legalCard}>
          <p>By using SaudiLab, you agree to these terms.</p>
          <p>SaudiLab provides online educational content. Some lessons are free and some require a paid subscription.</p>
          <p>You are responsible for your account security and for keeping your account information accurate.</p>
          <p>Paid content requires an active subscription. Payments are processed by a secure third-party provider.</p>
          <p>You may not copy, redistribute, or resell SaudiLab content without permission.</p>
          <p>SaudiLab may update these terms over time. Continued use means you accept the latest version.</p>
          <p>
            For questions, contact <a href="mailto:support@saudilab.io">support@saudilab.io</a>.
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
