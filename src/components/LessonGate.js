import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';
import { isCompleted } from '@site/src/utils/progress';

export default function LessonGate({ requireLessonId, paid = false, children }) {
  const auth = useAuth();

  // Always allow during SSR build safely (prevents weird build crashes)
  if (typeof window === 'undefined') return <>{children}</>;

  // While auth is loading, don't flicker
  if (!auth || auth.loading) return null;

  // Step prerequisite gate (ex: must finish lesson3)
  if (requireLessonId && !isCompleted(requireLessonId)) {
    return (
      <div style={wrap}>
        <div style={card}>
          <h1 style={title}>Lesson Locked</h1>
          <p style={text}>
            You need to complete <b>{requireLessonId}</b> first.
          </p>

          <div style={row}>
            <Link to={`/html/${requireLessonId}`} style={primaryLink}>
              Go to required lesson →
            </Link>
            <Link to="/account" style={ghostLink}>
              Go to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Paid gate (HTML lessons 4-10)
  if (paid && (!auth.isLoggedIn || !auth.subscribed)) {
    return (
      <div style={wrap}>
        <div style={card}>
          <h1 style={title}>Subscriber Only 🔒</h1>
          <p style={text}>
            This lesson is part of the paid course. Subscribe to unlock Lessons 4–10.
          </p>

          <div style={row}>
            {!auth.isLoggedIn ? (
              <>
                <Link to="/login" style={primaryLink}>
                  Login →
                </Link>
                <Link to="/signup" style={ghostLink}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/account" style={primaryLink}>
                  Upgrade on Account →
                </Link>
                <Link to="/html/lesson1" style={ghostLink}>
                  Back to free lessons
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Allowed
  return <>{children}</>;
}

const wrap = {
  padding: '3.5rem 1.25rem',
  display: 'grid',
  placeItems: 'center',
};

const card = {
  width: '100%',
  maxWidth: 860,
  padding: '1.6rem',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.35)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(124, 242, 176, 0.08)',
};

const title = {
  margin: 0,
  fontWeight: 950,
  fontSize: '2rem',
};

const text = {
  marginTop: '0.6rem',
  opacity: 0.85,
  lineHeight: 1.6,
};

const row = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  marginTop: '1.2rem',
};

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
