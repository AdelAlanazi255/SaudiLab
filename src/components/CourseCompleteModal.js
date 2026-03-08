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

  const richContentByCourse = {
    '/html': {
      heading: 'HTML Course Completed',
      message: "You've just built your first web pages using HTML.",
      prompt: 'Ready to make them look better?',
      nextTitle: 'CSS',
      nextSubtext: 'Style and layout your websites.',
      ctaLabel: 'Start CSS Course',
      ctaTo: '/css',
    },
    '/css': {
      heading: 'CSS Course Completed',
      message: "You've styled your first web pages using CSS.",
      prompt: 'Ready to make your pages interactive?',
      nextTitle: 'JavaScript',
      nextSubtext: 'Make your websites interactive.',
      ctaLabel: 'Start JavaScript Course',
      ctaTo: '/javascript',
    },
    '/pcs': {
      heading: 'Personal Cyber Safety Course Completed',
      message: "You've completed the core skills to protect your daily digital life.",
      prompt: 'Ready for the next cybersecurity step?',
      nextTitle: 'Cyber Security Essentials',
      nextSubtext: 'Learn practical security fundamentals used in real scenarios.',
      ctaLabel: 'Start Cyber Security Essentials',
      ctaTo: '/cse',
    },
    '/cse': {
      heading: 'Cyber Security Essentials Course Completed',
      message: "You've built a strong foundation in practical cybersecurity concepts.",
      prompt: 'Ready to continue to the next course?',
      nextTitle: 'Security Ethics',
      nextSubtext: 'Learn the legal and ethical boundaries of security practice.',
      ctaLabel: 'Start Security Ethics',
      ctaTo: '/ethics',
    },
    '/ethics': {
      heading: 'Security Ethics Course Completed',
      message: "You've learned the ethical and responsible mindset expected in cybersecurity.",
      prompt: 'Ready for the next course?',
      nextTitle: 'Web Security',
      nextSubtext: 'Learn how to identify and prevent common website security risks.',
      ctaLabel: 'Start Web Security',
      ctaTo: '/web-security',
    },
    '/web-security': {
      heading: 'Web Security Course Completed',
      message: "You've learned the core ideas needed to secure websites and web applications.",
      prompt: 'Ready for the next course?',
      nextTitle: 'Intro to Kali',
      nextSubtext: 'Learn security tools and safe workflows in a beginner-friendly way.',
      ctaLabel: 'Start Intro to Kali',
      ctaTo: '/kali',
    },
    '/kali': {
      heading: 'Intro to Security Tools (Kali Linux) Course Completed',
      message: "You've completed the core concepts behind beginner security tools and responsible use.",
      prompt: 'Ready for the next course?',
      nextTitle: 'Digital Forensics',
      nextSubtext: 'Learn how investigators collect and analyze digital evidence.',
      ctaLabel: 'Start Digital Forensics',
      ctaTo: '/forensics',
    },
    '/forensics': {
      heading: 'Digital Forensics Course Completed',
      message: "You've completed the core concepts for investigating digital incidents and evidence.",
      prompt: 'Ready for the next course?',
      nextTitle: 'Blue Team Fundamentals',
      nextSubtext: 'Learn how defenders monitor, detect, and respond to threats.',
      ctaLabel: 'Start Blue Team Fundamentals',
      ctaTo: '/blueteam',
    },
    '/blueteam': {
      heading: 'Blue Team Fundamentals Course Completed',
      message: "You've built a practical foundation in defensive security operations.",
      prompt: 'Ready for the next course?',
      nextTitle: 'Cryptography',
      nextSubtext: 'Learn how data is protected through encryption and hashing concepts.',
      ctaLabel: 'Start Cryptography',
      ctaTo: '/cryptography',
    },
  };

  const richContent = richContentByCourse[lessonsHref] || null;
  const useRichLayout = Boolean(richContent);

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
