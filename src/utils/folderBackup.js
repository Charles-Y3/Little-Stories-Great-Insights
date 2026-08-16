// Optional on-device auto-save: once the user grants a folder via the File
// System Access API, every write overwrites one fixed file in that folder
// instead of producing a new download each time. Chromium-only; callers must
// fall back to backup.js's downloadBackup() where this isn't supported.
import { lsgiKey } from "./storage";
import { buildBackup, downloadBackup } from "./backup";
import { recordBackup } from "./backupReminder";

const DB_NAME = "lsgi-fs";
const STORE_NAME = "handles";
const HANDLE_KEY = "backupDir";
const BACKUP_FILENAME = "little-stories-backup.json";

const ENABLED_KEY = lsgiKey("autoSaveFolderEnabled");
const FOLDER_NAME_KEY = lsgiKey("autoSaveFolderName");

export function isFolderBackupSupported() {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

export function isFolderBackupEnabled() {
  return localStorage.getItem(ENABLED_KEY) === "1";
}

export function getFolderName() {
  return localStorage.getItem(FOLDER_NAME_KEY) || "";
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Could not open IndexedDB"));
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error || new Error("Could not read from IndexedDB"));
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Could not write to IndexedDB"));
  });
}

async function idbDelete(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Could not write to IndexedDB"));
  });
}

async function writeBackupToFolder(dirHandle) {
  const fileHandle = await dirHandle.getFileHandle(BACKUP_FILENAME, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(buildBackup(), null, 2));
  await writable.close();
  recordBackup();
}

// Must be called from within a user gesture (click handler) — showDirectoryPicker
// requires transient activation.
export async function enableFolderBackup() {
  if (!isFolderBackupSupported()) throw new Error("File System Access API not supported");
  const dirHandle = await window.showDirectoryPicker({ id: "lsgi-backup", mode: "readwrite" });
  await idbSet(HANDLE_KEY, dirHandle);
  localStorage.setItem(ENABLED_KEY, "1");
  localStorage.setItem(FOLDER_NAME_KEY, dirHandle.name);
  await writeBackupToFolder(dirHandle);
  return dirHandle.name;
}

export async function disableFolderBackup() {
  await idbDelete(HANDLE_KEY);
  localStorage.removeItem(ENABLED_KEY);
  localStorage.removeItem(FOLDER_NAME_KEY);
}

// Returns a writable directory handle, re-requesting permission if needed
// (only succeeds if called within a user gesture), or null if unavailable.
async function getVerifiedHandle() {
  const handle = await idbGet(HANDLE_KEY);
  if (!handle) return null;
  const opts = { mode: "readwrite" };
  if ((await handle.queryPermission(opts)) === "granted") return handle;
  try {
    if ((await handle.requestPermission(opts)) === "granted") return handle;
  } catch {
    // requestPermission throws outside a user gesture — treat as unavailable.
  }
  return null;
}

// Silent, best-effort: writes to the saved folder if auto-save is on and
// permission is still valid; does nothing (and never throws) otherwise.
export async function autoSaveIfEnabled() {
  if (!isFolderBackupEnabled()) return false;
  try {
    const handle = await getVerifiedHandle();
    if (!handle) return false;
    await writeBackupToFolder(handle);
    return true;
  } catch {
    return false;
  }
}

// Explicit save-now used by the Export button when folder mode is on —
// surfaces failures instead of swallowing them.
export async function saveToFolderNow() {
  const handle = await getVerifiedHandle();
  if (!handle) throw new Error("Folder access is no longer available");
  await writeBackupToFolder(handle);
}

// The single "what should clicking Export actually do" decision, shared by
// every Export entry point (Settings button, the write-triggered nudge) so
// they can't drift apart: reuse an already-granted folder (silent
// overwrite); if none is granted yet, ask for one now — never default
// straight to a download when the folder flow is available. Falls back to
// a timestamped download only when the File System Access API isn't
// supported, or the folder step genuinely fails (a cancelled picker does
// nothing, rather than surprising the user with an unrequested download).
export async function exportSmart() {
  if (isFolderBackupEnabled()) {
    try {
      await saveToFolderNow();
      return { mode: "folder", folderName: getFolderName() };
    } catch (err) {
      downloadBackup();
      return { mode: "download", error: err };
    }
  }
  if (isFolderBackupSupported()) {
    try {
      const name = await enableFolderBackup();
      return { mode: "folder", folderName: name, justEnabled: true };
    } catch (err) {
      if (err?.name === "AbortError") return { mode: "cancelled" };
      downloadBackup();
      return { mode: "download", error: err };
    }
  }
  downloadBackup();
  return { mode: "download" };
}
