import { COURSES, getLesson, getLessonByRoute } from '@site/src/course/courseMap';
import { getCourseProgress } from '@site/src/utils/progress';
import { isCompleted, migrateProgressOnce } from '@site/src/utils/progressKeys';
import {
  getCurrentLearningMode,
  isAdminRuntime,
  isAuthenticatedRuntime,
  isFreeExplorationMode,
} from '@site/src/utils/learningMode';

export const GUIDED_COURSE_SEQUENCE = Object.freeze([
  'html',
  'css',
  'javascript',
  'pcs',
  'cse',
  'ethics',
  'crypto',
  'websecurity',
  'kalitools',
  'forensics',
  'blueteam',
]);

function toLessonId(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n < 1) return null;
  return `lesson${n}`;
}

function isCourseFullyCompleted(course) {
  const progress = getCourseProgress(course);
  const total = Number(progress?.total) || 0;
  const completed = Number(progress?.completedCount) || 0;
  return total > 0 && completed >= total;
}

export function canAccessCourse(course) {
  if (typeof window === 'undefined') return true;
  if (!course || !COURSES[course]) return false;

  if (isAdminRuntime()) return true;
  if (isFreeExplorationMode(getCurrentLearningMode())) return true;

  // Keep guests aligned with previous behavior: guided course locking only applies to authenticated users.
  if (!isAuthenticatedRuntime()) return true;

  migrateProgressOnce();
  const courseIndex = GUIDED_COURSE_SEQUENCE.indexOf(course);
  if (courseIndex <= 0) return true;

  const requiredCourse = GUIDED_COURSE_SEQUENCE[courseIndex - 1];
  if (!requiredCourse) return true;
  return isCourseFullyCompleted(requiredCourse);
}

export function canAccessLesson(course, lessonNumber) {
  if (typeof window === 'undefined') return true;
  if (!course || !COURSES[course]) return false;
  if (isAdminRuntime()) return true;
  if (isFreeExplorationMode(getCurrentLearningMode())) return true;
  if (!canAccessCourse(course)) return false;
  migrateProgressOnce();

  const routeId = toLessonId(lessonNumber);
  if (!routeId) return false;

  const lesson = getLessonByRoute(course, routeId) || getLesson(course, routeId);
  if (!lesson) return false;
  if (!lesson.requireLessonId) return true;

  return isCompleted(course, lesson.requireLessonId);
}

export function getLastUnlockedLessonId(course) {
  const c = COURSES[course];
  if (!c || !Array.isArray(c.lessons) || c.lessons.length === 0) return 'lesson1';

  let lastUnlocked = c.lessons[0].lessonId;
  for (let i = 0; i < c.lessons.length; i += 1) {
    const lesson = c.lessons[i];
    const source = String(lesson.routeId || lesson.lessonId || '');
    const match = source.match(/lesson(\d+)/i);
    const n = match ? Number(match[1]) : NaN;
    if (!Number.isFinite(n)) break;
    if (!canAccessLesson(course, n)) break;
    lastUnlocked = lesson.lessonId;
  }

  return lastUnlocked;
}

export function getLastUnlockedLessonPath(course) {
  if (typeof window !== 'undefined') {
    const guidedMode = !isFreeExplorationMode(getCurrentLearningMode());
    if (guidedMode && isAuthenticatedRuntime() && !isAdminRuntime()) {
      return '/';
    }
  }

  if (!canAccessCourse(course)) return '/';

  const lessonId = getLastUnlockedLessonId(course);
  const lesson = getLesson(course, lessonId);
  return lesson?.permalink || `/${course}/${lessonId}`;
}
