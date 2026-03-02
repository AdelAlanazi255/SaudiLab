import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { COURSE_EVENT, isCompleted, markCompleted } from '@site/src/utils/progressKeys';

function sanitizeNextPath(value) {
  if (!value || typeof value !== 'string') return null;
  if (!value.startsWith('/')) return null;
  if (value.startsWith('/locked')) return null;
  return value;
}

export default function CompleteButton({ lessonId, course = 'html' }) {
  const [done, setDone] = useState(false);
  const [nextPath, setNextPath] = useState(null);

  useEffect(() => {
    setDone(isCompleted(course, lessonId));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setNextPath(sanitizeNextPath(params.get('next')));
    }

    const onProgress = () => setDone(isCompleted(course, lessonId));

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
  }, [lessonId, course]);

  const onClick = () => {
    markCompleted(course, lessonId);
    setDone(true);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(COURSE_EVENT));
    }
  };

  return (
    <div className="sl-completeWrap">
      <button
        onClick={onClick}
        className={`sl-btn-primary sl-completeBtn ${done ? 'sl-completeBtnDone' : ''}`}
      >
        {done ? 'Completed' : 'Mark as Completed'}
      </button>

      {done && nextPath ? (
        <div className="sl-completeContinueWrap">
          <Link to={nextPath} className="sl-btn-primary">
            Continue
          </Link>
        </div>
      ) : null}
    </div>
  );
}
