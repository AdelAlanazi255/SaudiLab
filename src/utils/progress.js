export const COURSE_KEY = 'saudilab_html_progress_v1';

export function getProgress() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(COURSE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function isCompleted(lessonId) {
  const p = getProgress();
  return Boolean(p[lessonId]);
}

export function markCompleted(lessonId) {
  if (typeof window === 'undefined') return;
  const p = getProgress();
  p[lessonId] = true;
  localStorage.setItem(COURSE_KEY, JSON.stringify(p));
}

export function isLessonComplete(lessonId) {
  try {
    const completed = JSON.parse(localStorage.getItem('saudilab_completed_lessons') || '[]');
    return completed.includes(lessonId);
  } catch {
    return false;
  }
}

export function resetProgress() {
  localStorage.removeItem('saudilab_progress_v1');
}
