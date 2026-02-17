import React, { useEffect, useState } from 'react';
import { isCompleted, markCompleted } from '@site/src/utils/progress';

export default function CompleteButton({ lessonId }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isCompleted(lessonId));
  }, [lessonId]);

  const onClick = () => {
    markCompleted(lessonId);
    setDone(true);
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
