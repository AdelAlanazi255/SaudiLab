export function sanitizeNextPath(value, fallback = '/') {
  const next = String(value || '').trim();
  if (!next) return fallback;
  if (!next.startsWith('/')) return fallback;
  if (next.startsWith('//')) return fallback;
  if (next.startsWith('/locked')) return fallback;
  if (next.startsWith('/login') || next.startsWith('/signup') || next.startsWith('/auth/callback')) {
    return fallback;
  }
  return next;
}

export function getNextPathFromSearch(search = '', fallback = '/') {
  const params = new URLSearchParams(search || '');
  return sanitizeNextPath(params.get('next'), fallback);
}

export function buildAuthHref(basePath = '/login', nextPath = null) {
  const safeNext = sanitizeNextPath(nextPath, null);
  if (!safeNext) return basePath;
  return `${basePath}?next=${encodeURIComponent(safeNext)}`;
}
