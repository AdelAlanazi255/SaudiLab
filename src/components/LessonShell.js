import React from 'react';
import Link from '@docusaurus/Link';
import CompleteButton from '@site/src/components/CompleteButton';
import TryItButton from '@site/src/components/TryItButton';
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

        {generatedTryPath ? (
          <>
            <h2>Ready to Practice?</h2>
            <TryItButton to={generatedTryPath} />
          </>
        ) : null}

        <CompleteButton lessonId={lessonId} course={course} lessonTitle={resolvedTitle} />
      </div>
    </>
  );
}
