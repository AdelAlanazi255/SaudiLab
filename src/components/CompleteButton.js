import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { COURSE_EVENT, isCompleted, markCompleted, unmarkCompleted } from '@site/src/utils/progressKeys';
import { useAuth } from '@site/src/utils/authState';
import { buildAuthHref, sanitizeNextPath } from '@site/src/utils/nextPath';

export default function CompleteButton({ lessonId, course = 'html' }) {
  const auth = useAuth();
  const [done, setDone] = useState(false);
  const [nextPath, setNextPath] = useState(null);
  const isGuest = !auth?.loading && !auth?.isLoggedIn;

  useEffect(() => {
    if (isGuest) {
      setDone(false);
    } else {
      setDone(isCompleted(course, lessonId));
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search || '');
      setNextPath(sanitizeNextPath(params.get('next'), null));
    }

    const onProgress = () => {
      if (isGuest) {
        setDone(false);
        return;
      }
      setDone(isCompleted(course, lessonId));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(COURSE_EVENT, onProgress);
      window.addEventListener('storage', onProgress);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(COURSE_EVENT, onProgress);
        window.removeEventListener('storage', onProgress);
      }
    };
  }, [lessonId, course, isGuest]);

  const onClick = () => {
    if (auth?.loading) return;
    if (isGuest) {
      if (typeof window !== 'undefined') {
        const current = `${window.location.pathname}${window.location.search || ''}${window.location.hash || ''}`;
        window.location.href = buildAuthHref('/login', current || '/');
      }
      return;
    }

    if (done) {
      unmarkCompleted(course, lessonId);
      setDone(false);
    } else {
      markCompleted(course, lessonId);
      setDone(true);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }
  };

  return (
    <div className="sl-completeWrap">
      <button
        onClick={onClick}
        className={`sl-completeBtn ${done ? 'sl-completeBtnDone' : 'sl-completeBtnPending'}`}
      >
        {isGuest ? 'Complete lesson' : done ? 'Completed \u2713' : 'Mark as Completed'}
      </button>

      {!isGuest && done ? <div className="sl-complete-helper">Click again to undo</div> : null}

      {!isGuest && done && nextPath ? (
        <div className="sl-completeContinueWrap">
          <Link to={nextPath} className="sl-btn-primary">
            Continue
          </Link>
        </div>
      ) : null}
    </div>
  );
}
