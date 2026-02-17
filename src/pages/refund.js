import React from 'react';
import Layout from '@theme/Layout';

export default function Refund() {
  return (
    <Layout title="Refund Policy">
      <div style={{ padding: '3rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <h1>Refund Policy</h1>

        <p>
          SaudiLab aims to provide high-quality educational content.
        </p>

        <h2>Subscription Refunds</h2>
        <p>
          Subscription payments are generally non-refundable once access
          has been granted.
        </p>

        <p>
          However, refund requests may be reviewed on a case-by-case basis
          within 7 days of purchase.
        </p>

        <h2>Contact</h2>
        <p>
          To request a refund, contact: support@saudilab.io
        </p>
      </div>
    </Layout>
  );
}
