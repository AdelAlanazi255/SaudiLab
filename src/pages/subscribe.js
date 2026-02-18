import React from 'react';
import Layout from '@theme/Layout';
import { activateSubscription } from '@site/src/utils/subscription';

export default function Subscribe() {
  const handleSubscribe = () => {
    activateSubscription();
    window.location.href = '/html/lesson4';
  };

  return (
    <Layout title="Subscribe">
      <div style={{ maxWidth: 700, margin: '4rem auto', textAlign: 'center' }}>
        <h1>Unlock Full Course</h1>
        <p style={{ fontSize: '1.2rem' }}>
          Get access to all lessons and future courses.
        </p>

        <div
          style={{
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 12,
            padding: '2rem',
            marginTop: '2rem',
          }}
        >
          <h2>Full Access</h2>
          <p style={{ fontSize: '2rem', fontWeight: 900 }}>14.99ريال/month</p>

          <button
            onClick={handleSubscribe}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'black',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </Layout>
  );
}
