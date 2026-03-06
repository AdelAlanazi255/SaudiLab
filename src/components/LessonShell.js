import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import CompleteButton from '@site/src/components/CompleteButton';
import useLessonAccess from '@site/src/hooks/useLessonAccess';
import { getTryPath } from '@site/src/course/courseMap';
import { getLessonMetaSafe } from '@site/src/data/lessons';
import { useAuth } from '@site/src/utils/authState';
import { buildAuthHref } from '@site/src/utils/nextPath';

export default function LessonShell({
  course,
  current,
  total,
  lessonId,
  title,
  tryPath, // legacy prop; path is generated from courseMap
  children,
}) {
  const auth = useAuth();
  const history = useHistory();
  const access = useLessonAccess({ course, lessonId });
  const generatedTryPath = getTryPath(course, lessonId) || tryPath || null;
  const resolvedTitle = title || getLessonMetaSafe(course, Number(current))?.title || null;
  const readyCardRef = useRef(null);
  const [readyCardPulse, setReadyCardPulse] = useState(false);
  const isGuest = !auth?.loading && !auth?.isLoggedIn;

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

  useEffect(() => {
    if (access.allowed || !access.redirectTo) return;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (currentPath !== access.redirectTo) {
      history.replace(access.redirectTo);
    }
  }, [access.allowed, access.redirectTo, history]);

  if (!access.allowed) return null;

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
                  <Link to={isGuest ? buildAuthHref('/login', generatedTryPath) : generatedTryPath} className="sl-btn-primary sl-lesson-actions-primary">
                    Try It Yourself
                  </Link>
                ) : null}
                <CompleteButton lessonId={lessonId} course={course} lessonTitle={resolvedTitle} />
              </div>
              {isGuest ? (
                <p className="sl-lessonAuthHint">
                  Create a free account to start lessons and track progress.{' '}
                  <Link to={buildAuthHref('/login', generatedTryPath || null)}>Log in</Link> or{' '}
                  <Link to={buildAuthHref('/signup', generatedTryPath || null)}>Sign up</Link>.
                </p>
              ) : null}
            </div>
          </div>
        </>
      );
}
