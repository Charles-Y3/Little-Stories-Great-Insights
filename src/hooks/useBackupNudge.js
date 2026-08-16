import { useCallback, useState } from "react";
import { autoSaveIfEnabled } from "../utils/folderBackup";
import { shouldShowBackupReminder, snoozeBackupReminder } from "../utils/backupReminder";
import { downloadBackup } from "../utils/backup";

// Call triggerAfterChange() right after an insight write. If it was silently
// auto-saved to a folder, nothing surfaces. Otherwise — the common case on
// Firefox/Safari/iOS, where folder auto-save doesn't exist — it shows an
// export nudge, gated by the same 14-day/snooze rule as the Settings
// reminder so writing several insights in a row doesn't spam the user.
export default function useBackupNudge() {
  const [visible, setVisible] = useState(false);

  const triggerAfterChange = useCallback(() => {
    void autoSaveIfEnabled().then((saved) => {
      if (!saved && shouldShowBackupReminder(true)) setVisible(true);
    });
  }, []);

  const exportNow = useCallback(() => {
    downloadBackup();
    setVisible(false);
  }, []);

  const dismiss = useCallback(() => {
    snoozeBackupReminder();
    setVisible(false);
  }, []);

  return { showNudge: visible, triggerAfterChange, exportNow, dismiss };
}
