import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '@site/src/utils/authState';
import { buildAuthHref } from '@site/src/utils/nextPath';

function isTryPath(pathname = '') {
  const clean = String(pathname || '').split(/[?#]/)[0] || '';
  return /\/try\/?$/i.test(clean);
}

export default function RequireTryAuthRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();
  const pathname = location?.pathname || '/';
  const search = location?.search || '';
  const hash = location?.hash || '';
  const protectedRoute = isTryPath(pathname);

  useEffect(() => {
    if (!protectedRoute) return;
    if (auth?.loading) return;
    if (auth?.isLoggedIn) return;

    const target = buildAuthHref('/login', `${pathname}${search}${hash}` || '/');
    window.location.replace(target);
  }, [protectedRoute, auth?.loading, auth?.isLoggedIn, pathname, search, hash]);

  if (!protectedRoute) return children;

  if (auth?.loading) {
    return (
      <main style={wrapStyle}>
        <div style={cardStyle}>Loading...</div>
      </main>
    );
  }

  if (auth?.isLoggedIn) return children;

  const loginHref = buildAuthHref('/login', `${pathname}${search}${hash}` || '/');
  const signupHref = buildAuthHref('/signup', `${pathname}${search}${hash}` || '/');

  return (
    <main style={wrapStyle}>
      <section style={cardStyle}>
        <h1 style={titleStyle}>Sign in required</h1>
        <p style={textStyle}>Create a free account to start lessons and track progress.</p>
        <div style={actionsStyle}>
          <Link to={loginHref} className="sl-btn-primary">Log in</Link>
          <Link to={signupHref} className="sl-btn-ghost">Sign up</Link>
        </div>
      </section>
    </main>
  );
}

const wrapStyle = {
  minHeight: 'calc(100vh - 64px)',
  display: 'grid',
  placeItems: 'center',
  padding: '2rem 1rem',
};

const cardStyle = {
  width: '100%',
  maxWidth: 560,
  padding: '1.5rem',
  borderRadius: 16,
  border: '1px solid var(--sl-border)',
  background: 'linear-gradient(180deg, var(--sl-surface), var(--sl-surface-2))',
  boxShadow: 'var(--sl-shadow)',
};

const titleStyle = {
  marginTop: 0,
  marginBottom: '0.6rem',
  fontWeight: 900,
};

const textStyle = {
  marginTop: 0,
  marginBottom: '1rem',
  color: 'var(--sl-muted)',
};

const actionsStyle = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
};
