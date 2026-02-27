import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@site/src/utils/authState';
import { COURSE_EVENT } from '@site/src/utils/progress';
import { isCompleted, migrateProgressOnce } from '@site/src/utils/progressKeys';
import { COURSES, getLesson, parseDocId } from '@site/src/course/courseMap';
import { canAccessLesson } from '@site/src/utils/lessonAccess';

function isBrowser() {
  return typeof window !== 'undefined';
}

function buildLockedRedirect(needPath) {
  if (!isBrowser()) return null;
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return `/locked?need=${encodeURIComponent(needPath)}&next=${encodeURIComponent(currentPath)}`;
}

function isPaidBlocked(courseMeta, lesson) {
  if (!courseMeta || !lesson) return false;
  if (courseMeta.access?.freeMode) return false;
  return Boolean(lesson.paid);
}

function getLessonNumber(lesson) {
  if (!lesson) return NaN;
  const source = String(lesson.routeId || lesson.lessonId || '');
  const match = source.match(/lesson(\d+)/i);
  return match ? Number(match[1]) : NaN;
}

function getAccessState({ course, lessonId, docId, auth }) {
  const parsed = docId ? parseDocId(docId) : null;
  const resolvedCourse = course || parsed?.course || null;
  const resolvedLessonId = lessonId || parsed?.lessonId || null;
  const kind = parsed?.kind || (resolvedLessonId ? 'lesson' : null);

  if (!isBrowser()) {
    return { allowed: true, reason: 'ssr', redirectTo: null, requiredLessonId: null };
  }

  if (!resolvedCourse || !COURSES[resolvedCourse]) {
    return { allowed: true, reason: 'unknown', redirectTo: null, requiredLessonId: null };
  }

  migrateProgressOnce();

  const courseMeta = COURSES[resolvedCourse];
  const lesson = resolvedLessonId ? getLesson(resolvedCourse, resolvedLessonId) : null;

  if (kind === 'lesson' && !lesson) {
    return { allowed: false, reason: 'invalid_lesson', redirectTo: null, requiredLessonId: null };
  }

  if (kind === 'lesson' && lesson?.requireLessonId) {
    const requiredLessonId = lesson.requireLessonId;
    const lessonNumber = getLessonNumber(lesson);
    if (!canAccessLesson(resolvedCourse, lessonNumber) || !isCompleted(resolvedCourse, requiredLessonId)) {
      const requiredLesson = getLesson(resolvedCourse, requiredLessonId);
      const needPath = requiredLesson?.permalink || `/${resolvedCourse}/${requiredLessonId}`;
      return {
        allowed: false,
        reason: 'prerequisite',
        redirectTo: buildLockedRedirect(needPath),
        requiredLessonId,
      };
    }
  }

  if (kind === 'complete') {
    const lastLessonId = courseMeta.lessons[courseMeta.lessons.length - 1]?.lessonId || `lesson${courseMeta.totalLessons}`;
    if (!isCompleted(resolvedCourse, lastLessonId)) {
      const lastLesson = getLesson(resolvedCourse, lastLessonId);
      const needPath = lastLesson?.permalink || `/${resolvedCourse}/${lastLessonId}`;
      return {
        allowed: false,
        reason: 'prerequisite',
        redirectTo: buildLockedRedirect(needPath),
        requiredLessonId: lastLessonId,
      };
    }
  }

  if (!auth || auth.loading) {
    return { allowed: true, reason: 'loading', redirectTo: null, requiredLessonId: null };
  }

  if (kind === 'lesson' && isPaidBlocked(courseMeta, lesson) && (!auth.isLoggedIn || !auth.subscribed)) {
    return { allowed: false, reason: 'paid', redirectTo: '/account', requiredLessonId: null };
  }

  return { allowed: true, reason: 'allowed', redirectTo: null, requiredLessonId: null };
}

export default function useLessonAccess({ course, lessonId, docId }) {
  const auth = useAuth();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isBrowser()) return;
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(COURSE_EVENT, bump);
    window.addEventListener('storage', bump);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener(COURSE_EVENT, bump);
      window.removeEventListener('storage', bump);
      window.removeEventListener('focus', bump);
    };
  }, []);

  return useMemo(
    () => getAccessState({ course, lessonId, docId, auth, tick }),
    [course, lessonId, docId, auth, tick],
  );
}

export { getAccessState };
