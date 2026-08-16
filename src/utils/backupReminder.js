// Tracks when the user last got their data out of the browser (export,
// folder auto-save, or enabling folder backup) so we can nudge them if it's
// been a while — the main safety net for browsers without folder auto-save.
import { lsgiKey } from "./storage";

const LAST_BACKUP_KEY = lsgiKey("lastBackupAt");
const SNOOZE_KEY = lsgiKey("backupReminderSnoozeUntil");
const JUST_IMPORTED_KEY = lsgiKey("justImported");
const REMINDER_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

export function recordBackup() {
  localStorage.setItem(LAST_BACKUP_KEY, String(Date.now()));
}

export function snoozeBackupReminder() {
  localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
}

export function shouldShowBackupReminder(hasData) {
  if (!hasData) return false;
  const snoozeUntil = Number(localStorage.getItem(SNOOZE_KEY)) || 0;
  if (Date.now() < snoozeUntil) return false;
  const lastBackupAt = Number(localStorage.getItem(LAST_BACKUP_KEY)) || 0;
  if (!lastBackupAt) return true;
  return Date.now() - lastBackupAt > REMINDER_INTERVAL_MS;
}

// Set right before reloading after a successful import (folder auto-save
// can't be restored from an import — a FileSystemDirectoryHandle isn't
// serializable, and browsers won't silently re-grant folder access after
// storage was cleared, which is normally why an import is happening at
// all). Read once on the next load, then cleared, so it surfaces exactly
// one explanatory nudge instead of nagging every subsequent visit.
export function flagJustImported() {
  localStorage.setItem(JUST_IMPORTED_KEY, "1");
}

export function consumeJustImportedFlag() {
  const flagged = localStorage.getItem(JUST_IMPORTED_KEY) === "1";
  if (flagged) localStorage.removeItem(JUST_IMPORTED_KEY);
  return flagged;
}
