import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';

export default function CourseCompleteModal({
  open,
  onClose,
  lessonsHref = '/html',
  courseName = 'Course',
}) {
  const primaryActionRef = useRef(null);
  const lastFocusedElementRef = useRef(null);
  const isHtmlCourse = lessonsHref === '/html';

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
    if (open && primaryActionRef.current) {
      primaryActionRef.current.focus();
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
      <div className={`sl-courseCompleteModal${isHtmlCourse ? ' sl-courseCompleteModalHtml' : ''}`}>
        {isHtmlCourse ? (
          <>
            <div className="sl-courseCompleteSuccess" aria-hidden="true">
              <span className="sl-courseCompleteSuccessBadge">
                <svg viewBox="0 0 16 16" width="12" height="12" focusable="false" aria-hidden="true">
                  <path
                    d="M3.2 8.6 6.4 11.4 12.8 4.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sl-courseCompleteSuccessText">Milestone reached</span>
            </div>

            <h2 id="sl-course-complete-title" className="sl-courseCompleteTitle">HTML Course Completed</h2>
            <p className="sl-courseCompleteText">You&rsquo;ve just built your first web pages using HTML.</p>
            <p className="sl-courseCompletePrompt">Ready to make them look better?</p>

            <div className="sl-courseCompleteNextStep">
              <div className="sl-courseCompleteLabel">Next step</div>
              <div className="sl-courseCompleteNextCard">
                <p className="sl-courseCompleteNextTitle">CSS</p>
                <p className="sl-courseCompleteNextSubtext">Style and layout your websites</p>
              </div>
            </div>

            <div className="sl-courseCompleteActions sl-courseCompleteActionsHtml">
              <Link ref={primaryActionRef} to="/css" className="sl-btn-primary">Start CSS Course</Link>
              <Link to="/" className="sl-btn-ghost">Back to Homepage</Link>
            </div>
          </>
        ) : (
          <>
            <h2 id="sl-course-complete-title" className="sl-courseCompleteTitle">Course complete</h2>
            <p className="sl-courseCompleteText">You finished the {courseName} course.</p>

            <div className="sl-courseCompleteActions">
              <Link ref={primaryActionRef} to="/" className="sl-btn-primary">Back to homepage</Link>
              <Link to={lessonsHref} className="sl-btn-ghost">View lessons</Link>
            </div>

            <button
              type="button"
              className="sl-courseCompleteClose"
              onClick={onClose}
              aria-label="Close completion dialog"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
