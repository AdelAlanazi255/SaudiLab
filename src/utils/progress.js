import {
  COURSE_EVENT,
  PROGRESS_STORAGE_KEY,
  PROGRESS_MIGRATED_FLAG,
  canonicalKey,
  isCompleted as isCompletedCanonical,
  markCompleted as markCompletedCanonical,
  migrateProgressOnce,
  resetProgress as resetProgressCanonical,
  getCourseProgress,
} from '@site/src/utils/progressKeys';

export { COURSE_EVENT, canonicalKey, migrateProgressOnce, getCourseProgress };

// Legacy constants kept for compatibility with existing listeners.
export const HTML_COURSE_KEY = 'saudilab_html_progress_v1';
export const CSS_COURSE_KEY = 'saudilab_css_progress_v1';
export const COURSE_KEY = PROGRESS_STORAGE_KEY;
export const HTML_LESSONS = [
  'lesson1',
  'lesson2',
  'lesson3',
  'lesson4',
  'lesson5',
  'lesson6',
  'lesson7',
  'lesson8',
  'lesson9',
  'lesson10',
];
export const CSS_LESSONS = [...HTML_LESSONS];

export function getProgress(course = 'html') {
  migrateProgressOnce();
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const canonical = raw ? JSON.parse(raw) : {};
    const prefix = `${course}/`;
    const out = {};
    for (const [key, done] of Object.entries(canonical || {})) {
      if (!done || !key.startsWith(prefix)) continue;
      out[key.slice(prefix.length)] = true;
    }
    return out;
  } catch {
    return {};
  }
}

// Legacy signature preserved: isCompleted(lessonId, course?)
export function isCompleted(lessonId, course = 'html') {
  return isCompletedCanonical(course, lessonId);
}

// Legacy signature preserved: markCompleted(lessonId, course?)
export function markCompleted(lessonId, course = 'html') {
  markCompletedCanonical(course, lessonId);
}

export function resetProgress(course = 'all') {
  resetProgressCanonical(course);
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    // clean historical keys
    localStorage.removeItem(HTML_COURSE_KEY);
    localStorage.removeItem(CSS_COURSE_KEY);
    localStorage.removeItem('saudilab_progress_v1');
    localStorage.removeItem('saudilab_completed_lessons');
    if (course === 'all') {
      localStorage.removeItem(PROGRESS_MIGRATED_FLAG);
    }
  }
}

export function isLessonComplete(lessonId) {
  return isCompletedCanonical('html', lessonId);
}
