import { COURSES } from '@site/src/course/courseMap';

export const COURSE_EVENT = 'saudilab_course_progress_v1';
export const PROGRESS_STORAGE_KEY = 'saudilab_progress_canonical_v1';
export const PROGRESS_MIGRATED_FLAG = 'saudilab_progress_migrated_v1';

const LEGACY_HTML_KEY = 'saudilab_html_progress_v1';
const LEGACY_CSS_KEY = 'saudilab_css_progress_v1';
const LEGACY_SHARED_KEYS = ['saudilab_progress_v1', 'saudilab_completed_lessons'];

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function canonicalKey(course, lessonId) {
  return `${String(course).toLowerCase()}/${String(lessonId).toLowerCase()}`;
}

function readCanonicalMap() {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCanonicalMap(map) {
  if (!isBrowser()) return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
}

function normalizeLegacyKey(rawKey, defaultCourse = null) {
  const raw = String(rawKey || '').trim().toLowerCase();
  if (!raw) return null;

  if (/^(html|css)\/lesson\d+$/.test(raw)) return raw;
  if (/^(html|css)[-_]lesson\d+$/.test(raw)) return raw.replace(/[-_]/, '/');
  if (/^cse\/cse_lesson\d+$/.test(raw)) return raw;
  if (/^cse\/cse-lesson\d+$/.test(raw)) return raw.replace('cse-lesson', 'cse_lesson');
  if (/^cse[-_]lesson\d+$/.test(raw)) return `cse/${raw.replace('-', '_')}`;

  if (/^lesson\d+$/.test(raw) && defaultCourse) {
    return canonicalKey(defaultCourse, raw);
  }

  return null;
}

function migrateCourseObject(store, source, course) {
  if (!source || typeof source !== 'object') return;
  for (const [legacyKey, done] of Object.entries(source)) {
    if (!done) continue;
    const key = normalizeLegacyKey(legacyKey, course);
    if (key) store[key] = true;
  }
}

function migrateLegacyShared(store, parsed) {
  if (!parsed) return;
  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      const key = normalizeLegacyKey(item, 'html');
      if (key) store[key] = true;
    }
    return;
  }
  if (typeof parsed === 'object') {
    for (const [legacyKey, done] of Object.entries(parsed)) {
      if (!done) continue;
      const key = normalizeLegacyKey(legacyKey, 'html');
      if (key) store[key] = true;
    }
  }
}

export function migrateProgressOnce() {
  if (!isBrowser()) return;
  if (localStorage.getItem(PROGRESS_MIGRATED_FLAG) === '1') return;

  const canonical = readCanonicalMap();

  try {
    const oldHtml = JSON.parse(localStorage.getItem(LEGACY_HTML_KEY) || '{}');
    migrateCourseObject(canonical, oldHtml, 'html');
  } catch {
    // ignore malformed legacy data
  }

  try {
    const oldCss = JSON.parse(localStorage.getItem(LEGACY_CSS_KEY) || '{}');
    migrateCourseObject(canonical, oldCss, 'css');
  } catch {
    // ignore malformed legacy data
  }

  for (const key of LEGACY_SHARED_KEYS) {
    try {
      migrateLegacyShared(canonical, JSON.parse(localStorage.getItem(key) || 'null'));
    } catch {
      // ignore malformed legacy data
    }
  }

  // Normalize any canonical entries that already existed.
  for (const entry of Object.keys(canonical)) {
    const normalized = normalizeLegacyKey(entry) || normalizeLegacyKey(entry, 'html');
    if (normalized && normalized !== entry) {
      canonical[normalized] = true;
      delete canonical[entry];
    }
  }

  writeCanonicalMap(canonical);
  localStorage.setItem(PROGRESS_MIGRATED_FLAG, '1');
}

export function isCompleted(course, lessonId) {
  if (!isBrowser()) return false;
  migrateProgressOnce();
  const map = readCanonicalMap();
  return Boolean(map[canonicalKey(course, lessonId)]);
}

export function markCompleted(course, lessonId) {
  if (!isBrowser()) return;
  migrateProgressOnce();
  const map = readCanonicalMap();
  map[canonicalKey(course, lessonId)] = true;
  writeCanonicalMap(map);
}

export function unmarkCompleted(course, lessonId) {
  if (!isBrowser()) return;
  migrateProgressOnce();
  const map = readCanonicalMap();
  delete map[canonicalKey(course, lessonId)];
  writeCanonicalMap(map);
}

export function resetProgress(course = 'all') {
  if (!isBrowser()) return;
  migrateProgressOnce();
  if (course === 'all') {
    writeCanonicalMap({});
    return;
  }
  const map = readCanonicalMap();
  const prefix = `${course}/`;
  for (const key of Object.keys(map)) {
    if (key.startsWith(prefix)) {
      delete map[key];
    }
  }
  writeCanonicalMap(map);
}

export function getCourseProgress(course = 'html') {
  migrateProgressOnce();
  const c = COURSES[course];
  if (!c) return { completedCount: 0, total: 0, percent: 0, nextLessonId: null };
  const total = c.totalLessons;
  let completedCount = 0;
  let nextLessonId = null;

  for (const lesson of c.lessons) {
    if (isCompleted(course, lesson.lessonId)) {
      completedCount += 1;
      continue;
    }
    if (!nextLessonId) nextLessonId = lesson.lessonId;
  }

  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  return { completedCount, total, percent, nextLessonId };
}
