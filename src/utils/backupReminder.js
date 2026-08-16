// Tracks when the user last got their data out of the browser (export,
// folder auto-save, or enabling folder backup) so we can nudge them if it's
// been a while — the main safety net for browsers without folder auto-save.
import { lsgiKey } from "./storage";

const LAST_BACKUP_KEY = lsgiKey("lastBackupAt");
const SNOOZE_KEY = lsgiKey("backupReminderSnoozeUntil");
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
