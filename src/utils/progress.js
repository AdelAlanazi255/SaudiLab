export const COURSE_EVENT = 'saudilab_course_progress_v1';
export const HTML_COURSE_KEY = 'saudilab_html_progress_v1';
export const CSS_COURSE_KEY = 'saudilab_css_progress_v1';

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

export const CSS_LESSONS = [
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



function readKey(key) {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

function writeKey(key, obj) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(obj));
}

export function getProgress(course = 'html') {
  const key = course === 'css' ? CSS_COURSE_KEY : HTML_COURSE_KEY;
  return readKey(key);
}

export function isCompleted(lessonId, course = 'html') {
  const p = getProgress(course);
  return Boolean(p[lessonId]);
}

export function markCompleted(lessonId, course = 'html') {
  const key = course === 'css' ? CSS_COURSE_KEY : HTML_COURSE_KEY;
  const p = readKey(key);
  p[lessonId] = true;
  writeKey(key, p);
}

export function resetProgress(course = 'all') {
  if (typeof window === 'undefined') return;

  if (course === 'html' || course === 'all') {
    localStorage.removeItem(HTML_COURSE_KEY);
  }
  if (course === 'css' || course === 'all') {
    localStorage.removeItem(CSS_COURSE_KEY);
  }

  // clean old keys (in case you had older versions)
  localStorage.removeItem('saudilab_progress_v1');
  localStorage.removeItem('saudilab_completed_lessons');
}

export function getCourseProgress(course = 'html') {
  const lessonIds = course === 'css' ? CSS_LESSONS : HTML_LESSONS;
  const p = getProgress(course);

  const total = lessonIds.length;
  const completedCount = lessonIds.filter((id) => Boolean(p[id])).length;
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const nextLessonId = lessonIds.find((id) => !p[id]) || null;

  return { completedCount, total, percent, nextLessonId };
}

// Backwards compat for sidebar lock code
export function isLessonComplete(lessonId) {
  return isCompleted(lessonId, 'html');
}

// Optional convenience if you ever need this:
export const COURSE_KEY = HTML_COURSE_KEY;
