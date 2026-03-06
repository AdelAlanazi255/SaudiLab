import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { COURSE_EVENT, getCourseProgress } from '@site/src/utils/progress';

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
  { id: 'career', label: 'CYBER SECURITY CAREER PATHS', href: '/career' },
];

function resolveBaseStatus(courseId) {
  const progress = getCourseProgress(courseId);
  const total = Number(progress?.total) || 0;
  const completed = Number(progress?.completedCount) || 0;
  if (total > 0 && completed >= total) return 'completed';
  if (completed > 0) return 'in_progress';
  return 'not_started';
}

export default function SaudiLabRoadmap() {
  const [progressTick, setProgressTick] = useState(0);
  const viewportRef = useRef(null);
  const nodeRefs = useRef({});

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

    const firstInProgress = base.find((course) => course.baseStatus === 'in_progress');
    const firstIncomplete = base.find((course) => course.baseStatus !== 'completed');
    const activeCourseId = firstInProgress?.id || firstIncomplete?.id || null;

    const nodes = base.map((course) => {
      let status = 'not_started';
      if (course.baseStatus === 'completed') {
        status = 'completed';
      } else if (activeCourseId && course.id === activeCourseId) {
        status = 'in_progress';
      }

      return {
        ...course,
        visualStatus: status,
      };
    });

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
    const activeId = roadmap.activeCourseId;
    if (!activeId) return;
    if (typeof window === 'undefined') return;

    const viewport = viewportRef.current;
    const node = nodeRefs.current[activeId];
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
  }, [roadmap.activeCourseId, progressTick]);

  return (
    <section className="sl-roadmapSurface" aria-label="SaudiLab course roadmap timeline">
      <div className="sl-roadmapHead">
        <h2 className="section-title">SaudiLab Roadmap</h2>
        <p className="sl-roadmapSub">Recommended learning journey with live progress states.</p>
      </div>

      <div className="sl-roadmapViewport" ref={viewportRef}>
        <div className="sl-roadmapTrack">
          <div className="sl-roadmapLine" aria-hidden="true">
            <span className="sl-roadmapLineFill" style={{ width: `${roadmap.fillPercent}%` }} />
          </div>
          <ol className="sl-roadmapList">
          {roadmap.nodes.map((course, index) => (
            <li
              key={course.id}
              className={`sl-roadmapStep ${index % 2 ? 'sl-roadmapStepAlt' : ''}`}
              ref={(el) => {
                nodeRefs.current[course.id] = el;
              }}
            >
              <Link
                to={course.href}
                className={`sl-roadmapNodeLink sl-roadmapNode-${course.visualStatus}`}
                aria-label={`${course.label} - ${
                  course.visualStatus === 'completed'
                    ? 'finished'
                    : course.visualStatus === 'in_progress'
                      ? 'in progress'
                      : 'not started'
                }`}
              >
                <span className="sl-roadmapNodeCore" />
              </Link>
              <div className="sl-roadmapLabelWrap">
                <div className="sl-roadmapLabel">{course.label}</div>
                <div className="sl-roadmapState">
                  {course.visualStatus === 'completed'
                    ? 'Finished'
                    : course.visualStatus === 'in_progress'
                      ? 'In Progress'
                      : 'Not Started'}
                </div>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
