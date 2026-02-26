import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { isCompleted, markCompleted, COURSE_EVENT } from '@site/src/utils/progress';

function sanitizeNextPath(value) {
  if (!value || typeof value !== 'string') return null;
  if (!value.startsWith('/')) return null;
  if (value.startsWith('/locked')) return null;
  return value;
}

export default function CompleteButton({ lessonId, course = 'html' }) {
  const [done, setDone] = useState(false);
  const [nextPath, setNextPath] = useState(null);

  useEffect(() => {
    setDone(isCompleted(lessonId, course));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setNextPath(sanitizeNextPath(params.get('next')));
    }

    const onProgress = () => setDone(isCompleted(lessonId, course));

    if (typeof window !== 'undefined') {
      window.addEventListener(COURSE_EVENT, onProgress);
      window.addEventListener('storage', onProgress);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(COURSE_EVENT, onProgress);
        window.removeEventListener('storage', onProgress);
      }
    };
  }, [lessonId, course]);

  const onClick = () => {
    markCompleted(lessonId, course);
    setDone(true);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <button
        onClick={onClick}
        style={{
          padding: '0.7rem 1.2rem',
          borderRadius: '10px',
          border: done ? '1px solid rgba(22,163,74,0.35)' : '1px solid rgba(0,0,0,0.2)',
          background: done ? 'rgba(22,163,74,0.12)' : 'white',
          color: done ? '#16a34a' : '#111',
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        {done ? 'Completed' : 'Mark as Completed'}
      </button>

      {done && nextPath ? (
        <div style={{ marginTop: '0.85rem' }}>
          <Link
            to={nextPath}
            style={{
              padding: '0.75rem 1.1rem',
              borderRadius: '14px',
              border: 'none',
              fontWeight: 950,
              background: '#7cf2b0',
              color: '#0b0f14',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Continue
          </Link>
        </div>
      ) : null}
    </div>
  );
}
