const API_URL = 'http://localhost:5000';

export function setToken(token) {
  localStorage.setItem('saudilab_token_v1', token);
}

export function getToken() {
  return localStorage.getItem('saudilab_token_v1');
}

export function clearToken() {
  localStorage.removeItem('saudilab_token_v1');
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function getMe() {
  return api('/auth/me');
}
