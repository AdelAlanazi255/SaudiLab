import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

function normalizeNeed(raw) {
  let s = String(raw || 'lesson1').trim();

  // remove query-ish stuff if someone passed a full URL accidentally
  s = s.split('?')[0].split('#')[0];

  // strip leading slashes
  s = s.replace(/^\/+/, '');

  // if they passed "docs/..." strip it
  if (s.startsWith('docs/')) s = s.slice('docs/'.length);

  // if they passed "html/lessonX" keep it, otherwise build it
  if (s.startsWith('html/')) return `/${s}`;

  // if they passed just "lessonX"
  if (/^lesson\d+$/i.test(s)) return `/html/${s.toLowerCase()}`;

  // fallback
  return '/html/lesson1';
}

function labelFromPath(path) {
  // "/html/lesson4" -> "lesson4"
  const parts = String(path || '').split('/');
  return parts[parts.length - 1] || 'lesson1';
}

export default function Locked() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const needRaw = params.get('need') || 'lesson1';

  const needPath = normalizeNeed(needRaw);
  const needLabel = labelFromPath(needPath);

  return (
    <Layout title="Locked">
      <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontWeight: 900, marginBottom: '0.75rem' }}>Lesson Locked</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
          You need to complete <b>{needLabel}</b> before accessing this lesson.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link
            to={needPath}
            style={{
              padding: '0.75rem 1.2rem',
              borderRadius: 10,
              background: 'black',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 900,
            }}
          >
            Go to {needLabel}
          </Link>

          <Link
            to="/html/lesson1"
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
