import React from 'react';
import { useAuth } from '@site/src/utils/authState';

export default function LessonGate({ paid = false, children }) {
  const auth = useAuth();

  if (!paid) return <>{children}</>;

  if (!auth) return <>{children}</>; // safety fallback
  if (auth.loading) return null;

  if (!auth.isLoggedIn) {
    return (
      <div style={box}>
        <h2 style={{ margin: 0 }}>Locked</h2>
        <p style={{ opacity: 0.8, marginTop: 10 }}>Please log in to access paid lessons.</p>
      </div>
    );
  }

  if (!auth.subscribed) {
    return (
      <div style={box}>
        <h2 style={{ margin: 0 }}>Subscribers only</h2>
        <p style={{ opacity: 0.8, marginTop: 10 }}>Subscribe to unlock Lessons 4–10.</p>
      </div>
    );
  }

  return <>{children}</>;
}

const box = {
  padding: '1.2rem',
  border: '1px solid #222',
  borderRadius: 12,
  background: '#0b0f14',
};
