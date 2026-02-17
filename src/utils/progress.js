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

export function resetProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COURSE_KEY);
}

/**
 * Returns overall course progress
 */
export function getCourseProgress(totalLessons = 10) {
  const progress = getProgress();
  const completedIds = Object.keys(progress).filter((k) => progress[k]);

  const completedCount = completedIds.length;
  const percent =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  return {
    completedCount,
    total: totalLessons,
    percent,
    completedIds,
  };
}
