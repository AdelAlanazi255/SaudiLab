const COURSE_META = {
  html: { label: 'HTML', routeBasePath: '/html', landingRoute: '/html' },
  css: { label: 'CSS', routeBasePath: '/css', landingRoute: '/css' },
  javascript: { label: 'JavaScript', routeBasePath: '/javascript', landingRoute: '/javascript' },
  cse: { label: 'Cyber Security Essentials', routeBasePath: '/cse', landingRoute: '/cse' },
  crypto: { label: 'Cryptography', routeBasePath: '/cryptography', landingRoute: '/cryptography' },
  websecurity: { label: 'Web Security', routeBasePath: '/web-security', landingRoute: '/web-security' },
  networkbasics: { label: 'Network Basics', routeBasePath: '/network-basics', landingRoute: '/network-basics' },
  ethics: { label: 'Security Ethics', routeBasePath: '/ethics', landingRoute: '/ethics' },
  pcs: { label: 'Personal Cyber Safety', routeBasePath: '/pcs', landingRoute: '/pcs' },
  kalitools: { label: 'Intro to Security Tools (Kali Linux)', routeBasePath: '/kali', landingRoute: '/kali' },
  forensics: { label: 'Digital Forensics', routeBasePath: '/forensics', landingRoute: '/forensics' },
  blueteam: { label: 'Blue Team Fundamentals', routeBasePath: '/blueteam', landingRoute: '/blueteam' },
  career: { label: 'Cyber Security Career Paths', routeBasePath: '/career', landingRoute: '/career' },
};

const LOCALE_PREFIXES = new Set(['/ar', '/en']);

function normalizePath(pathname = '') {
  const value = String(pathname || '').split(/[?#]/)[0] || '/';
  return value.endsWith('/') && value !== '/' ? value.slice(0, -1) : value;
}

function stripLocalePrefix(pathname = '') {
  const normalized = normalizePath(pathname);
  const lower = normalized.toLowerCase();
  for (const prefix of LOCALE_PREFIXES) {
    if (lower === prefix) return '/';
    if (lower.startsWith(`${prefix}/`)) {
      return normalized.slice(prefix.length) || '/';
    }
  }
  return normalized;
}

export function getCourseMeta(courseKey) {
  return COURSE_META[courseKey] || null;
}

export function getCourseLabel(courseKey, fallback = 'Course') {
  return getCourseMeta(courseKey)?.label || fallback;
}

export function getCourseLessonsRoute(courseKey, firstLessonRoute = '/') {
  return getCourseMeta(courseKey)?.landingRoute || firstLessonRoute || '/';
}

export function getCourseKeyFromPathname(pathname = '') {
  const clean = stripLocalePrefix(pathname).toLowerCase();
  if (!clean.startsWith('/')) return null;

  for (const [courseKey, meta] of Object.entries(COURSE_META)) {
    const base = meta.routeBasePath.toLowerCase();
    if (clean === base || clean.startsWith(`${base}/`)) {
      return courseKey;
    }
  }
  return null;
}

export function normalizeCoursePath(pathname = '') {
  return stripLocalePrefix(pathname);
}

export { COURSE_META };
