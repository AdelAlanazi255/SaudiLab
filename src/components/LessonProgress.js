import React from 'react';

export default function LessonProgress({ current, total }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div style={{ margin: '1.5rem 0 2rem 0' }}>
      {/* Text */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 700,
          marginBottom: '0.5rem',
          fontSize: '0.95rem',
        }}
      >
        <span>Lesson {current} of {total}</span>
        <span>{percent}%</span>
      </div>

      {/* Progress bar background */}
      <div
        style={{
          width: '100%',
          height: '14px',
          backgroundColor: '#e5e7eb',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        {/* Progress fill */}
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #111, #444)',
            borderRadius: '999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}
