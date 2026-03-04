import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '@site/src/utils/authState';
import { isAdminOnlyCoursePath } from '@site/src/utils/adminCourseAccess';

export default function RequireAdminRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();
  const pathname = location?.pathname || '/';
  const protectedRoute = isAdminOnlyCoursePath(pathname);

  if (!protectedRoute) return children;

  if (auth?.loading) {
    return (
      <main style={wrapStyle}>
        <div style={cardStyle}>Loading...</div>
      </main>
    );
  }

  if (auth?.isLoggedIn && auth?.profile?.role === 'admin') {
    return children;
  }

  return (
    <main style={wrapStyle}>
      <section style={cardStyle}>
        <h1 style={titleStyle}>Unauthorized</h1>
        <p style={textStyle}>You don&apos;t have access to this course yet.</p>
        <Link to="/" className="sl-btn-primary">
          Go back home
        </Link>
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
