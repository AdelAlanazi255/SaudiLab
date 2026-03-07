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
  const isCssCourse = lessonsHref === '/css';
  const useRichLayout = isHtmlCourse || isCssCourse;
  const richContent = isHtmlCourse
    ? {
      heading: 'HTML Course Completed',
      message: 'You’ve just built your first web pages using HTML.',
      prompt: 'Ready to make them look better?',
      nextTitle: 'CSS',
      nextSubtext: 'Style and layout your websites',
      ctaLabel: 'Start CSS Course',
      ctaTo: '/css',
    }
    : {
      heading: 'CSS Course Completed',
      message: 'You’ve styled your first web pages using CSS.',
      prompt: 'Ready to make your pages interactive?',
      nextTitle: 'JavaScript',
      nextSubtext: 'Make your websites interactive.',
      ctaLabel: 'Start JavaScript Course',
      ctaTo: '/javascript',
    };

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
      <div className={`sl-courseCompleteModal${useRichLayout ? ' sl-courseCompleteModalHtml' : ''}`}>
        {useRichLayout ? (
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

            <h2 id="sl-course-complete-title" className="sl-courseCompleteTitle">{richContent.heading}</h2>
            <p className="sl-courseCompleteText">{richContent.message}</p>
            <p className="sl-courseCompletePrompt">{richContent.prompt}</p>

            <div className="sl-courseCompleteNextStep">
              <div className="sl-courseCompleteLabel">Next step</div>
              <div className="sl-courseCompleteNextCard">
                <p className="sl-courseCompleteNextTitle">{richContent.nextTitle}</p>
                <p className="sl-courseCompleteNextSubtext">{richContent.nextSubtext}</p>
              </div>
            </div>

            <div className="sl-courseCompleteActions sl-courseCompleteActionsHtml">
              <Link ref={primaryActionRef} to={richContent.ctaTo} className="sl-btn-primary">{richContent.ctaLabel}</Link>
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
