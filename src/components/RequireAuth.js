import React, { useEffect } from 'react';
import { useAuth } from '@site/src/utils/authState';

export default function RequireAuth({ children }) {
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.loading && !auth?.isLoggedIn) {
      window.location.href = '/login';
    }
  }, [auth?.loading, auth?.isLoggedIn]);

  if (!auth?.loading && !auth?.isLoggedIn) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Redirecting to login...</div>;
  }

  if (auth?.loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return children;
}
