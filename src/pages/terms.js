import React from 'react';
import Layout from '@theme/Layout';

export default function Terms() {
  return (
    <Layout title="Terms of Service">
      <div style={{ padding: '3rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <h1>Terms of Service</h1>

        <p>
          Welcome to SaudiLab. By using this website, you agree to the following terms.
        </p>

        <h2>1. Service</h2>
        <p>
          SaudiLab provides online educational content for web development.
          Some content is free, while other lessons require a paid subscription.
        </p>

        <h2>2. Accounts</h2>
        <p>
          You are responsible for maintaining the security of your account.
          You must provide accurate information during registration.
        </p>

        <h2>3. Payments</h2>
        <p>
          Paid lessons require an active subscription.
          Payments are processed securely through a third-party payment provider.
        </p>

        <h2>4. Usage</h2>
        <p>
          You may not copy, redistribute, or resell any content from SaudiLab
          without permission.
        </p>

        <h2>5. Changes</h2>
        <p>
          SaudiLab may update these terms at any time. Continued use of the
          website means you accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          For any questions, contact: support@saudilab.io
        </p>
      </div>
    </Layout>
  );
}
