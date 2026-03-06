import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import CompleteButton from '@site/src/components/CompleteButton';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { getLesson, getTryPath } from '@site/src/course/courseMap';
import { getLessonMetaSafe } from '@site/src/data/lessons';

export default function LessonShell({
  course,
  current,
  total,
  lessonId,
  title,
  tryPath, // legacy prop; path is generated from courseMap
  children,
}) {
  const access = useLessonAccess({ course, lessonId });
  const generatedTryPath = getTryPath(course, lessonId) || tryPath || null;
  const resolvedTitle = title || getLessonMetaSafe(course, Number(current))?.title || null;
  const readyCardRef = useRef(null);
  const [readyCardPulse, setReadyCardPulse] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !readyCardRef.current || readyCardPulse) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstVisible = entries.some((entry) => entry.isIntersecting);
        if (!firstVisible) return;
        setReadyCardPulse(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(readyCardRef.current);
    return () => observer.disconnect();
  }, [readyCardPulse]);

  if (!access.allowed) {
    if (access.requiredLessonId) {
      const requiredPath = getLesson(course, access.requiredLessonId)?.permalink || `/${course}/${access.requiredLessonId}`;
      return (
        <div className="sl-lessonLock sl-card">
          <h2 className="sl-lessonLockTitle">Lesson Locked</h2>
          <p className="sl-lessonLockText">Complete the previous lesson first.</p>
          <Link to={requiredPath} className="sl-btn-primary">
            Go to required lesson
          </Link>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <div className="sl-lessonContent">
        {children}

        <div
          ref={readyCardRef}
          className={`sl-lesson-actions-card sl-ready-practice-card${readyCardPulse ? ' sl-ready-practice-pulse' : ''}`}
        >
          <div className="sl-lesson-actions-row">
            {generatedTryPath ? (
              <Link to={generatedTryPath} className="sl-btn-primary sl-lesson-actions-primary">
                Try It Yourself
              </Link>
            ) : null}
            <CompleteButton lessonId={lessonId} course={course} lessonTitle={resolvedTitle} />
          </div>
        </div>
      </div>
    </>
  );
}
