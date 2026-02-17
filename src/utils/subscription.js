const SUB_KEY = 'saudilab_subscription_v1';

export function hasSubscription() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SUB_KEY) === 'active';
}

export function activateSubscription() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUB_KEY, 'active');
}

export function clearSubscription() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SUB_KEY);
}
