import { COURSES, getLesson } from '@site/src/course/courseMap';
import { isCompleted, migrateProgressOnce } from '@site/src/utils/progressKeys';

function toLessonId(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n < 1) return null;
  return `lesson${n}`;
}

export function canAccessLesson(course, lessonNumber) {
  if (typeof window === 'undefined') return true;
  migrateProgressOnce();

  const lessonId = toLessonId(lessonNumber);
  if (!lessonId) return false;

  const lesson = getLesson(course, lessonId);
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
    const n = Number(String(lesson.lessonId).replace('lesson', ''));
    if (!canAccessLesson(course, n)) break;
    lastUnlocked = lesson.lessonId;
  }

  return lastUnlocked;
}

export function getLastUnlockedLessonPath(course) {
  const lessonId = getLastUnlockedLessonId(course);
  return `/${course}/${lessonId}`;
}
