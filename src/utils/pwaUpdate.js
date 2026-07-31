// Capture waiting service-worker updates and let the UI prompt before reload.
// Requires vite-plugin-pwa `registerType: 'prompt'`.

import { registerSW } from "virtual:pwa-register";

/** @typedef {(needRefresh: boolean) => void} NeedRefreshListener */

/** @type {((reloadPage?: boolean) => Promise<void>) | undefined} */
let updateSW;

let needRefresh = false;

/** @type {Set<NeedRefreshListener>} */
const listeners = new Set();

/** @param {boolean} next */
function emit(next) {
  needRefresh = next;
  for (const cb of listeners) cb(needRefresh);
}

/**
 * Register the service worker and surface "new version available" to the UI.
 * Call once from main.jsx before React mounts.
 */
export function registerPwaUpdates() {
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      emit(true);
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      // Recheck periodically while a tab stays open for days.
      window.setInterval(() => {
        void registration.update();
      }, 60 * 60 * 1000);
    }
  });
}

/** @param {NeedRefreshListener} cb */
export function subscribePwaNeedRefresh(cb) {
  listeners.add(cb);
  cb(needRefresh);
  return () => {
    listeners.delete(cb);
  };
}

/** Activate the waiting worker and reload so the new build runs. */
export function applyPwaUpdate() {
  void updateSW?.(true);
}
