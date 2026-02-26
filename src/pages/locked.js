import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

function safePath(path) {
  if (!path || typeof path !== 'string') return null;
  if (!path.startsWith('/')) return null;
  return path;
}

function parseNeed(needRaw, nextPath) {
  const cleaned = String(needRaw || '').trim().split('?')[0].split('#')[0];

  if (/^\/(html|css)\/lesson\d+$/i.test(cleaned)) {
    return cleaned.toLowerCase();
  }

  if (/^lesson\d+$/i.test(cleaned)) {
    const course = nextPath?.startsWith('/css/') ? 'css' : 'html';
    return `/${course}/${cleaned.toLowerCase()}`;
  }

  return nextPath?.startsWith('/css/') ? '/css/lesson1' : '/html/lesson1';
}

function lessonLabel(needPath) {
  const m = String(needPath).match(/lesson(\d+)$/i);
  return m ? `Lesson ${m[1]}` : 'Lesson 1';
}

function courseStart(needPath, nextPath) {
  if (String(needPath).startsWith('/css/') || String(nextPath || '').startsWith('/css/')) {
    return '/css/lesson1';
  }
  return '/html/lesson1';
}

export default function LockedPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search || '');

  const nextPath = safePath(params.get('next'));
  const needPath = parseNeed(params.get('need'), nextPath);
  const needLabel = lessonLabel(needPath);
  const backToStart = courseStart(needPath, nextPath);
  const primaryHref = nextPath ? `${needPath}?next=${encodeURIComponent(nextPath)}` : needPath;

  return (
    <Layout title="Lesson locked">
      <main style={{ maxWidth: 820, margin: '4rem auto', padding: '0 1.25rem' }}>
        <h1 style={{ margin: 0, fontWeight: 900, fontSize: '2rem' }}>Lesson locked</h1>
        <p style={{ marginTop: '0.75rem', marginBottom: 0, lineHeight: 1.6 }}>
          To access this lesson, complete {needLabel} first.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.4rem' }}>
          <Link to={primaryHref} style={primaryLink}>
            Go to {needLabel}
          </Link>
          <Link to={backToStart} style={ghostLink}>
            Back to course start
          </Link>
        </div>
      </main>
    </Layout>
  );
}

const primaryLink = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: 'none',
  fontWeight: 950,
  cursor: 'pointer',
  background: '#7cf2b0',
  color: '#0b0f14',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const ghostLink = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 950,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.92)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};
