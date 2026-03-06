import { COURSES, getLesson, getLessonByRoute } from '@site/src/course/courseMap';
import { isCompleted, migrateProgressOnce } from '@site/src/utils/progressKeys';
import { getCurrentLearningMode, isFreeExplorationMode } from '@site/src/utils/learningMode';

function toLessonId(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n < 1) return null;
  return `lesson${n}`;
}

export function canAccessLesson(course, lessonNumber) {
  if (typeof window === 'undefined') return true;
  if (isFreeExplorationMode(getCurrentLearningMode())) return true;
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
  const lessonId = getLastUnlockedLessonId(course);
  const lesson = getLesson(course, lessonId);
  return lesson?.permalink || `/${course}/${lessonId}`;
}
