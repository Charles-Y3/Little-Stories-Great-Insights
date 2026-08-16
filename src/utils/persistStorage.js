// Asks the browser to mark this origin's storage as persistent, so it's less
// likely to be silently evicted under storage pressure. Supported in
// Chromium and Firefox; harmless no-op where unsupported (e.g. Safari).
export async function requestPersistentStorage() {
  if (!navigator.storage?.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
