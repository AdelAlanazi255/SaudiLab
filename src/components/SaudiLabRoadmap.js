import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { COURSE_EVENT, getCourseProgress } from '@site/src/utils/progress';
import { useAuth } from '@site/src/utils/authState';
import { LEARNING_MODE_FREE, normalizeLearningMode } from '@site/src/utils/learningMode';

const ROADMAP_COURSES = [
  { id: 'html', label: 'HTML', href: '/html' },
  { id: 'css', label: 'CSS', href: '/css' },
  { id: 'javascript', label: 'JAVASCRIPT', href: '/javascript' },
  { id: 'pcs', label: 'PERSONAL CYBER SAFETY', href: '/pcs' },
  { id: 'cse', label: 'CYBER SECURITY ESSENTIALS', href: '/cse' },
  { id: 'ethics', label: 'SECURITY ETHICS', href: '/ethics' },
  { id: 'crypto', label: 'CRYPTOGRAPHY', href: '/cryptography' },
  { id: 'websecurity', label: 'WEB SECURITY', href: '/web-security' },
  { id: 'kalitools', label: 'INTRO TO KALI', href: '/kali' },
  { id: 'forensics', label: 'DIGITAL FORENSICS', href: '/forensics' },
  { id: 'blueteam', label: 'BLUE TEAM FUNDAMENTALS', href: '/blueteam' },
];

function resolveBaseStatus(courseId) {
  const progress = getCourseProgress(courseId);
  const total = Number(progress?.total) || 0;
  const completed = Number(progress?.completedCount) || 0;
  if (total > 0 && completed >= total) return 'completed';
  if (completed > 0) return 'in_progress';
  return 'not_started';
}

const RoadmapNode = React.memo(function RoadmapNode({
  id,
  href,
  label,
  visualStatus,
  isAlternate,
}) {
  const isClickable = visualStatus !== 'not_started';
  const statusLabel =
    visualStatus === 'completed'
      ? 'Finished'
      : visualStatus === 'in_progress'
        ? 'In Progress'
        : 'Not Started';

  return (
    <li
      className={`sl-roadmapStep ${isAlternate ? 'sl-roadmapStepAlt' : ''}`}
      data-course-id={id}
    >
      {isClickable ? (
        <Link
          to={href}
          className={`sl-roadmapNodeLink sl-roadmapNode-${visualStatus}`}
          aria-label={`${label} - ${statusLabel.toLowerCase()}`}
        />
      ) : (
        <span
          className={`sl-roadmapNodeLink sl-roadmapNode-${visualStatus} sl-roadmapNodeDisabled`}
          aria-label={`${label} - ${statusLabel.toLowerCase()}`}
          role="img"
        />
      )}
      <div className="sl-roadmapLabelWrap">
        <div className="sl-roadmapLabel">{label}</div>
        <div className="sl-roadmapState">{statusLabel}</div>
      </div>
    </li>
  );
});

