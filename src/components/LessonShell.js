import React, { useEffect, useMemo, useState } from 'react';
import LessonProgress from '@site/src/components/LessonProgress';
import CompleteButton from '@site/src/components/CompleteButton';
import TryItButton from '@site/src/components/TryItButton';
import { COURSE_EVENT, isCompleted } from '@site/src/utils/progress';

export default function LessonShell({
  course,
  current,
  total,
  lessonId,
  tryPath,
  children,
}) {
  const [locked, setLocked] = useState(false);

  const previousLessonId = useMemo(() => {
    const n = Number(current);
    if (!Number.isFinite(n) || n <= 1) return null;
    return `lesson${n - 1}`;
  }, [current]);

  useEffect(() => {
    const sync = () => {
      setLocked(Boolean(previousLessonId) && !isCompleted(previousLessonId, course));
    };

    sync();

    if (typeof window !== 'undefined') {
      window.addEventListener(COURSE_EVENT, sync);
      window.addEventListener('storage', sync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(COURSE_EVENT, sync);
        window.removeEventListener('storage', sync);
      }
    };
  }, [course, lessonId, previousLessonId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!locked || !previousLessonId) return;

    const needPath = `/${course}/${previousLessonId}`;
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const target = `/locked?need=${encodeURIComponent(needPath)}&next=${encodeURIComponent(currentPath)}`;

    if (window.location.pathname !== '/locked') {
      window.location.replace(target);
    }
  }, [locked, previousLessonId, course]);

  if (locked) {
    return null;
  }

  return (
    <>
      <LessonProgress current={current} total={total} />

      {children}

      <h2>Ready to Practice?</h2>
      <TryItButton to={tryPath} />

      <hr />

      <CompleteButton lessonId={lessonId} course={course} />
    </>
  );
}
