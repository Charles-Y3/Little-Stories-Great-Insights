// Export/import the app's own localStorage data (insights, settings, reading
// language) as a single JSON file — the only backup mechanism available since
// everything lives client-side only. Wired in from day one: insights are
// hand-written reflections with no server copy, so losing localStorage means
// losing them for good.
import { lsgiKey, readJSON, writeJSON } from "./storage";
import { recordBackup } from "./backupReminder";

const BACKUP_KEYS = ["insights", "settings", "contentLanguage"];

export function buildBackup() {
  const data = {};
  for (const key of BACKUP_KEYS) {
    data[key] = readJSON(lsgiKey(key), null);
  }
  return {
    app: "little-stories-great-insights",
    schema: 1,
    exportedAt: new Date().toISOString(),
    data
  };
}

// Timestamped filename (down to the minute): a plain browser download can't
// be overwritten in place — the browser silently appends "(1)", "(2)" etc.
// to repeat downloads of the same name — so an undated fixed name risks the
// user later importing a stale file with no way to tell it apart from the
// latest one. The folder auto-save path (folderBackup.js) is the one place
// a fixed name is safe, because it genuinely overwrites via the File System
// Access API instead of going through the browser's download manager.
export function downloadBackup() {
  const backup = buildBackup();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
  const a = document.createElement("a");
  a.href = url;
  a.download = `little-stories-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  recordBackup();
}

export function isValidBackup(obj) {
  return Boolean(
    obj && obj.app === "little-stories-great-insights" && obj.data && typeof obj.data === "object"
  );
}

export function applyBackup(obj) {
  if (!isValidBackup(obj)) throw new Error("Invalid backup file");
  for (const key of BACKUP_KEYS) {
    if (Object.prototype.hasOwnProperty.call(obj.data, key) && obj.data[key] != null) {
      writeJSON(lsgiKey(key), obj.data[key]);
    }
  }
}

export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)));
      } catch {
        reject(new Error("Could not parse backup file"));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.readAsText(file);
  });
}
