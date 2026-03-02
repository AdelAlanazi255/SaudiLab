import React from 'react';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { COURSES, getLesson } from '@site/src/course/courseMap';

// Kept for compatibility with older imports.
export const HTML_FREE_MODE = COURSES.html.access.freeMode;

export default function LessonGate({
  children,
  course = 'html',
  lessonId = null,
  docId = 'html/html-complete',
}) {
  const access = useLessonAccess({ course, lessonId, docId });

  if (!access.allowed) {
    if (access.requiredLessonId) {
      const requiredPath = getLesson(course, access.requiredLessonId)?.permalink || `/${course}/${access.requiredLessonId}`;
      return (
        <div style={wrap}>
          <div style={card}>
            <h1 style={title}>Lesson Locked</h1>
            <p style={text}>
              Complete <b>{access.requiredLessonId}</b> first.
            </p>
            <a href={requiredPath} style={primaryLink}>
              Go to required lesson
            </a>
          </div>
        </div>
      );
    }

    return null;
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
