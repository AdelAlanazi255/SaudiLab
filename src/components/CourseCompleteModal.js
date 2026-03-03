import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';

export default function CourseCompleteModal({
  open,
  onClose,
  lessonsHref = '/html',
  courseName = 'Course',
}) {
  const closeRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && closeRef.current) {
      closeRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open) return;
    if (lastFocusedElementRef.current && typeof lastFocusedElementRef.current.focus === 'function') {
      lastFocusedElementRef.current.focus();
      lastFocusedElementRef.current = null;
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="sl-courseCompleteOverlay" role="dialog" aria-modal="true" aria-labelledby="sl-course-complete-title">
      <div className="sl-courseCompleteModal">
        <h2 id="sl-course-complete-title" className="sl-courseCompleteTitle">Course complete</h2>
        <p className="sl-courseCompleteText">You finished the {courseName} course.</p>

        <div className="sl-courseCompleteActions">
          <Link to="/" className="sl-btn-primary">Back to homepage</Link>
          <Link to={lessonsHref} className="sl-btn-ghost">View lessons</Link>
        </div>

        <button
          ref={closeRef}
          type="button"
          className="sl-courseCompleteClose"
          onClick={onClose}
          aria-label="Close completion dialog"
        >
          Close
        </button>
      </div>
    </div>
  );
}