export default function SaudiLabRoadmap() {
  const auth = useAuth();
  const [progressTick, setProgressTick] = useState(0);
  const viewportRef = useRef(null);
  const isFreeExplorationMode = normalizeLearningMode(auth?.learningMode) === LEARNING_MODE_FREE;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const bump = () => setProgressTick((v) => v + 1);
    const onStorage = (e) => {
      if (!e?.key) return;
      if (e.key.includes('saudilab_') && e.key.includes('progress')) bump();
      if (e.key === 'saudilab_completed_lessons') bump();
    };

    window.addEventListener(COURSE_EVENT, bump);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener(COURSE_EVENT, bump);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', bump);
    };
  }, []);

  const roadmap = useMemo(() => {
    const base = ROADMAP_COURSES.map((course) => ({
      ...course,
      baseStatus: resolveBaseStatus(course.id),
    }));

    const nodes = [];
    let yellowIndex = -1;
    let yellowFromFallback = false;
    let activeCourseId = null;
    let seenInProgress = false;

    for (const course of base) {
      if (course.baseStatus === 'completed') {
        nodes.push({ ...course, visualStatus: 'completed' });
        continue;
      }

      if (course.baseStatus === 'in_progress') {
        if (yellowIndex >= 0 && yellowFromFallback) {
          nodes[yellowIndex] = { ...nodes[yellowIndex], visualStatus: 'not_started' };
          yellowIndex = -1;
          yellowFromFallback = false;
          activeCourseId = null;
        }

        if (yellowIndex < 0) {
          nodes.push({ ...course, visualStatus: 'in_progress' });
          yellowIndex = nodes.length - 1;
          seenInProgress = true;
          activeCourseId = course.id;
        } else {
          nodes.push({ ...course, visualStatus: 'not_started' });
        }
        continue;
      }

      if (yellowIndex < 0 && !seenInProgress) {
        nodes.push({ ...course, visualStatus: 'in_progress' });
        yellowIndex = nodes.length - 1;
        yellowFromFallback = true;
        activeCourseId = course.id;
      } else {
        nodes.push({ ...course, visualStatus: 'not_started' });
      }
    }

    const activeIndex = activeCourseId ? nodes.findIndex((item) => item.id === activeCourseId) : -1;
    const lastCompletedIndex = nodes.reduce((idx, item, index) => (item.visualStatus === 'completed' ? index : idx), -1);
    const focusIndex = activeIndex >= 0 ? activeIndex : lastCompletedIndex;
    const fillPercent = focusIndex >= 0 ? (focusIndex / Math.max(nodes.length - 1, 1)) * 100 : 0;

    return {
      nodes,
      activeCourseId,
      fillPercent,
    };
  }, [progressTick]);

  useEffect(() => {
    if (isFreeExplorationMode) return;
    const activeId = roadmap.activeCourseId;
    if (!activeId) return;
    if (typeof window === 'undefined') return;

    const viewport = viewportRef.current;
    const node = viewport?.querySelector(`[data-course-id="${activeId}"]`);
    if (!viewport || !node) return;

    const nodeLeft = node.offsetLeft;
    const target = nodeLeft - (viewport.clientWidth - node.clientWidth) / 2;
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const clamped = Math.max(0, Math.min(target, maxScroll));
    const reduceMotion =
      typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.requestAnimationFrame(() => {
      viewport.scrollTo({ left: clamped, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }, [roadmap.activeCourseId, isFreeExplorationMode]);

  return (
    <section
      className={`sl-roadmapSurface ${isFreeExplorationMode ? 'sl-roadmapSurfaceLocked' : ''}`}
      aria-label="SaudiLab course roadmap timeline"
    >
      <div className="sl-roadmapHead">
        <h2 className="section-title">SaudiLab Roadmap</h2>
        <p className="sl-roadmapSub">Recommended learning journey with live progress states.</p>
      </div>

      <div
        className="sl-roadmapViewport"
        ref={viewportRef}
        aria-hidden={isFreeExplorationMode ? 'true' : undefined}
      >
        <div className="sl-roadmapTrack">
          <div className="sl-roadmapLine" aria-hidden="true">
            <span className="sl-roadmapLineFill" style={{ width: `${roadmap.fillPercent}%` }} />
          </div>
          <ol className="sl-roadmapList">
            {roadmap.nodes.map((course, index) => (
              <RoadmapNode
              key={course.id}
                id={course.id}
                href={course.href}
                label={course.label}
                visualStatus={course.visualStatus}
                isAlternate={Boolean(index % 2)}
              />
            ))}
          </ol>
        </div>
      </div>

      {isFreeExplorationMode ? (
        <div className="sl-roadmapLockOverlay" role="status" aria-live="polite">
          <p className="sl-roadmapLockText">
            Roadmap is not available to Free exploration mode, switch to guided mode in the dashboard to view the
            roadmap
          </p>
          <Link to="/account" className="sl-btn-primary sl-roadmapLockBtn">
            Go to Dashboard
          </Link>
        </div>
      ) : null}
    </section>
  );
}
