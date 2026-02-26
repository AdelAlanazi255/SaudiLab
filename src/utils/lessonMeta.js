import { getLesson } from '@site/src/course/courseMap';

export function getLessonTitle(course, lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n < 1) return `Lesson ${lessonNumber}`;
  const lesson = getLesson(course, `lesson${n}`);
  return lesson?.title || `Lesson ${n}`;
}
