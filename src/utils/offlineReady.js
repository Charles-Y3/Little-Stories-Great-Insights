// Best-effort offline readiness: service worker controlling + shell cached.
// Story content ships in the JS bundle; images and fonts are precached via
// Workbox globPatterns (see vite.config.js).

function hasServiceWorkerSupport() {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator;
}

export function getOfflineReady() {
  if (typeof window === "undefined") return false;
  if (!hasServiceWorkerSupport()) {
    // No SW (e.g. unsupported browser): page assets already loaded with this visit.
    return true;
  }
  return Boolean(navigator.serviceWorker.controller);
}

/** Subscribe to offline-ready changes. Calls listener(boolean). Returns unsubscribe. */
export function subscribeOfflineReady(listener) {
  if (typeof window === "undefined") return () => {};

  const emit = () => listener(getOfflineReady());

  emit();

  if (!hasServiceWorkerSupport()) {
    window.addEventListener("online", emit);
    window.addEventListener("offline", emit);
    return () => {
      window.removeEventListener("online", emit);
      window.removeEventListener("offline", emit);
    };
  }

  const onControllerChange = () => emit();
  navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

  let cancelled = false;
  navigator.serviceWorker.ready.then(() => {
    if (!cancelled) emit();
  });

  // Recheck shortly after load — SW may claim after first paint.
  const t1 = window.setTimeout(emit, 500);
  const t2 = window.setTimeout(emit, 2000);

  return () => {
    cancelled = true;
    window.clearTimeout(t1);
    window.clearTimeout(t2);
    navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  };
}
