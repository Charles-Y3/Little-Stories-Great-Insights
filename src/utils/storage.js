const PREFIX = "lsgi:";

export function lsgiKey(name) {
  return `${PREFIX}${name}`;
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private browsing, quota exceeded) — fail silently
  }
}
