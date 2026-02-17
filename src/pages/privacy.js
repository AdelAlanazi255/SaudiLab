import React from 'react';
import Layout from '@theme/Layout';

export default function Privacy() {
  return (
    <Layout title="Privacy Policy">
      <div style={{ padding: '3rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <h1>Privacy Policy</h1>

        <p>
          SaudiLab respects your privacy and is committed to protecting your
          personal information.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>Username</li>
          <li>Email address</li>
          <li>Account activity</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide access to lessons</li>
          <li>To manage subscriptions</li>
          <li>To improve the platform</li>
        </ul>

        <h2>3. Payments</h2>
        <p>
          Payments are processed by a secure third-party payment provider.
          SaudiLab does not store card information.
        </p>

        <h2>4. Data Protection</h2>
        <p>
          We use reasonable security measures to protect your data.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy concerns, contact: support@saudilab.io
        </p>
      </div>
    </Layout>
  );
}
