import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '@site/src/utils/authState';
import { api } from '@site/src/utils/auth';

export default function PaymentSuccess() {
  const location = useLocation();
  const auth = useAuth();
  const [msg, setMsg] = useState('Confirming payment...');

  useEffect(() => {
    const run = async () => {
      try {
        if (!auth || auth.loading) return;
        if (!auth.isLoggedIn) {
          setMsg('You must be logged in.');
          return;
        }

        const params = new URLSearchParams(location.search);
        const checkoutId = params.get('id') || 'placeholder';
        // TODO: Replace with Lemon Squeezy integration
        const out = await api(`/billing/checkout/status/${encodeURIComponent(checkoutId)}`);

        if (out.paid) {
          await auth.refresh();
          setMsg('Payment confirmed. Subscription activated.');
        } else {
          setMsg('Payment status: unpaid.');
        }
      } catch (e) {
        setMsg(e.message);
      }
    };

    run();
  }, [location.search, auth?.loading, auth?.isLoggedIn]);

  return (
    <Layout title="Payment Success">
      <div style={{ padding: '2rem' }}>
        <h1>Payment</h1>
        <p>{msg}</p>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="button button--primary" to="/html/lesson4">
            Go to Lesson 4
          </Link>
          <Link className="button button--secondary" to="/account">
            Go to Account
          </Link>
        </div>
      </div>
    </Layout>
  );
}
