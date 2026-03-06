export const LEARNING_MODE_GUIDED = 'guided';
export const LEARNING_MODE_FREE = 'free';
export const LEARNING_MODE_EVENT = 'saudilab_learning_mode_changed';
const LEARNING_MODE_CACHE_KEY = 'saudilab_learning_mode_cache';

const VALID_LEARNING_MODES = new Set([LEARNING_MODE_GUIDED, LEARNING_MODE_FREE]);

let currentLearningMode = LEARNING_MODE_GUIDED;
if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
  currentLearningMode = normalizeLearningMode(sessionStorage.getItem(LEARNING_MODE_CACHE_KEY));
}

export function normalizeLearningMode(value) {
  const raw = String(value || '').trim().toLowerCase();
  return VALID_LEARNING_MODES.has(raw) ? raw : LEARNING_MODE_GUIDED;
}

export function isStoredLearningMode(value) {
  const raw = String(value || '').trim().toLowerCase();
  return VALID_LEARNING_MODES.has(raw);
}

export function getCurrentLearningMode() {
  return currentLearningMode;
}

export function isFreeExplorationMode(mode = currentLearningMode) {
  return normalizeLearningMode(mode) === LEARNING_MODE_FREE;
}

export function setCurrentLearningMode(mode, { emit = true } = {}) {
  const normalized = normalizeLearningMode(mode);
  if (normalized === currentLearningMode) {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(LEARNING_MODE_CACHE_KEY, normalized);
    }
    return normalized;
  }
  currentLearningMode = normalized;
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(LEARNING_MODE_CACHE_KEY, normalized);
  }

  if (emit && typeof window !== 'undefined') {
    window.dispatchEvent(new Event(LEARNING_MODE_EVENT));
  }

  return normalized;
}

export function getProfileLearningMode(profile) {
  return normalizeLearningMode(profile?.learning_mode);
}
