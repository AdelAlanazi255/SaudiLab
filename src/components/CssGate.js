import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/utils/authState';

export const CSS_FREE_MODE = true;

export default function CssGate({ children }) {
  const auth = useAuth();

  if (CSS_FREE_MODE) return <>{children}</>;
  if (typeof window === 'undefined') return <>{children}</>;
  if (!auth || auth.loading) return null;

  // CSS is subscriber-only
  if (!auth.isLoggedIn || !auth.subscribed) {
    return (
      <div style={wrap}>
        <div style={card}>
          <h1 style={title}>CSS is Subscriber Only 🔒</h1>
          <p style={text}>
            CSS course is locked for free users. Subscribe to unlock it.
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
                  Back to HTML
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

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
