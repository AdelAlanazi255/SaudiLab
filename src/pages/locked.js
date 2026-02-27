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

  if (/^\/(html|css|javascript|cse|crypto|cryptography|web-security|network-basics|pcs|ethics|kali-tools|kali|forensics|blueteam|career)\/lesson\d+$/i.test(cleaned)) {
    const m = cleaned.match(/lesson\d+$/i);
    if (String(cleaned).toLowerCase().startsWith('/cse/') && m) {
      return `/cse/${m[0].toLowerCase()}`;
    }
    return cleaned.toLowerCase();
  }

  if (/^lesson\d+$/i.test(cleaned)) {
    const lowerNext = String(nextPath || '').toLowerCase();
    const course = lowerNext.startsWith('/css/')
      ? 'css'
      : lowerNext.startsWith('/javascript/')
        ? 'javascript'
      : lowerNext.startsWith('/cse/')
          ? 'cse'
        : lowerNext.startsWith('/crypto/') || lowerNext.startsWith('/cryptography/')
          ? 'crypto'
          : lowerNext.startsWith('/web-security/')
            ? 'websecurity'
            : lowerNext.startsWith('/network-basics/')
              ? 'networkbasics'
                : lowerNext.startsWith('/pcs/')
                  ? 'pcs'
                : lowerNext.startsWith('/ethics/')
                  ? 'ethics'
                  : lowerNext.startsWith('/kali-tools/') || lowerNext.startsWith('/kali/')
                    ? 'kalitools'
                    : lowerNext.startsWith('/forensics/')
                      ? 'forensics'
                      : lowerNext.startsWith('/blueteam/')
                        ? 'blueteam'
                        : lowerNext.startsWith('/career/')
                          ? 'career'
                          : 'html';
    if (course === 'cse') return `/cse/${cleaned.toLowerCase()}`;
    if (course === 'crypto') return `/cryptography/${cleaned.toLowerCase()}`;
    if (course === 'websecurity') return `/web-security/${cleaned.toLowerCase()}`;
    if (course === 'networkbasics') return `/network-basics/${cleaned.toLowerCase()}`;
    if (course === 'pcs') return `/pcs/${cleaned.toLowerCase()}`;
    if (course === 'ethics') return `/ethics/${cleaned.toLowerCase()}`;
    if (course === 'kalitools') return `/kali/${cleaned.toLowerCase()}`;
    if (course === 'forensics') return `/forensics/${cleaned.toLowerCase()}`;
    if (course === 'blueteam') return `/blueteam/${cleaned.toLowerCase()}`;
    if (course === 'career') return `/career/${cleaned.toLowerCase()}`;
    return `/${course}/${cleaned.toLowerCase()}`;
  }

  const lowerNext = String(nextPath || '').toLowerCase();
  if (lowerNext.startsWith('/css/')) return '/css/lesson1';
  if (lowerNext.startsWith('/javascript/')) return '/javascript/lesson1';
  if (lowerNext.startsWith('/cse/')) return '/cse/lesson1';
  if (lowerNext.startsWith('/crypto/') || lowerNext.startsWith('/cryptography/')) return '/cryptography/lesson1';
  if (lowerNext.startsWith('/web-security/')) return '/web-security/lesson1';
  if (lowerNext.startsWith('/network-basics/')) return '/network-basics/lesson1';
  if (lowerNext.startsWith('/pcs/')) return '/pcs/lesson1';
  if (lowerNext.startsWith('/ethics/')) return '/ethics/lesson1';
  if (lowerNext.startsWith('/kali-tools/') || lowerNext.startsWith('/kali/')) return '/kali/lesson1';
  if (lowerNext.startsWith('/forensics/')) return '/forensics/lesson1';
  if (lowerNext.startsWith('/blueteam/')) return '/blueteam/lesson1';
  if (lowerNext.startsWith('/career/')) return '/career/lesson1';
  return '/html/lesson1';
}

function lessonLabel(needPath) {
  const m = String(needPath).match(/lesson(\d+)$/i);
  return m ? `Lesson ${m[1]}` : 'Lesson 1';
}

function courseStart(needPath, nextPath) {
  const lowerNeed = String(needPath || '').toLowerCase();
  const lowerNext = String(nextPath || '').toLowerCase();
  if (lowerNeed.startsWith('/css/') || lowerNext.startsWith('/css/')) {
    return '/css/lesson1';
  }
  if (lowerNeed.startsWith('/javascript/') || lowerNext.startsWith('/javascript/')) {
    return '/javascript/lesson1';
  }
  if (lowerNeed.startsWith('/cse/') || lowerNext.startsWith('/cse/')) {
    return '/cse/lesson1';
  }
  if (
    lowerNeed.startsWith('/crypto/')
    || lowerNeed.startsWith('/cryptography/')
    || lowerNext.startsWith('/crypto/')
    || lowerNext.startsWith('/cryptography/')
  ) {
    return '/cryptography/lesson1';
  }
  if (lowerNeed.startsWith('/web-security/') || lowerNext.startsWith('/web-security/')) {
    return '/web-security/lesson1';
  }
  if (lowerNeed.startsWith('/network-basics/') || lowerNext.startsWith('/network-basics/')) {
    return '/network-basics/lesson1';
  }
  if (lowerNeed.startsWith('/pcs/') || lowerNext.startsWith('/pcs/')) {
    return '/pcs/lesson1';
  }
  if (lowerNeed.startsWith('/ethics/') || lowerNext.startsWith('/ethics/')) {
    return '/ethics/lesson1';
  }
  if (lowerNeed.startsWith('/kali-tools/') || lowerNeed.startsWith('/kali/') || lowerNext.startsWith('/kali-tools/') || lowerNext.startsWith('/kali/')) {
    return '/kali/lesson1';
  }
  if (lowerNeed.startsWith('/forensics/') || lowerNext.startsWith('/forensics/')) {
    return '/forensics/lesson1';
  }
  if (lowerNeed.startsWith('/blueteam/') || lowerNext.startsWith('/blueteam/')) {
    return '/blueteam/lesson1';
  }
  if (lowerNeed.startsWith('/career/') || lowerNext.startsWith('/career/')) {
    return '/career/lesson1';
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
