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

// Fixed filename (no date stamp) so repeat exports to the same downloads
// folder are recognizable as "the same file" and easy to manually replace,
// even though the browser — not this code — decides whether to overwrite,
// rename, or prompt.
export function downloadBackup() {
  const backup = buildBackup();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "little-stories-backup.json";
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
