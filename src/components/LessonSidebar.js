import React from 'react';
import Link from '@docusaurus/Link';

export default function LessonSidebar({ currentLesson }) {
  const lessons = [
    { name: 'Lesson 1', link: '/html/lesson1' },
    { name: 'Lesson 2', link: '/html/lesson2' },
    { name: 'Lesson 3', link: '/html/lesson3' },
  ];

  return (
    <div style={{ minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {lessons.map((lesson) => (
        <Link
          key={lesson.link}
          to={lesson.link}
          style={{
            border: '2px solid #4f46e5',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            color: 'white',
            backgroundColor: lesson.link === currentLesson ? '#4f46e5' : '#1f2937',
            textAlign: 'center',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          {lesson.name}
        </Link>
      ))}
    </div>
  );
}
