import React, { useEffect, useState } from 'react';
import { isCompleted, markCompleted, COURSE_EVENT } from '@site/src/utils/progress';

export default function CompleteButton({ lessonId }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isCompleted(lessonId));

    // Optional: keep button in sync if progress changes elsewhere
    const onProgress = () => setDone(isCompleted(lessonId));

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
  }, [lessonId]);

  const onClick = () => {
    markCompleted(lessonId);
    setDone(true);

    // ✅ tell the rest of the app (Account dashboard) that progress changed
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
        {done ? 'Completed ✓' : 'Mark as Completed'}
      </button>
    </div>
  );
}
