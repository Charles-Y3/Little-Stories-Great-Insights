// Capture beforeinstallprompt early (Settings mounts late).

/** @typedef {'ios' | 'android' | 'desktop'} InstallGuideKind */

/** @typedef {Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }} BeforeInstallPromptEvent */

/** @type {BeforeInstallPromptEvent | null} */
let deferred = null;

/** @type {Set<() => void>} */
const listeners = new Set();

function notify() {
  for (const cb of listeners) cb();
}

export function registerPwaInstall() {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = /** @type {BeforeInstallPromptEvent} */ (e);
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

export function getDeferredInstallPrompt() {
  return deferred;
}

/** @param {() => void} cb */
export function subscribePwaInstall(cb) {
  listeners.add(cb);
  cb();
  return () => {
    listeners.delete(cb);
  };
}

/** @returns {Promise<'accepted' | 'dismissed' | 'unavailable'>} */
export async function promptPwaInstall() {
  if (!deferred) return "unavailable";
  const event = deferred;
  deferred = null;
  notify();
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome;
}

export function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean(/** @type {Navigator & { standalone?: boolean }} */ (navigator).standalone)
  );
}

export function isIosDevice() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iPadOs = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

export function isAndroidDevice() {
  return /Android/i.test(navigator.userAgent);
}

/** @returns {InstallGuideKind} */
export function installGuideKind() {
  if (isIosDevice()) return "ios";
  if (isAndroidDevice()) return "android";
  return "desktop";
}
