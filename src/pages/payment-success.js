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
        const paymentId = params.get('id') || params.get('payment_id');
        const status = params.get('status'); // optional

        if (!paymentId) {
          setMsg('Missing payment id.');
          return;
        }

        // ✅ finalize: backend verifies with Moyasar + activates subscription
        const out = await api('/billing/moyasar/finalize', {
          method: 'POST',
          body: JSON.stringify({ id: paymentId }),
        });

        if (out.paid) {
          await auth.refresh();
          setMsg('Payment confirmed ✅ Subscription activated.');
        } else {
          setMsg(`Payment status: ${out.status || status || 'unknown'}.`);
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
