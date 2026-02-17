import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

export default function Locked() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const need = params.get('need') || 'lesson1';

  return (
    <Layout title="Locked">
      <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontWeight: 900, marginBottom: '0.75rem' }}>Lesson Locked</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
          You need to complete <b>{need}</b> before accessing this lesson.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link
            to={`/docs/${need}`}
            style={{
              padding: '0.75rem 1.2rem',
              borderRadius: 10,
              background: 'black',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 900,
            }}
          >
            Go to {need}
          </Link>

          <Link
            to="/docs/lesson1"
            style={{
              padding: '0.75rem 1.2rem',
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.2)',
              background: 'white',
              color: 'black',
              textDecoration: 'none',
              fontWeight: 900,
            }}
          >
            Start at Lesson 1
          </Link>
        </div>
      </div>
    </Layout>
  );
}
