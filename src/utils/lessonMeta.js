import { getLessonMetaSafe } from '@site/src/data/lessons';

export function getLessonTitle(course, lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n < 1) return `Lesson ${lessonNumber}`;
  const lesson = getLessonMetaSafe(course, n);
  return lesson?.title || `Lesson ${n}`;
}
