import React from 'react';
import Link from '@docusaurus/Link';
import LessonProgress from '@site/src/components/LessonProgress';
import CompleteButton from '@site/src/components/CompleteButton';
import TryItButton from '@site/src/components/TryItButton';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { getTryPath } from '@site/src/course/courseMap';

export default function LessonShell({
  course,
  current,
  total,
  lessonId,
  tryPath, // legacy prop; path is generated from courseMap
  children,
}) {
  const access = useLessonAccess({ course, lessonId });
  const generatedTryPath = getTryPath(course, lessonId) || tryPath || null;

  if (!access.allowed) {
    if (access.reason === 'paid') {
      return (
        <div style={lockWrap}>
          <h2 style={lockTitle}>Lesson Locked</h2>
          <p style={lockText}>This lesson requires an active subscription.</p>
          <Link to="/account" style={primaryLink}>
            Go to Account
          </Link>
        </div>
      );
    }

    if (access.requiredLessonId) {
      const requiredPath = `/${course}/${access.requiredLessonId}`;
      return (
        <div style={lockWrap}>
          <h2 style={lockTitle}>Lesson Locked</h2>
          <p style={lockText}>Complete the previous lesson first.</p>
          <Link to={requiredPath} style={primaryLink}>
            Go to required lesson
          </Link>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <LessonProgress current={current} total={total} />

      {children}

      {generatedTryPath ? (
        <>
          <h2>Ready to Practice?</h2>
          <TryItButton to={generatedTryPath} />
        </>
      ) : null}

      <hr />

      <CompleteButton lessonId={lessonId} course={course} />
    </>
  );
}

const lockWrap = {
  marginTop: '1.5rem',
  padding: '1.2rem',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(0,0,0,0.3)',
};

const lockTitle = {
  margin: 0,
  fontWeight: 900,
};

const lockText = {
  marginTop: '0.6rem',
  marginBottom: '1rem',
};

const primaryLink = {
  padding: '0.75rem 1.1rem',
  borderRadius: 14,
  border: 'none',
  fontWeight: 950,
  background: '#7cf2b0',
  color: '#0b0f14',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};
