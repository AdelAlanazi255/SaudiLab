const ADMIN_ONLY_ROUTE_PREFIXES = [
  '/ethics',
  '/pcs',
  '/kali',
  '/kali-tools',
  '/web-security',
  '/forensics',
  '/digital-forensics',
  '/blueteam',
  '/blue-team',
  '/blue-team-fundamentals',
  '/career',
  '/network-basics',
];

const LOCALE_PREFIXES = ['/ar', '/en'];

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

export function isAdminOnlyCoursePath(pathname = '') {
  const clean = stripLocalePrefix(pathname).toLowerCase();
  return ADMIN_ONLY_ROUTE_PREFIXES.some(
    (prefix) => clean === prefix || clean.startsWith(`${prefix}/`),
  );
}

export { ADMIN_ONLY_ROUTE_PREFIXES };
