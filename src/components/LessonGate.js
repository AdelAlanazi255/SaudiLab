import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { COURSES } from '@site/src/course/courseMap';

// Kept for compatibility with older imports.
export const HTML_FREE_MODE = COURSES.html.access.freeMode;

export default function LessonGate({
  children,
  course = 'html',
  lessonId = null,
  docId = null,
}) {
  const history = useHistory();
  const access = useLessonAccess({ course, lessonId, docId });

  useEffect(() => {
    if (access.allowed || !access.redirectTo) return;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (currentPath !== access.redirectTo) {
      history.replace(access.redirectTo);
    }
  }, [access.allowed, access.redirectTo, history]);

  if (!access.allowed) return null;

  return <>{children}</>;
}
