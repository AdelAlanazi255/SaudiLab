import React from 'react';
import Layout from '@theme/Layout';

export default function Refund() {
  return (
    <Layout title="Refund Policy">
      <div style={pageWrap}>
        <h1>Refund Policy</h1>
        <div style={legalCard}>
          <p>SaudiLab provides instant access to digital learning content.</p>
          <p>All purchases and subscriptions are non-refundable once access is granted.</p>
          <p>Refunds are only issued for billing errors or duplicate charges.</p>
          <p>
            For billing support, contact <a href="mailto:support@saudilab.io">support@saudilab.io</a>.
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
